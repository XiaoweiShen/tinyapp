/*eslint linebreak-style: ["error", "windows"]*/

const express = require("express");
const morgan = require('morgan');
const app = express();
const PORT = 8080; // default port 8080
const varibleForTest = 1;

//claim and inclue needed varible -----------------------------------------

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(morgan('dev'));

//register needed module--------------------------------------------------

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = ()=>{
  const str  = Math.random().toString(36).slice(2).split('');
  //random generate uppercase letter in the string...
  str.forEach((element,index) => {
    str[index] = element.match(/[a-z]/i) ? (Math.random() < 0.65 ? element : element.toUpperCase()) : element;
  });
  //return the final 6 random alphanumeric characters
  return (str.join('').slice(0,6));
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls',(req,res)=>{
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:id',(req,res)=>{
  if(Object.keys(urlDatabase).includes(req.params.id)){
    const templateVars = { id: req.params.id,longURL:urlDatabase[req.params.id]};
    res.redirect(templateVars.longURL);
  }
  else{
    res.send("invalid short url, please check and retry!");
  }
  
  //res.render("urls_show", templateVars);
  //console.log(templateVars);
    
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  res.send(`a = ${varibleForTest}`);
});
 
app.get("/fetch", (req, res) => {
  res.send(`a = ${varibleForTest}`);
});

app.post("/urls/:id/delete",(req,res)=>{
  console.log(req.params.id);
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
})


app.post("/urls", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console
  let newkey = generateRandomString();
  //regenerate the new key if key is already included in the urlDatabase
  while (Object.keys(urlDatabase).includes(newkey)) {
    newkey = generateRandomString();
  }
  //insert new item into urlDatabase
  urlDatabase[newkey] = req.body['longURL'];
  res.redirect("/urls"); // Respond with 'Ok' (we will replace this)
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


