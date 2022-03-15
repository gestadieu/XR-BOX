require('dotenv').config()
const QRCode = require('qrcode'),
  address = require('address'),
  domain = (process.env.NODE_DEV != 'development') ? process.env.DOMAIN_NAME : address.ip()

const url = `https://${domain}/index.html`
console.log(url)
QRCode.toFile('public/assets/urlqrcode.png', url)
