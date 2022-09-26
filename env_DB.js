
const PORT = 8080; // default port 8080
const bcrypt = require("bcrypt");
//local database
const userDatabase = {
  1:{
    'id':1,
    'name':'Kevin',
    'email':"kevinkas@gmail.com",
    'password':bcrypt.hashSync('test1234',1),
    'urlDatabase':{
      "b2xVn2": "http://www.lighthouselabs.ca",
      "9sm5xK": "http://www.google.com"
    }
  },
  2:{
    'id':2,
    'name':'test1',
    'email':"test1@gmail.com",
    'password':bcrypt.hashSync('1234',1),
    'urlDatabase':{
      "b2xmn2": "http://www.lighthouselabs.ca",
      "9sD5xK": "http://www.canadadz.com"
    }
  },
  3:{
    'id':3,
    'name':'test2',
    'email':"test2@gmail.com",
    'password':bcrypt.hashSync('1234',1),
    'urlDatabase':{
      "Z2xVn2": "http://www.ibm.com",
      "6sm5xK": "http://www.blogchina.com"
    }
  }
};

module.exports = {PORT,userDatabase};