const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const articlesSchema = new Schema({
  title: String,
  description: String,
  imgArticle: {type: String, default: "public/images/default-article-image.jpg"},
  link: String,
  date: String,
  votingDate: String

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Article = mongoose.model('Article', articlesSchema);
module.exports = Article;