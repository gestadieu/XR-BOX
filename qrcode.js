require('dotenv').config()
const QRCode = require('qrcode'),
  address = require('address')

const url = `http://${address.ip()}:3000/index.html`
console.log(url)
QRCode.toFile('public/assets/urlqrcode.png', url)
