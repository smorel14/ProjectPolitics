const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const voteSchema = new Schema({
  _ownerID : {type: Schema.Types.ObjectId, ref:'User'},
  _articleID: {type: Schema.Types.ObjectId, ref:'Articles'},
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