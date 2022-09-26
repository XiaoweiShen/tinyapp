const {userDatabase} = require("./env_DB");

//register needed module--------------------------------------------------
//Function to generate new Id which is random alphanumeric characters;
const generateRandomString = ()=>{
  const str  = Math.random().toString(36).slice(2).split('');
  const {userDatabase} = require('./express_server');
  //random generate uppercase letter in the string...
  str.forEach((element,index) => {
    str[index] = element.match(/[a-z]/i) ? (Math.random() < 0.65 ? element : element.toUpperCase()) : element;
  });
  //return the final 6 random alphanumeric characters
  return (str.join('').slice(0,6));
};

const locateUserID = (name)=>{
  for (key in userDatabase) {
    if (userDatabase[key]["email"] === name) {
      return (key)
    }
  }
};

module.exports = {generateRandomString,locateUserID};