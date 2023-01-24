var fs = require('fs');
var child_process = require('child_process');
var P3 = require('./node-p3');
var os = require('os');
var md5=require('md5');
var config = JSON.parse(
    JSON.stringify( require('./ssh_client.json') )
);
var oldcfg = require('./ssh_client.json');
var p3 = new P3({
    secret: config.secret,
    autoinit: true
});
if(!config.secret) {
    config.secret = p3.key;
}
if(
    (config.secret != oldcfg.shell)
) {
    fs.promises.writeFile('./ssh_client.json',JSON.stringify(config));
}

var address;

var client;

var state = 'loading_network';
var client_state = null;

p3.on('connect', _ => {
    state = 'get_address';
    console.log('Enter the P3 address of the device you would like to SSH into:');
});
p3.on('fail', error => {
    console.error('Failed to connect to the P3 network: '+error);
    console.log('Troubleshooting tips:');
    console.log('- make sure the P3 relay you\'re using is up');
    console.log('- make sure your device is connected to the internet');
    console.log('- make sure the P3 relay you\'re using isn\'t blocked in your area');
    process.exit();
});

process.stdin.on('data', data => {
    if(state=='get_address'||state=='authorize') { data=data.slice(0,data.length-1) }
    var text = String(data);
    if(state == 'get_address') {
        address = text;
        client_state = 'login';
        client = p3.createClient(address, 281);
        client.on('connect', _ => {
            console.log(`Enter the password for ${address}:`);
            process.stdin.read()
            state = 'authorize';
            client_state='login'
        });
        client.on('message', data => {
            if(data.type == 'error') {
                if(data.data == 'login_auth_failed') {
                    console.error('The password you entered was incorrect. The connection will now be terminated.');
                } else if(data.data == 'p3_address_banned') {
                    console.error('The P3 address in use ('+p3.adr+') was banned from connecting to the server. The connection will now be terminated.');
                } else if(data.data == 'server_maintenance') {
                    console.error('The server you attempted to connect to is currently undergoing maintenance. The connection will now be terminated.')
                } else {
                    console.error('An unknown error occurred on the server. The connection will now be terminated.');
                }
                process.exit()
            } else if(data.type == 'state') {
                process.stdin.setRawMode(true);
                state = 'stdin';
            } else if(data.type == 'stdout') {
                process.stdout.write(data.data);
            } else if(data.type == 'stderr') {
                process.stderr.write(data.data);
            }
        });
        client.on('disconnect', _ => {
            process.exit();
        })
    } else if(state == 'authorize') {
        client.emit({
            type: 'auth',
            data: data
        })
    } else if(state != 'loading_network') {
        if(!client_state) {
            return null;
        }
        client.emit({
            type: 'stdin',
            data: data
        });
    }
})