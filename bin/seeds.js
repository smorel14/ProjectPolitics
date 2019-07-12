require("dotenv").config();

// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Article = require("../models/Article");
const Votes = require("../models/Vote");

const bcryptSalt = 10;

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
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
    email: "david",
    profilePicture: "/images/cameron.jpg",
    password: bcrypt.hashSync("david", bcrypt.genSaltSync(bcryptSalt)),
    name: "David Cameron",
    party: "Conservative",
    politicalView: "Do you miss me?",
    role: "admin",
    status: "confirmed"
  },
  
  {
    email: "bob",
    profilePicture: "/images/bob1.jpg",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    name: "Bob",
    party: "Labour",
    politicalView: "Changing the world",
    role: "admin",
    status: "confirmed"
  },

  {
    email: "boris",
    profilePicture: "/images/borisJohnson.png",
    password: bcrypt.hashSync("boris", bcrypt.genSaltSync(bcryptSalt)),
    name: "Boris Johnson",
    party: "Conservative",
    politicalView:
      "Voting Tory will cause your wife to have bigger breasts and increase your chances of owning a BMW M3",
    role: "admin",
    status: "confirmed"
  },

  {
    email: "theresa",
    profilePicture: "/images/download.theresa.jpeg",
    password: bcrypt.hashSync("theresa", bcrypt.genSaltSync(bcryptSalt)),
    name: "Theresa May",
    party: "Conservative",
    politicalView: "I do not know what I am doing",
    role: "admin",
    status: "confirmed"
  },

  {
    email: "corbyn",
    profilePicture: "/images/jeremy-corbyn.jpg",
    password: bcrypt.hashSync("corbyn", bcrypt.genSaltSync(bcryptSalt)),
    name: "Jeremy Corbyn",
    party: "Labour",
    politicalView: "Vote labour and I will give you a lot of money!",
    role: "admin",
    status: "confirmed"
  },

  {
    email: "bobbuilder",
    profilePicture: "/images/bob.jpeg",
    password: bcrypt.hashSync("bobbuilder", bcrypt.genSaltSync(bcryptSalt)),
    name: "Bob The Builder",
    party: "Conservative",
    politicalView: "Get back to work",
    role: "admin",
    status: "confirmed"
  },

  {
    email: "vince",
    profilePicture: "/images/vince.jpeg",
    password: bcrypt.hashSync("vince", bcrypt.genSaltSync(bcryptSalt)),
    name: "Vince Cable",
    party: "Liberal Democrats",
    politicalView: "?",
    role: "admin",
    status: "confirmed"
  },

  {
    email: "nigel",
    profilePicture: "/images/Nigel.jpeg",
    password: bcrypt.hashSync("nigel", bcrypt.genSaltSync(bcryptSalt)),
    name: "Nigel Farage",
    party: "Brexit Party",
    politicalView: "Go brexit",
    role: "admin",
    status: "confirmed"
  },

  {
    email: "alice",
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
    name: "Alice",
    party: "Labour",
    politicalView: "Undecided",
    role: "user",
    status: "confirmed"
  },

  
];

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
    title:
      "Are you for or against Brexit? All you need to know about the UK leaving the EU",
    description:
      "Here is an easy-to-understand guide to Brexit - beginning with the basics, then a look at the current negotiations, followed by a selection of answers to questions we've been sent.",
    imgArticle:
      "https://ichef.bbci.co.uk/news/660/cpsprodpb/2847/production/_90911301_c5b48218-424a-41c4-9b6b-638600ec508f.jpg",
    link: "https://www.bbc.com/news/uk-politics-32810887",
    date: "2019-07-08",
    votingDate: "2019-09-03"
  },
  {
    title:
      "Do you want free movement of people between UK and EU? ",
    description:
      "Freedom of movement for EU workers has been front and centre in the Brexit debate. Fear of foreign workers undercutting the wages and working conditions of locals helped to fuel the leave campaign. Now EU nationals – Poles and others – who have called Britain home for years, sometimes decades, face an uncertain future in the UK.",
    imgArticle:
      "https://2ihmoy1d3v7630ar9h2rsglp-wpengine.netdna-ssl.com/wp-content/uploads/2015/12/151223-passport.jpg",
    link: "https://www.theguardian.com/commentisfree/2019/jan/16/freedom-movement-euroep-foreign-posted-workers-eu",
    date: "2018-07-13",
    votingDate: "2019-09-03"
  },
  {
    title: "What is your opinion on 'no deal Brexit'?",
    description: "In a no-deal scenario, the UK would immediately leave the European Union (EU) with no agreement about the 'divorce' process. Overnight, the UK would leave the single market and customs union - arrangements designed to help trade between EU members by eliminating checks and tariffs (taxes on imports).",
    imgArticle:
      "https://g8fip1kplyr33r3krz5b97d1-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/h_54159221-1160x753.jpg",
    link: "https://www.bbc.com/news/uk-politics-48511379",
    date:"2019-07-10",
    votingDate: "2019-10-10"
  },
  {
    title: "Do you want Boris as PM?",
    description:
      "Boris Johnson looks to have won the Conservative leadership contest by a landslide, 12 days before the race is over. According to a poll of 1,319 party members by ConservativeHome,  71 per cent said they had already voted, with 72 per cent backing Mr Johnson and 28 per cent, Jeremy Hunt.",
    imgArticle: "https://cdn.britannica.com/59/143959-004-99295B62.jpg",
    link:
      "https://www.telegraph.co.uk/politics/2019/07/11/tory-leadership-boris-johnson-sees-trump-lifeboat-rescue-brexit/",
    date: "2019-07-10",
    votingDate: "2019-10-20"
  }
];

Article.deleteMany()
  .then(() => {
    return Article.create(articles);
  })
  .then(articlesCreated => {
    console.log(
      `${articlesCreated.length} article created with the following id:`
    );
    console.log(articlesCreated.map(u => u._id));
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
    _owner: "5d2338109214330a21c45e17",
    _article: "5d2338109214330a21c45e1a",
    option: "Supporting",
    visible: "visible"
  },

  {
    _owner: "5d275e5b2b1b8a26940c7f0e",
    _article: "5d275fbdf61aa52702dba0df",
    option: "Supporting",
    visible: "visible"
  },

  {
    _owner: "5d276207c80ac427bd8dd7d9",
    _article: "5d275fbdf61aa52702dba0df",
    option: "Not-Supporting",
    visible: "visible"
  }
];

Votes.deleteMany()
  .then(() => {
    return Votes.create(votes);
  })
  .then(votesCreated => {
    console.log(`${votesCreated.length} vote created with the following id:`);
    console.log(votesCreated.map(u => u._id));
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect();
  })
  .catch(err => {
    mongoose.disconnect();
    throw err;
  });
