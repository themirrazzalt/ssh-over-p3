var fs = require('fs');
var child_process = require('child_process');
var P3 = require('./node-p3');
var os = require('os');
var md5=require('md5');
var config = JSON.parse(
    JSON.stringify( require('./config.json') )
);
var oldcfg = require('./config.json');

if(!config.password) {
    console.error('No password set, please modify the config.json file. The server will now exit.');
    process.exit();
}

var p3 = new P3({
    secret: config.secret,
    autoinit: true
});
if(!config.secret) {
    config.secret = p3.key;
}
if(!config.shell) {
    config.shell = 'bash';
}

if(!config.blocked_addresses) {
    config.blocked_addresses = [];
}

if(
    (config.shell != oldcfg.shell)||
    (config.secret != oldcfg.shell)||
    (JSON.stringify(config.blocked_addresses) != JSON.stringify(oldcfg.blocked_addresses))
) {
    fs.promises.writeFile('./config.json',JSON.stringify(config));
}

p3.on('connect', _ => {
    console.log(`Server initalized on ${p3.adr}:281`)
});

p3.listen(281, client => {
    var state = 'login';
    var shell;
    console.log('New client connected at '+client.peer.adr)
    client.on('message', data => {
        if(data.type == 'auth') {
            if(state == 'shell') {
                client.emit({
                    type: 'error',
                    data: 'invalid_state'
                });
                return false;
            }
            if(md5(data.data) !== config.password) {
                client.emit({
                    type: 'error',
                    data: 'login_auth_failed'
                });
                client.peer.disconnect();
                return;
            }
            state = 'shell'
            client.emit({
                type: 'state',
                data: state
            });
            setTimeout(_ => {
                shell = child_process.spawn(config.shell, {
                    cwd: os.homedir()
                });
                shell.stdout.on('readable', _ => {
                    shell.stdout.read()
                });
                shell.stderr.on('readable', _ => {
                    shell.stderr.read()
                });
                shell.stdout.on('data', data => {
                    client.emit({
                        type: 'stdout',
                        data: data
                    })
                });
                shell.stderr.on('data', data => {
                    client.emit({
                        type: 'stderr',
                        data: data
                    })
                });
                shell.on('close', _ => {
                    client.peer.disconnect();
                });
                client.on('disconnect', _ => {
                    shell.kill();
                });
                shell.on('exit', _ => {
                    client.peer.disconnect()
                });
            }, 525)
        } else if (data.type == 'stdin') {
            shell.stdin.write(data.data);
            /*/ // add asterisk for testing
            console.log('Stdin data '+data.data);
            /**/
        }
    });
})