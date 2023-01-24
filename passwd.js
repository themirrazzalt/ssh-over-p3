const fs=require('fs');
var config = JSON.parse(
    JSON.stringify( require('./config.json') )
);
const md5=require('md5');

console.log('Enter a new password:');
process.stdin.on('data', passwd => {
    config.password=md5(passwd.slice(0,passwd.length-1));
    console.clear();
    fs.writeFileSync('./config.json',JSON.stringify(config));
    console.log('Password saved!');
    process.exit();
})