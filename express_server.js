/*eslint linebreak-style: ["error", "windows"]*/

const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const cookieSession = require('cookie-session');
const {PORT,userDatabase} = require("./env_DB");
const {generateRandomString,locateUserID} = require("./functions");
const bcrypt = require("bcrypt");


//claim and inclue needed varible -----------------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(cookieSession({name: 'email', secret: 'Yellow-stone'}));
app.use(morgan('dev'));

//http response part------------------------------------------------------

//if user is logged in,redirect to /urls
//if user is not logged in, redirect to /login
app.get("/", (req, res) => {
  if (req.session.email) {
    res.redirect('/urls');
  } else {
    res.redirect('/urls/reg');
  }
});

//------------------------------------------------------------------------
//if user is logged in:
// returns HTML with:
// the site header (see Display Requirements above)
// a list (or table) of URLs the user has created, each list item containing:
// a short URL
// the short URL's matching long URL
// an edit button which makes a GET request to /urls/:id
// a delete button which makes a POST request to /urls/:id/delete
// if user is not logged in or with a invalid user id
// returns HTML with a relevant error message
app.get('/urls',(req,res)=>{
  const validID = locateUserID(req.session.email);
  if (req.session.email) {
    if (validID) {
      const templateVars = {
        urls:userDatabase[validID]['urlDatabase'],
        usernam: req.session.email
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
      usernam: req.session.email,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

//-------------------------------------------------------------
//direct to sign in & sign up page
// if user is logged in:
// (Minor) redirects to /urls
// if user is not logged in:
// returns HTML with:
// a form which contains:
// input fields for email and password
// submit button that makes a POST request to /login/register

app.get("/urls/reg",(req,res)=>{
  const validID = locateUserID(req.session.email);
  if (validID) {
    res.redirect("urls");
  } else {
    res.render("urls_reg",{ urls: {},usernam: req.session.email});
  }
});

//-------------------------------------------------------------
// if user is logged in:
// returns HTML with:
// the site header (see Display Requirements above)
// a form which contains:
// a text input field for the original (long) URL
// a submit button which makes a POST request to /urls
// if user is not logged in:
// redirects to the /login page
app.get("/urls/new", (req, res) => {
  const validID = locateUserID(req.session.email);
  if (validID) {
    const templateVars = {
      urls:userDatabase[validID]["ulrDatabase"],
      usernam: req.session.email
    };
    res.render("urls_new",templateVars);
  } else {
    res.redirect("/urls/reg");
  }
});

//-------------------------------------------------------------
// if user is logged in and owns the URL for the given ID:
// returns HTML with:
// the short URL (for the given ID)
// a form which contains:
// the corresponding long URL
// an update button which makes a POST request to /urls/:id
// if a URL for the given ID does not exist:
// (Minor) returns HTML with a relevant error message
// if user is not logged in:
// returns HTML with a relevant error message
// if user is logged it but does not own the URL with the given ID:
// returns HTML with a relevant error message

app.get('/urls/:id',(req,res)=>{
  const id = req.params.id;
  const validID = locateUserID(req.session.email);
  if (validID) {
    if (userDatabase[validID]['urlDatabase'][id]) {
      const templateVars = {
        id: req.params.id,longURL:userDatabase[validID]['urlDatabase'][id],usernam: req.session.email
      };
      res.redirect('/urls');
    } else {
      res.send("invalid short url, please check and retry!");
    }
  } else {
    const errorMessage = 'User not login!';
    const templateVars = {
      usernam: req.session.email,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});
//---------------------------------------------------
// if user is logged in :
// returns its own profile in Json format
// if user is not logged in:
// returns HTML with a relevant error message

app.get("/urls.json", (req, res) => {
  const validID = locateUserID(req.session.email);
  if (validID) {
    res.json(userDatabase[validID]);
  } else {
    const errorMessage = 'User not login!';
    const templateVars = {
      usernam: req.session.email,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

//if URL for the given ID exists:
// redirects to the corresponding long URL
// if URL for the given ID does not exist:
// (Minor) returns HTML with a relevant error message

app.get('/u/:id',(req,res)=>{
  const id = req.params.id;
  for (keys in userDatabase) {
    if (userDatabase[keys]["urlDatabase"][id])
      res.redirect(userDatabase[keys]["urlDatabase"][id]);
  }
  const errorMessage = 'The ShortURL not exist!';
  const templateVars = {
    usernam: req.session.email,
    error:errorMessage
  };
  res.status(400).render("urls_error",templateVars);
});
    
// ---------------------POST Login ------------------------------

// POST /login
// if email and password params match an existing user:
// sets a cookie
// redirects to /urls
// if email and password params don't match an existing user:
// returns HTML with a relevant error message

app.post("/login",(req,res)=>{
  const validID = locateUserID(req.body["email"]);
  //Login part, include verify username &password, handle all edge condition
  if (req.body["email"] && req.body["password"]) {
    if (validID) {
      if (bcrypt.compareSync(req.body["password"],userDatabase[validID]["password"])) {
        req.session.email = req.body["email"];
        const templateVars = {
          urls:userDatabase[validID]['urlDatabase'],
          usernam:req.body["email"]
        };
        res.render("urls_index", templateVars);
      } else {
        const errorMessage = 'Username and password is not valid!';
        const templateVars = {
          usernam: req.session.email,
          error:errorMessage
        };
        res.status(400).render("urls_error",templateVars);
      }
    } else {
      const errorMessage = 'Username is not registered!';
      const templateVars = {
        usernam: req.session.email,
        error:errorMessage
      };
      res.status(400).render("urls_error",templateVars);
    }
  } else {
    const errorMessage = 'Username and Password can not be blank!';
    const templateVars = {
      usernam: req.session.email,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

// POST ------------------------register--------------------------------
// if email already exists:
// returns HTML with a relevant error message
// otherwise:
// creates a new user
// sets a cookie
// redirects to /urls

app.post("/register",(req,res)=>{
  // if email or password are empty:
  if (req.body["email"] && req.body["password"]) {

    //if the email in wrong format
    if (req.body["email"].includes("@") && req.body["email"].includes('.')) {
      let checkIfExist = null;

      // if email already exists:
      // returns HTML with a relevant error message
      // otherwise:
      // creates a new user
      for (keys in userDatabase) {
        if (userDatabase[keys]["email"] === req.body["email"]) {
          checkIfExist = true;
        }
      }
      if (!checkIfExist) {
        const newId = Object.keys(userDatabase).length + 1;
        userDatabase[newId] = {
          'id':newId,
          'name':req.body["email"].split('@')[0],
          'email':req.body["email"],
          'password': bcrypt.hashSync(req.body["password"],1),
          'urlDatabase':{}
        };
        // sets a cookie
        // redirects to /urls
        req.session.email = req.body["email"];
        const templateVars = {
          urls:{},
          usernam:req.body["email"]
        };
        console.log(userDatabase);
        res.render("urls_index", templateVars);
      } else {
        const errorMessage = 'User already registered!';
        const templateVars = {
          usernam:req.cookies["username"],
          error:errorMessage
        };
        res.status(400).render("urls_error",templateVars);
      }
    } else {
      const errorMessage = 'Invalid E-mail address!';
      const templateVars = {
        usernam:req.cookies["username"],
        error:errorMessage
      };
      res.status(400).render("urls_error",templateVars);
    }
  } else {
    const errorMessage = 'Username and Password can not be blank!';
    const templateVars = {
      usernam:req.cookies["username"],
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

//----------------------logout---------------------------------------
app.post("/logout",(req,res)=>{
  res.clearCookie("email");
  res.clearCookie("email.sig");
  res.redirect("/urls");
});

//--------------------POST /urls/:id/delete--------------------------
// if user is logged in and owns the URL for the given ID:
// deletes the URL
// redirects to /urls
// if user is not logged in:
// (Minor) returns HTML with a relevant error message
// if user is logged it but does not own the URL for the given ID:
// (Minor) returns HTML with a relevant error message

app.post("/urls/:id/delete",(req,res)=>{
  const id = req.params.id;
  const validID = locateUserID(req.session.email);
  if (validID) {
    if (userDatabase[validID]["urlDatabase"][id]) {
      delete userDatabase[validID]['urlDatabase'][id];
      res.redirect("/urls");
    } else {
      const errorMessage = 'User do not own the URL!';
      const templateVars = {
        usernam:req.session.email,
        error:errorMessage
      };
      res.status(400).render("urls_error",templateVars);
    }
  } else {
    const errorMessage = 'User not login!';
    const templateVars = {
      usernam:req.session.email,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

//--------------------POST /urls/:id/edit--------------------------
// if user is logged in and owns the URL for the given ID:
// redirects to /urls/:id/edit and ready to modify the URL
// if user is not logged in:
// (Minor) returns HTML with a relevant error message
// if user is logged it but does not own the URL for the given ID:
// (Minor) returns HTML with a relevant error message
app.post("/urls/:id/edit",(req,res)=>{
  const id = req.params.id;
  const validID = locateUserID(req.session.email);
  if (validID) {
    if (userDatabase[validID]["urlDatabase"][id]) {
      const templateVars = {
        'id':req.params.id,
        'longURL':userDatabase[validID]["urlDatabase"][id],
        usernam:req.session.email
      };
      res.render("urls_show", templateVars);
    } else {
      const errorMessage = 'User do not own the URL!';
      const templateVars = {
        usernam:req.session.email,
        error:errorMessage
      };
      res.status(400).render("urls_error",templateVars);
    }
  } else {
    const errorMessage = 'User not login!';
    const templateVars = {
      usernam:req.session.email,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

//--------------------POST /urls/:id/upd--------------------------
// if user is logged in and owns the URL for the given ID:
// after modify the URL return to /urls
// if user is not logged in:
// (Minor) returns HTML with a relevant error message
app.post("/urls/:id/upd",(req,res)=>{
  const id = req.params.id;
  const validID = locateUserID(req.session.email);
  console.log(validID);
  if (validID) {
    if (userDatabase[validID]["urlDatabase"][id]) {
      userDatabase[validID]["urlDatabase"][id] = req.body['updatedURL'];
      res.redirect("/urls");
    }
  } else {
    const errorMessage = 'User not login!';
    const templateVars = {
      usernam:req.session.email,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});
//-------------------------------------------------------------------------
// if user is logged in:
// generates a short URL, saves it, and associates it with the user
// redirects to /urls/:id, where :id matches the ID of the newly saved URL
// if user is not logged in:
// (Minor) returns HTML with a relevant error message

app.post("/urls", (req, res) => {
  //const validID = locateUserID(req.cookies["username"]);
  const validID = locateUserID(req.session.email);
  //Login part, include verify username &password, handle all edge condition
  if (validID) {
    //console.log(req.body); // Log the POST request body to the console
    let newkey = generateRandomString();
    //regenerate the new key if key is already included in the urlDatabase
    while (Object.keys(userDatabase[validID]["urlDatabase"]).includes(newkey)) {
      newkey = generateRandomString();
    }
    //insert new item into urlDatabase
    userDatabase[validID]["urlDatabase"][newkey] = req.body['longURL'];
    res.redirect(`/urls/${newkey}`);
  } else {
    const errorMessage = 'User nod login !';
    const templateVars = {
      //usernam:req.cookies["username"],
      usernam:req.session.email,
      error:errorMessage
    };
    res.status(400).render("urls_error",templateVars);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


