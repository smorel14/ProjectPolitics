// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const bcryptSalt = 10;

mongoose
  .connect('mongodb://localhost/projectpolitics', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

let users = [
  {
    username: "alice",
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
  return User.create(users)
})
.then(usersCreated => {
  console.log(`${usersCreated.length} users created with the following id:`);
  console.log(usersCreated.map(u => u._id));
})
.then(() => {
  // Close properly the connection to Mongoose
  mongoose.disconnect()
})
.catch(err => {
  mongoose.disconnect()
  throw err
})