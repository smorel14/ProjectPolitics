const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const voteSchema = new Schema({
  _owner : {type: Schema.Types.ObjectId, ref:'User'},
  _article: {type: Schema.Types.ObjectId, ref:'Article'},
  option: {type: String, required: true, enum: ['for', 'against']},
  visible: {type: String, enum: ['visible', 'not visible']}
  
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;
