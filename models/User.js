const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {type:String, unique:true},
    password: String,
    profilePicture: {type:String, default: '/images/profilePic.jpg'},
    name: {type:String},
    party: {
      type: String,
      default: "Anonymous",
      enum: [
        "Anonymous",
        "Conservative",
        "Labour",
        "Scottish National",
        "Liberal Democrats",
        "Democratic Unionist",
        "Sinn Fein",
        "The Independent Group for Change",
        "Plaid Cymru",
        "Green Party of England and Wales",
        "Brexit Party",
        "Scottish Green",
        "UK Independence Party",
        "Social Democratic",
        "Ulster Unionist",
        "Alliance Party of Northern Ireland",
        "Green Party in Northern Ireland",
        "Traditional Unionist Voice",
        "People Before Profit"
      ]
    },
    politicalView: {type: String, default: "I don't have a politicalView"},
    role: { type: String, enum: ["admin", "user", "politician"] }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
