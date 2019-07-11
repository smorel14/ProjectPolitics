const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const uploadCload = require("../congfig/cloudinary");
const User = require("../models/User");
const Vote = require("../models/Vote");
const { checkAdmin, checkUser } = require("../middlewares/middlewares");


//Gonna leave this here in case of trouble

// router.get("/", (req, res, next) => {
//   Article.find().then(articlesFromDb => {
//     res.render("index", {
//       articles: articlesFromDb,
//       title: "News"
//     });
//   });
// });

// router.get("/addArticle", (req, res, next) => {
//   console.log("we are here");
//   res.render("addArticle");
// });

// router.post("/addArticle", uploadCload.single("photo"), (req, res, next) => {
//   const { title, description, link, date, votingDate } = req.body;
//   const imgArticle = req.file.url;
//   Article.create({ title, description, link, date, votingDate, imgArticle })
//     .then(articles => {
//       res.redirect("/");
//     })
//     .catch(error => {
//       console.log(error);
//     });
// });

// router.get("/editProfile", (req, res, next) => {
//   res.render("edit-profile");
// });

// router.post("/editProfile", uploadCload.single("photo"), (req, res, next) => {
//   let id = req.user.id;
//   let imgArticle = "";
//   if (req.file) {

router.get("/", (req, res, next) => {
  Article.find().then(articlesFromDb => {
    res.render("index", {
      articles: articlesFromDb,
      title: "News"
    });
  });
});

router.get("/addArticle", checkAdmin, (req, res, next) => {
  console.log("we are here");
  res.render("addArticle");
});

router.post(
  "/addArticle",
  checkAdmin,
  uploadCload.single("photo"),
  (req, res, next) => {
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
  res.render("edit-profile");
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

router.get("/voting/:articlesId", (req, res, next) => {
  let articlesId = req.params.articlesId;
  Article.findById(articlesId).then(articleFromDb => {
    res.render("voting", {
      article: articleFromDb
    });
  });
});

router.get("/profile/:userId", (req, res, next) => {
  let userId = req.params.userId;
  User.findById(userId).then(userFromDb => {
    res.render("profile", {
      user: userFromDb
    });
  });
});

// router.get('/profile/:userId', checkUser,(req, res, next) => {
//   let userId = req.params.userId
//   User.findById(userId)
//     .then(userFromDb => {
//       res.render('profile', {
//         user: userFromDb,
//       })
//     })
//   })

router.get("/voting/:articlesId", checkUser, (req, res, next) => {
  let articlesId = req.params.articlesId;
  Article.findById(articlesId).then(articleFromDb => {
    res.render("voting", {
      article: articleFromDb
    });
  });
});



router.post("/voting/:articlesId", (req, res, next) => {
  let _owner = req.user.id;
  let option = req.body.select1;
  let visible = req.body.select2;
  let _article = req.params.articlesId;
  console.log('option', option, _owner, visible, _article);
  if (option && visible){
    Article.findById(_article)
    .then( (article) =>{
      for(let i = 0; i < article.voteYes.length; i++){
        console.log('check if the same', article.voteYes[i], req.user.id)
        if(article.voteYes[i].toString() === req.user.id.toString()){
        console.log('check if the same', article.voteYes[i], req.user.id)
          res.redirect("alreadyVoted");
          return;
        }

      }
      if(option === 'for'){
        console.log('article', article.voteNo, option, req.user.id)
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
    res.render("voting", { message: "please fill out the ID" });
  }
  });



// router.post('/voting', (req,res,next)=>{
//   console.log("working?")

//   .then( => {
//     res.redirect('/');
//   }).catch( error => {
//     console.log(error);
//   })
// });

// router.post('/profile', (req, res, next) => {
//   let userId = req.params.userId
//   let imgUser = req.user.profilePicture
//   User.findById(userId)
//     .then(userFromDb => {
//       res.render('profile', {
//         user : userFromDb,
//         // profilePicture: imgUser,
//       })
//     })
// })

router.get("/profileList", (req, res, next) => {
  
  res.render("profile-list");
});

router.post("/profileList", (req, res, next) => {
    let userId = req.params.userId;
    let name = req.body.name
    let searchName = new RegExp(`${name}`, "i")
    console.log("name is", name)
    User.find({name: searchName})
      .then(userFromDb => {
        console.log("user coming", userFromDb)
      res.render('profile-list', {
        user: userFromDb,
        userId: userId
    });
  })
});

//User.find({name: name})


  // let party = req.body.party
  //   User.find({party: party})
  //     .then(partyFromDb =>{
  //       res.render('profile-list', {
  //       party : partyFromDb  

  //     })
  //   })
    

// router.post("/profileList", (req, res, next) => {
//   let userId = req.params.userId

//   User.find({
//     $text: {
//       $search: userId
//     }
//   }, {
//     _id: 0,
//   }, function(err, data){
//     res.json(data);
    
//   }).limit(4);
// });



module.exports = router;







  // router.get('/', (req, res, next) => {
  //   let totalVotesList = [];
  //   Article.find()
  //     .then(articles => {
  //       articles.map( article => {
  //         Vote.find({_articleID : article.id})
  //         .then(votes => {
  //           //console.log('article', article)
  //          // console.log('vote', votes.length)
  //           totalVotesList.push([article.id, votes.length])
  //         })
  //       })
  //       console.log('totalVotesList', totalVotesList)
  //       //console.log('article2', articles)
  //       })
  //       res.render('index', {
  //         totalVotesList: totalVotesList,
  //         title: "News"
  //     })
  //     })



  // router.get('/', (req, res, next) => {
  //   let totalVotesList = [];
  //   let newidea = [];
  //   Article.find()
  //     .then(articles => {
  //       articles.map( article => {
  //         Vote.find({_articleID : article.id})
  //         .then(votes => {
  //           //console.log('article', article)
  //          // console.log('vote', votes.length)
  //           totalVotesList.push([article.id, votes.length])
  //         })
  //         .then(() => {
  //          console.log(totalVotesList)
  //         })
  //       })
  //       //console.log('totalVotesList', newidea)
  //       //console.log('article2', articles)
  //       })
  //       res.render('index', {
  //         totalVotesList: totalVotesList,
  //         title: "News"
  //     })
  //     })




      // router.get('/', (req, res, next) => {
      //   let totalVotesList = [];
      //   Article.find()
      //     .then(articles => {
      //       for(let i = 0; i < articles.length; i++){
      //         Vote.find({_articleID : articles[i].id})
      //         .then(votes => {
      //           //console.log('article', article)
      //          // console.log('vote', votes.length)
      //          console.log(i, 'totalVotesList', totalVotesList)
      //          totalVotesList = totalVotesList.push([articles[i].id, votes.length])
      //         })
      //       }
      //       console.log('totalVotesList', totalVotesList)
      //       //console.log('article2', articles)
      //       })
      //       res.render('index', {
      //         totalVotesList: totalVotesList,
      //         title: "News"
      //     })
      //     })

      // router.get('/', (req, res, next) => {
      //   Vote.find()
      //   .populate("_articleID")
      //   .then (votes => {
          
      //   })
        
      // })
     
  


        //   router.get('/', (req, res, next) => {
        //     Promise.all([
        //       Article.find(),
        //       Vote.find({_articleID : articles[i].id})
        //     ]).then((responses)=>{
        //       res.render('index', {
        //         responses: responses,
        //         title: "News"
        //     })
        //   })
        // })




  // router.get('/', (req, res, next) => {
  //   let totalVotesList = [];
  //   Article.find()
  //     .then(articles => {
  //       for(let i = 0; i < articles.length; i++){
  //         Vote.find({_articleID : articles[i].id})
  //         .then(votes => {
  //           console.log('votes', votes[0])
  //           res.render('index', {
  //             articles: articles,
  //             title: "News",
  //         })
  //     })
  //   }
  //   })
  // })


//     router.get('/', (req, res, next) => {
//       let listVotes
//     Article.find()
//       .then(articles => {
//         for(let i = 0; i < articles.length; i++){
//           Vote.find({_articleID : articles[i].id})
//           .then(votes => {
//           })
//     }
//     res.render('index', {
//       articles: articles,
//       votes: votes,
//       title: "News",
// })
//     })
//   })
