require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT | 7777
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors')

app.use(cors())
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json({
  limit: '1mb'
}));


// const mediaRoutes = require('./routes/media')
// app.use('/api/media', mediaRoutes)


http.listen(port, () => {
  console.log(`listening on port http://localhost:${port}`);
});