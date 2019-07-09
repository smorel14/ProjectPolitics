const express = require('express');
const router  = express.Router();
const Article = require('../models/Article')
const uploadCload = require('../congfig/cloudinary')
const User = require('../models/User')


router.get('/', (req, res, next) => {
  Article.find()
    .then(articlesFromDb => {
      res.render('index', {
        articles: articlesFromDb,
        title: "News"
      })
    })
  })

router.get('/addArticle', (req, res, next) => {
  console.log('we are here');
  res.render('addArticle')
})

router.post('/addArticle', uploadCload.single('photo'), (req,res,next)=>{
  const{title, description, link, date, votingDate} = req.body;
  const imgArticle = req.file.url;
  Article.create(
    {title, description, link, date, votingDate, imgArticle}
  ).then(articles => {
    res.redirect('/');
  }).catch( error => {
    console.log(error);
  })
})

router.get('/editProfile', (req, res, next) => {
  res.render('edit-profile')
})

router.post('/editProfile', uploadCload.single('photo'), (req,res,next)=>{
  let id = req.user.id
  console.log('id', id)
  let imgArticle =''
  if (req.file){
    imgArticle = req.file.url;
  }
  else{
    imgArticle = req.user.profilePicture
  }
  User.findByIdAndUpdate(id, {name: req.body.name, 
    pliticalView: req.body.pliticalView, 
    party: req.body.party,
    profilePicture: imgArticle}
    ).then(()=>{
    res.redirect('/');
  })
})



router.get('/voting', (req, res, next) => {
  Article.find()
    .then(articlesFromDb => {
      res.render('voting', {
        articles: articlesFromDb
      })
    })
  })

router.get('/voting/:articlesId', (req, res, next) => {
  let articlesId = req.params.articlesId
  Article.findById(articlesId)
    .then(articleFromDb => {
      res.render('voting', {
        article: articleFromDb,
        
      })
    })
})

router.post('/voting', (req,res,next)=>{
  console.log("working?")
  
  
  // .then( => {
  //   res.redirect('/');
  // }).catch( error => {
  //   console.log(error);
  // })
});


module.exports = router


