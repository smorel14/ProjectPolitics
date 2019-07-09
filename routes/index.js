const express = require('express');
const router  = express.Router();
const Article = require('../models/Article')
const uploadCload = require('../congfig/cloudinary')


router.get('/', (req, res, next) => {
  Article.find()
    .then(articlesFromDb => {
      res.render('index', {
        articles: articlesFromDb
      })
    })
  })

router.get('/addArticle', (req, res, next) => {
  console.log('we are here');
  res.render('addArticle')
})

router.post('/addArticle', uploadCload.single('photo'), (req,res,next)=>{
  console.log("Wohoooo")
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



module.exports = router





// router.get('/article/:articlesId', (req, res, next) => {
//   let articlesId = req.params.articlesId
//   Article.findById(articlesId)
//     .then(articlesFromDb => {
//       res.render('index', {
//         articles: articlesFromDb
//       })
//     })
// })