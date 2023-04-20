const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register', async (req, res) => {
  const {username, password} = req.body;
  const hashPass = await bcrypt.hash(password, 1)
  
  const newUser = await User.create({
    username: username,
    password: hashPass
  })

  res.send(`successfully created user ${username}`);
})

// // POST /login
// // TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login', async (req, res) => {
  const {username, password} = req.body;

  try {
    const user = await User.findOne({
      where: {
        username: username
      }
    });

    const verify = await bcrypt.compare(password, user.password);

    if (!verify) {
      res.send('incorrect username or password').sendStatus(401);
    }

    res.send(`successfully logged in user ${username}`);
    
  } catch (error) {
    console.error('Error getting user data', error);
  }
  
  
})
// // we export the app, not listening in here, so that we can run tests
module.exports = app;
