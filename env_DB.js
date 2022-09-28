const bcrypt = require("bcrypt");
const userDatabase = {
  1:{
    'id':1,
    'name':'Kevin',
    'email':"kevinkas@gmail.com",
    'password':bcrypt.hashSync('test1234',1),
  },
  2:{
    'id':2,
    'name':'test1',
    'email':"test1@gmail.com",
    'password':bcrypt.hashSync('1234',1),
  },
  3:{
    'id':3,
    'name':'test2',
    'email':"test2@gmail.com",
    'password':bcrypt.hashSync('1234',1),
  }
};

const urlDatabase = {
  1:{
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
  },
  2:{
    "b2xmn2": "http://www.lighthouselabs.ca",
    "9sD5xK": "http://www.canadadz.com"
  },
  3:{
    "Z2xVn2": "http://www.ibm.com",
    "6sm5xK": "http://www.blogchina.com"
  }
};

module.exports = {urlDatabase,userDatabase};