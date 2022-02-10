require('dotenv').config()
const QRCode = require('qrcode'),
  address = require('address')

const url = `https://${address.ip()}/index.html`
console.log(url)
QRCode.toFile('public/assets/urlqrcode.png', url)
