
const moment = require('moment');
// var date = new Date();
// console.log(date.getMonth());
var someTimeStamp = moment().valueOf();
console.log(someTimeStamp);
var createdAt = 12345534;
var date = moment(createdAt);
// date.subtract(100, 'months');
// console.log(date.format('MMM Do, YYYY'));
console.log(date.format('h:mm a'));