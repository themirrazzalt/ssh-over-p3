const fs=require('fs');
var config = JSON.parse(
    JSON.stringify( require('./config.json') )
);
const md5=require('md5');

console.log('Enter a new password:');
process.stdin.on('data', passwd => {
    config.password=md5(passwd);
    console.clear();
    fs.writeFileSync('./config.json',JSON.stringify(config))
})