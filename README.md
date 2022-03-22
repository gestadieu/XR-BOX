# XR-BOX
Interactive Digital Frame for XR Experiences
// sudo apt-get install netatalk
https://kremalicious.com/raspberry-pi-file-and-screen-sharing-macos-ios
sudo apt install samba samba-common-bin
https://blog.r0b.io/post/minimal-rpi-kiosk/ 

install
curl -fsSL https://deb.nodesource.com/setup_current.x | sudo -E bash -
sudo apt-get install git nodejs certbot


sudo npm install -g pm2
sudo pm2 ls
sudo pm2 start app.js --watch --name xrbox-server
sudo pm2 startup systemd (pm2 unstartup systemd to remove)
sudo pm2 save

lazy loading assets in a-frame
https://github.com/youmustfight/aframe-asset-lazy-load
AR.js gesture (zoom, rotate...)
https://github.com/fcor/arjs-gestures 



reverse proxy https://github.com/ktorn/reverse-ssh-tunnel 
ssl cert https://letsencrypt.org/
domain name https://www.duckdns.org/domains xr-box.duckdns.org 


https 
Let'sEncrypt SSL Certificate https://pimylifeup.com/raspberry-pi-ssl-lets-encrypt/ 
sudo certbot certonly --standalone -d xr-box.duckdns.org

generate self-cert 
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout certs/selfsigned.key -out certs/selfsigned.crt
https://timonweb.com/javascript/running-expressjs-server-over-https/

REDIRECT ALL TO HTTPS
module.exports.bootstrap = function(cb) {
    var express = require("express"),
        app = express();

    app.get('*', function(req, res) {  
        if (req.isSocket) 
            return res.redirect('wss://' + req.headers.host + req.url)  

        return res.redirect('https://' + req.headers.host + req.url)  
    }).listen(80);
    cb();
};

OR 
app.enable('trust proxy')
app.use(function(request, response, next) {

    if (process.env.NODE_ENV != 'development' && !request.secure) {
       return response.redirect("https://" + request.headers.host + request.url);
    }

    next();
})


AR.js gesture (zoom, rotate...)
https://github.com/fcor/arjs-gestures 


<!-- git config --global user.email "you@example.com"
  git config --global user.name "Your Name" -->



