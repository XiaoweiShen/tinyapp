// function isLetter(str) {
//   return str.length === 1 && ;
// }
const str  = Math.random().toString(36).slice(2).split('');
      str.forEach((element,index)=>{
      str[index]=element.match(/[a-z]/i)?(Math.random()<0.65?element:element.toUpperCase()):element;
      });

console.log(str.join('').slice(0,6));

