// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Articles = require("../models/Article");
const Votes = require("../models/Vote");

const bcryptSalt = 10;

mongoose
  .connect("mongodb://localhost/projectpolitics", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

let users = [
  {
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
    name: 'alice',
    party: "Labour",
    pliticalView: 'Undecided',
    role: "user"


  },
  {
    username: "bob",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    name: "bob",
    party: "Labour",
    pliticalView: 'Changing the world',
    role: "admin"
  },

  {
    username: "boris",
    profilePicture: "/images/borisJohnson.png",
    password: bcrypt.hashSync("boris", bcrypt.genSaltSync(bcryptSalt)),
    name: "Boris Johnson",
    party: "Conservative",
    pliticalView: 'Voting Tory will cause your wife to have bigger breasts and increase your chances of owning a BMW M3',
    role: "admin"
  }


]

User.deleteMany()
  .then(() => {
    return User.create(users);
  })
  .then(usersCreated => {
    console.log(`${usersCreated.length} users created with the following id:`);
    console.log(usersCreated.map(u => u._id));
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect();
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });

//articles
let articles = [
  {
    title: "Brexit: All you need to know about the UK leaving the EU",
    description:
      "Here is an easy-to-understand guide to Brexit - beginning with the basics, then a look at the current negotiations, followed by a selection of answers to questions we've been sent.",
    imgArticle: "https://ichef.bbci.co.uk/news/660/cpsprodpb/2847/production/_90911301_c5b48218-424a-41c4-9b6b-638600ec508f.jpg",
    link: "https://www.bbc.com/news/uk-politics-32810887",
    date: "08-07-2019",
    votingDate: String
  },
  {
    title: "No deal Brexit",
    description: String,
    img: String,
    link: String,
    date: String,
    votingDate: String
  }
];

Articles.deleteMany()
  .then(() => {
    return Articles.create(articles);
  })
  .then(articlesCreated => {
    console.log(
      `${articlesCreated.length} article created with the following id:`
    );
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect();
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });


  let votes = [
    {
      _ownerID : "5d2338109214330a21c45e17",
      _articleID : "5d2338109214330a21c45e1a",
      option: 'for',
      visible: 'visible'
    
    }
  
  ];

  Votes.deleteMany()
  .then(() => {
    return Votes.create(votes);
  })
  .then(votesCreated => {
    console.log(
      `${votesCreated.length} vote created with the following id:`
    );
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect();
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });