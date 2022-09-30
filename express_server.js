/*eslint linebreak-style: ["error", "windows"]*/

const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const {userDatabase,urlDatabase} = require("./env_DB");
const {generateRandomString,locateUserID,verifyID} = require("./functions");
const bcrypt = require("bcrypt");
const PORT = 8080; // default port 8080
const app = express();


//claim and inclue needed varible -----------------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieSession({name: 'usrID', secret: 'Yellow-stone'}));
app.use(morgan('dev'));

//http response part-----------------------------------------------------

app.get("/", (req, res) => {
  if (req.session.usrID) {
    res.redirect('/urls');
  } else {
    res.redirect('/urls/reg');
  }
});

//user's short url database page-----------------------------------------

app.get('/urls',(req,res)=>{
  if (req.session.usrID) {
    const validID = verifyID(req.session.usrID);
    const usrName = userDatabase[req.session.usrID]["email"];
    if (validID) {
      const templateVars = {
        urls:urlDatabase[validID],
        usernam:usrName
      };
      res.render("urls_index", templateVars);
    } else {
      const errorMessage = 'Invalid user,E-mail is not registered.';
      const templateVars = {
        usernam:undefined,
        error:errorMessage
      };
      res.status(400).render("urls_error",templateVars);
    }
  } else {
    const errorMessage = 'User not login!';
    const templateVars = {
      usernam:undefined,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

//user login/register page-------------------------------------------
app.get("/login",(req,res)=>{
  const validID = verifyID(req.session.usrID);
  if (validID) {
    res.redirect("/urls");
  } else {
    res.render("urls_reg",{ urls: {},usernam:undefined});
  }
});

app.get("/register",(req,res)=>{
  const validID = verifyID(req.session.usrID);
  if (validID) {
    res.redirect("/urls");
  } else {
    res.render("urls_reg",{ urls: {},usernam:undefined});
  }
});

app.get("/urls/reg",(req,res)=>{
  const validID = verifyID(req.session.usrID);
  if (validID) {
    res.redirect("/urls");
  } else {
    res.render("urls_reg",{ urls: {},usernam:undefined});
  }
});

//Route to add new URL --------------------------------------------
app.get("/urls/new", (req, res) => {
  const validID = verifyID(req.session.usrID);
  if (validID) {
    const usrName = userDatabase[req.session.usrID]["email"];
    const templateVars = {
      urls:urlDatabase[validID],
      usernam:usrName
    };
    res.render("urls_new",templateVars);
  } else {
    res.redirect("/urls/reg");
  }
});

//Page of check user URL ------------------------------------------

app.get('/urls/:id',(req,res)=>{
  const id = req.params.id;
  const validID = verifyID(req.session.usrID);
  if (validID) {
    const usrName = userDatabase[req.session.usrID]["email"];
    if (urlDatabase[validID][id]) {
      const templateVars = {
        'id':req.params.id,
        'longURL':urlDatabase[validID][id],
        usernam:usrName
      };
      res.render("urls_show", templateVars);
    } else {
      res.send("invalid short url, please check and retry!");
    }
  } else {
    const errorMessage = 'User not login!';
    const templateVars = {
      usernam:undefined,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});
//---------------------------------------------------

app.get("/urls.json", (req, res) => {
  const validID = verifyID(req.session.usrID);
  if (validID) {
    res.json(userDatabase[validID]);
  } else {
    const errorMessage = 'User not login!';
    const templateVars = {
      usernam:undefined,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

//----------redirect to the corresponding URL-------------------

app.get('/u/:id',(req,res)=>{
  const shortURL = req.params.id;
  let flag = null;
  for (let keys in urlDatabase) {
    if (urlDatabase[keys][shortURL]) {
      res.redirect(urlDatabase[keys][shortURL]);
      flag = 1;
    }
  }
  if (!flag) {
    const errorMessage = 'The ShortURL not exist!';
    const usrName = userDatabase[req.session.usrID]["email"];
    const templateVars = {
      usernam:usrName,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});
    
// ---------------------POST Login ------------------------------

app.post("/login",(req,res)=>{
  if (req.body["email"] && req.body["password"]) {
    const validID = locateUserID(req.body["email"]);
    if (validID) {
      const usrName = userDatabase[validID]["email"];
      if (bcrypt.compareSync(req.body["password"],userDatabase[validID]["password"])) {
        req.session.usrID = validID;
        const templateVars = {
          urls:urlDatabase[validID],
          usernam:usrName
        };
        res.render("urls_index", templateVars);
      } else {
        const errorMessage = 'Password is not match!';
        const templateVars = {
          usernam:undefined,
          error:errorMessage
        };
        res.status(400).render("urls_error",templateVars);
      }
    } else {
      const errorMessage = 'Username is not registered!';
      const templateVars = {
        usernam:undefined,
        error:errorMessage
      };
      res.status(400).render("urls_error",templateVars);
    }
  } else {
    const errorMessage = 'Username and Password can not be blank!';
    const templateVars = {
      usernam:undefined,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});
// POST ------------------------register--------------------------------
app.post("/register",(req,res)=>{
  if (req.body["email"] && req.body["password"]) {
    //if the email in wrong format
    if (req.body["email"].includes("@") && req.body["email"].includes('.')) {
      // check if email already exists:
      if (!locateUserID(req.body["email"])) {
        const newId = Object.keys(userDatabase).length + 1;
        userDatabase[newId] = {
          'id':newId,
          'name':req.body["email"].split('@')[0],
          'email':req.body["email"],
          'password': bcrypt.hashSync(req.body["password"],1),
        };
        urlDatabase[newId] = {};
        req.session.usrID = newId;
        const templateVars = {
          urls:urlDatabase[newId],
          usernam:req.body["email"]
        };
        res.render("urls_index", templateVars);
      } else {
        const errorMessage = 'User already registered!';
        const templateVars = {
          usernam:undefined,
          error:errorMessage
        };
        res.status(400).render("urls_error",templateVars);
      }
    } else {
      const errorMessage = 'Invalid E-mail address!';
      const templateVars = {
        usernam:undefined,
        error:errorMessage
      };
      res.status(400).render("urls_error",templateVars);
    }
  } else {
    const errorMessage = 'Username and Password can not be blank!';
    const templateVars = {
      usernam:undefined,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

//----------------------logout---------------------------------------
app.post("/logout",(req,res)=>{
  res.clearCookie("usrID");
  res.clearCookie("usrID.sig");
  res.redirect("/urls");
});

//--------------------POST /urls/:id/delete--------------------------

app.post("/urls/:id/delete",(req,res)=>{
  const id = req.params.id;
  const validID = verifyID(req.session.usrID);
  if (validID) {
    const usrName = userDatabase[req.session.usrID]["email"];
    if (urlDatabase[validID][id]) {
      delete urlDatabase[validID][id];
      res.redirect("/urls");
    } else {
      const errorMessage = 'User do not own the URL!';
      const templateVars = {
        usernam:usrName,
        error:errorMessage
      };
      res.status(400).render("urls_error",templateVars);
    }
  } else {
    const errorMessage = 'User not login!';
    const templateVars = {
      usernam:undefined,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

//--------------------POST /urls/:id/edit--------------------------

app.post("/urls/:id/edit",(req,res)=>{
  const id = req.params.id;
  const validID = verifyID(req.session.usrID);
  if (validID) {
    const usrName = userDatabase[req.session.usrID]["email"];
    if (urlDatabase[validID][id]) {
      const templateVars = {
        'id':req.params.id,
        'longURL':urlDatabase[validID][id],
        usernam:usrName
      };
      res.render("urls_show", templateVars);
    } else {
      const errorMessage = 'User do not own the URL!';
      const templateVars = {
        usernam:usrName,
        error:errorMessage
      };
      res.status(400).render("urls_error",templateVars);
    }
  } else {
    const errorMessage = 'User not login!';
    const templateVars = {
      usernam:undefined,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

//--------------------POST /urls/:id/upd--------------------------

app.post("/urls/:id/upd",(req,res)=>{
  const id = req.params.id;
  const validID = verifyID(req.session.usrID);
  if (validID) {
    if (urlDatabase[validID][id]) {
      urlDatabase[validID][id] = req.body['updatedURL'];
      res.redirect("/urls");
    }
  } else {
    const errorMessage = 'User not login!';
    const templateVars = {
      usernam:undefined,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});
//-------------------------------------------------------------------------

app.post("/urls", (req, res) => {
  
  const validID = verifyID(req.session.usrID);
  //Login part, include verify username &password, handle all edge condition
  
  if (validID) {
    let newkey = generateRandomString();
    
    //regenerate the new key if key is already included in the urlDatabase
    while (Object.keys(urlDatabase[validID]).includes(newkey)) {
      newkey = generateRandomString();
    }
    
    //insert new item into urlDatabase
    urlDatabase[validID][newkey] = req.body['longURL'];
    res.redirect(`/urls/${newkey}`);
  
  } else {
    const errorMessage = 'User nod login !';
    const templateVars = {
      usernam:undefined,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


