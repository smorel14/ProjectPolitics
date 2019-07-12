const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const uploadCload = require("../congfig/cloudinary");
const User = require("../models/User");
const Vote = require("../models/Vote");
const { checkAdmin, checkUser } = require("../middlewares/middlewares");
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth:{
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
})

router.get("/", (req, res, next) => {
  Article.find().then(articles => {
    // let yes = articles[0].voteYes;
    // console.log(yes);
    res.render("index", {
      articles: articles,
      title: "News",
       message: req.query.errorMessage
     // percentageVotes: 
    })
  });
});


router.get("/addArticle", checkAdmin, (req, res, next) => {
  console.log("we are here");
  res.render("addArticle",{
    title: "Add Article",
  });
});

router.post(
  "/addArticle",
  checkAdmin,
  uploadCload.single("photo"),
  (req, res, next) => {
    console.log("we are in");
    const { title, description, link, date, votingDate } = req.body;
    const imgArticle = req.file.url;
    Article.create({ title, description, link, date, votingDate, imgArticle })
      .then(articles => {
        res.redirect("/");
      })
      .catch(error => {
        console.log(error);
      });
  }
);

router.get("/editProfile", checkUser, (req, res, next) => {
  res.render("edit-profile",{
    title: "Edit Profile",
  });
});

router.post(
  "/editProfile",
  checkUser,
  uploadCload.single("photo"),
  (req, res, next) => {
    let id = req.user.id;
    let imgArticle = "";
    if (req.file) {
      imgArticle = req.file.url;
    } else {
      imgArticle = req.user.profilePicture;
    }
    User.findByIdAndUpdate(id, {
      name: req.body.name,
      politicalView: req.body.politicalView,
      party: req.body.party,
      profilePicture: imgArticle
    }).then(() => {
      res.redirect("/");
    });
  }
);

router.get("/profile/:userId", (req, res, next) => {
  let userId = req.params.userId;
  //User.findById(userId).then(user => {

  Promise.all(
    [
      User.findById(userId),
      Vote.find({ _owner: userId })
      .populate("_owner")
      .populate("_article")
    ])
    .then((responses) => {
      res.render("profile", {
        user: responses[0],
        vote: responses[1]
    })
  });
});


  // Vote.find({ _owner: userId })
  //   .populate("_owner")
  //   .populate("_article")
  //   .then(vote => {
  //     console.log("vote", vote);
  //     res.render("profile", {
  //       vote: vote
  //     });
  //   });



// Promise.all([
//   Article.find(),
//   Article.findById(articlesId)
// ]).then(responses => {



// router.get("/profile/:userId", (req, res, next) => {
  //   let userId = req.params.userId;
  //   User.findById(userId).then(user => {
    //     res.render("profile", {
      //       user: user
      //     });
      //   });
      // });
      
      
      
      // router.get('/profile/:userId', checkUser,(req, res, next) => {
        //   let userId = req.params.userId
        //   User.findById(userId)
        //     .then(userFromDb => {
          //       res.render('profile', {
            //         user: userFromDb,
            //       })
            //     })
            //   })
            
            // router.get("/voting/:articlesId", checkUser, (req, res, next) => {
              //   let articlesId = req.params.articlesId;
              //   Article.findById(articlesId).then(articleFromDb => {
                //     res.render("voting", {
                  //       article: articleFromDb,
                  //       title: "Vote"
                  //     });
                  //   });
                  // });
                  
router.get("/voting/:articlesId", (req, res, next) => {
  let articlesId = req.params.articlesId;
  let message = '';

  if(!req.user){
    res.redirect("/auth/login?errorMessage= Please log in, in order to vote.");
  }

  Promise.all([
    Article.find(),
    Article.findById(articlesId)
  ]).then(responses => {

    console.log('voting time')
    for (let i = 0; i < responses[1].voteYes.length; i++){
     // console.log('responses[1].voteYes[i].toString()', responses[1].voteYes[i].toString(), req.user.id.toString())
      if (responses[1].voteYes[i].toString() === req.user.id.toString()){
        message = "You can't vote more than once";
      }
    }
    for (let j = 0; j < responses[1].voteNo.length; j++){

     // console.log('responses[1].voteNo[i].toString()', responses[1].voteYes[i].toString(), req.user.id.toString())
      if (responses[1].voteNo[j].toString() === req.user.id.toString()){
        message = "You can't vote more than once";
        console.log('message', message)
      }
    }
    
    console.log('message', message)
    if (message === ''){
      res.render("voting", {
        article: responses[1],
        message: req.query.errorMessage,
        title: "Vote",
      });
    }
    else{
     // req.session.error = "You can't vote more than once";

     res.redirect("/?errorMessage= You can't vote more than once");
     // res.redirect("/");
    }
  });
});


// res.render("index", {
//   articles: articles,
//   title: "News",
//  // percentageVotes: 
// });


router.post("/voting/:articlesId", (req, res, next) => {
  let _owner = req.user.id;
  let option = req.body.select1;
  let visible = req.body.select2;
  let _article = req.params.articlesId;
  console.log("option", option, _owner, visible, _article);
  if (option && visible) {
    Article.findById(_article)
    .then( (article) =>{
      for(let i = 0; i < article.voteYes.length; i++){
      //  console.log('check if the same', article.voteYes[i], req.user.id)
        if(article.voteYes[i].toString() === req.user.id.toString()){
       // console.log('check if the same', article.voteYes[i], req.user.id)
          res.render("alreadyVoted");
          return;
        }

      }
      if(option === 'Supporting'){
       // console.log('article', article.voteNo, option, req.user.id)
        article.voteYes.push(req.user.id);
        article.save()
      }
      else{
        article.voteNo.push(req.user.id);
        article.save()
      }
      Vote.create({ _owner, _article, option, visible })
      .then(() => {
        res.redirect("/");
      });      
    })
    .catch(err =>{
      res.render("auth/login", { message: "You have an error" });
    })
  }
  else{
    console.log('error is here')
    res.redirect(`/voting/${_article}?errorMessage= To vote you need to select one of the following options:`);
  }
});



router.get("/profileList", checkUser, (req, res, next) => {
  User.find().then(userFromDb => {
    console.log("user coming", userFromDb);
    res.render("profile-list", {
      use: userFromDb,
      title: "Profile List"
      // userId: userId
    });
  });
});

router.post("/profileList", checkUser, (req, res, next) => {
  //let userId = req.params.userId;
  let name = req.body.name;
  let searchName = new RegExp(`${name}`, "i");
  console.log("name is", name);
  User.find({ name: searchName }).then(userFromDb => {
    console.log("user coming", userFromDb);
    res.render("profile-list", {
      user: userFromDb
      // userId: userId
    });
  });
});

// router.post("/searchArticle", (req, res, next) => {
  
//   let article = req.body.article;
//   let searchArticle = new RegExp(`${article}`, "i");
//   console.log("name is", article);
//   Article.find({ article: searchArticle }).then(articleFromBd => {
//     console.log("article coming", articleFromBd);
//     res.render("/", {
//       article: articleFromBd
      
//     });
//   });
// });


router.post("/send-email", (req, res, next) => {
  //let user = (req.body.user)
  let user = req.user
  const email = req.body.email
  //let article = req.article._id
  console.log("THIS IS THE USER",user )
    transporter.sendMail({
        from: ` Email sent by ${user.name}`,
        to: email,
        text: `Check this vote: http://localhost:3000/voting`
        
      })
      .then(info => {
        
        res.redirect("/");
        // res.render('message', { email, subject, message })
      })
      .catch(console.log);
  })




module.exports = router;

