const express = require('express');
const router  = express.Router();
const Article = require('../models/Article')


/* GET home page */
router.get('/', (req, res, next) => {
  Article.find()
  .then(articlesFromDb => {
    res.render('article-detail', {
      articles: articlesFromDb
    })
  })
})

router.get('/:articlesId', (req, res, next) => {
  let articlesId = req.params.articlesId
  Article.findById(articlesId)
    .then(articlesFromDb => {
      res.render('article-detail', {
        articles: articlesFromDb
      })
    })
})


module.exports = router;
