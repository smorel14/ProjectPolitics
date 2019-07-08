const express = require('express')
const Article = require('../models/Article')
const router  = express.Router()


router.get('/', (req, res, next) => {
  console.log('TEST')

  Article.find()
    .then(articlesFromDb => {
      console.log('articlesFromDb', articlesFromDb)
      res.render('index', {
        articles: articlesFromDb
      })
    })
})


router.get('/:articlesId', (req, res, next) => {
  let articlesId = req.params.articlesId
  Article.findById(articlesId)
    .then(articlesFromDb => {
      res.render('index', {
        articles: articlesFromDb
      })
    })
})

module.exports = router