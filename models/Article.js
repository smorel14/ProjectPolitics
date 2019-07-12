const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const articlesSchema = new Schema({
  title: String,
  description: String,
  imgArticle: {type: String, default: "/images/default-article-image.jpg"},
  link: String, 
  date: String,
  votingDate: String,
  voteYes: [{type: Schema.Types.ObjectId, ref:"User"}],
  //voteYes: {type: Array, default: []},
  voteNo: [{type: Schema.Types.ObjectId, ref:"User"}]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Article = mongoose.model('Article', articlesSchema);
module.exports = Article;






