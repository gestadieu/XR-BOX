const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json({
  limit: '1mb'
}));

http.listen(3000, () => {
  console.log('listening on PORT 3000');
});



let clients = {}



app.get('/api', (request, response) => {
  const word = (request.query['word']) ? request.query['word'] : '';
  if (!words.includes(word)) {
    response.status(404).end("mission impossible...");
  }

  if (word != currentWord) {
    startVideo(word)
    currentWord = word
  } else if (word == currentWord) {
    stopVideo(word)
    dbLog('button_stop', {
      word
    })
  }

  response.json({
    word
  });
})