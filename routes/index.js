const express = require('express');
const router  = express.Router();
const Article = require('../models/Article')


router.get('/', (req, res, next) => {
  Article.find()
  .then(articlesFromDb => {
    res.render('index', {
      articles: articlesFromDb
    })
  })
})


// router.get('/:articlesId', (req, res, next) => {
//   let articlesId = req.params.articlesId
//   Article.findById(articlesId)
//     .then(articlesFromDb => {
//       res.render('index', {
//         articles: articlesFromDb
//       })
//     })
// })

module.exports = router