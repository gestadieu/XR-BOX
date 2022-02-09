require('dotenv').config()
const express = require('express'),
  app = express(),
  cors = require('cors'),
  QRCode = require('qrcode'),
  address = require('address')

const port = process.env.PORT | 3000
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(cors())
app.use(express.static('public'));
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json({
  limit: '1mb'
}));


http.listen(port, () => {
  const url = `http://${address.ip()}:${port}/index.html`
  QRCode.toFile('public/assets/urlqrcode.png', url)
  console.log(`listening on port http://localhost:${port}`)
});

// Socket.IO:
// listen input "buttons"
// -> change image to display fullscreen
// -> how to change url in the browser???
