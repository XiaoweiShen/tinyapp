// function isLetter(str) {
//   return str.length === 1 && ;
// }
const str  = Math.random().toString(36).slice(2).split('');
      str.forEach((element,index)=>{
      str[index]=element.match(/[a-z]/i)?(Math.random()<0.65?element:element.toUpperCase()):element;
      });

console.log(str.join('').slice(0,6));

const findKeyByValue = (obj,str) => {
      for (let item in obj) {
        if (obj[str])
          return (item);
      }
    };

const obj={as:11111,bs:22222}
let ok = 'as';
let ok1 = {};
ok1[ok]=obj[ok];
console.log(ok1);

