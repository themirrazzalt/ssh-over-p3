# SSHOverP3
SSH over the P3 network from Windows 96

## Using the `sshoverp3` shell script (Linux, Mac, UNIX, and chromeOS)
Usage: `./sshoverp3 [option]`
### Options
* -p Change server password
* -v Version information
* -c Start client
* -s Start server
* -h Displays this help menu

## Starting manually (Windows, Linux, Mac, UNIX, chromeOS, and ReactOS)
To change the server password from default: `node passwd.js`<br>
To start the server: `node host_server.js`<br>
To start the client: `node ssh_client.js`<br>

## Installing (Linux, Mac, UNIX, and chromeOS)
> Coming Soon
1. Download `./install-unix.sh` to the folder you want to install SSHOverP3 in
2. Open a terminal (BASH on Mac and most Linux distros, ZSH on Manjaro)
3. `cd` to the directory you downloaded the script to
4. run the `./install-unix.sh` script in the directory

## Installing (Windows and ReactOS)
> Coming soon
1. Download `./install-win32.exe`
2. Run the executable
3. Select the folder you want to install SSHOverP3 to
4. Finish the setup

## Installing (chromeOS)
> Coming soon
1. Go to the Chrome Web Store
2. Download the "SSHOverP3 for chromiumOS" extension
3. Go to chrome://flags
4. Enable 'Allow Chrome extensions on chrome:// URLs'
5. Restart chromeOS

## Installing (Windows 96 v2sp2 and v3)
> Coming soon
1. Download the file called `install-w96_v2_v3`.
2. Open a tab of [Windows 96](https://windows96.net/)
3. Drag the file onto the desktop
4. On v2sp2, click 'Open with...' and enter `js` in the custom command box. On v3, double-click the file.
5. Go through the setup process.

## Installing (Raspberry Pi OS)
> Coming soon
1. Download the file called `install_rpi.sh` to the directory you wish to install SSHOverP3 in.
2. Open a new terminal window (LXTerminal)
3. `cd` to the directory you chose.
4. Run the command `sudo sh ./install_rpi.sh` to start installing.
5. Enter your sudo password (default is usually `raspberry`) to allow installing.
6. If NodeJS is not detected or an older version of NodeJS is installed, the script will ask you if you'd like to upgrade to NodeJS v16 - choose 'yes'
7. Finish going through the setup process.
