const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Datastore = require('nedb');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json({
  limit: '1mb'
}));

http.listen(3000, () => {
  console.log('listening on *:3000');
});


// database to log all actions
const db = new Datastore({
  filename: 'database.db',
  timestampData: true
});
db.loadDatabase();


const dbLog = (action, params) => {
  let datetime = new Date().toString();
  let data = {
    datetime,
    action,
    params
  }
  db.insert(data);
}
dbLog('server_started', {})

let clients = {}

const white = {
  type: 'background',
  src: 'white'
}
const black = {
  type: 'background',
  src: 'black'
}

// PINS: 23, 22, 21, 19, 18, 5, 4, 2
let words = ['paisagem', 'coincidencia', 'reencontro', 'silencio', 'sonho', 'amor', 'mulher', 'caminho']
let currentWord = '';

let videos = {
  paisagem: {
    start_time: 94.27,
    end_time: 208.53
  },
  sonho: {
    start_time: 546.13,
    end_time: 643.50
  },
  mulher: {
    start_time: 267.53,
    end_time: 355.13
  },
  amor: {
    start_time: 208.57,
    end_time: 267.50
  },
  silencio: {
    start_time: 0,
    end_time: 94.23
  },
  coincidencia: {
    start_time: 355.17,
    end_time: 425.47
  },
  caminho: {
    start_time: 425.50,
    end_time: 480.93
  },
  reencontro: {
    start_time: 480.97,
    end_time: 546.10
  }
}
const faceLightTimeOut = 1500;
const debug = true;

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

let lithophane = false;
app.get('/lithophane', (request, response) => {
  lithophane = !lithophane;
  if (lithophane)
    io.to(clients['back']).emit('message', white)
  else
    io.to(clients['back']).emit('message', black)
  response.json({
    lithophane
  })
})

// app.get('/api/setup', (request, response) => {
//   const authorized_clients = ['esp32', 'back', 'front']
//   const client = request.query['client']

//   if (!client || !authorized_clients.includes(client)) {
//     response.status(404).end("mission impossible...");
//   }

//   clients[client] = socket.id
//   io.emit('console', 'in room ' + client);
//   if (debug) console.log('joined room ', client, clients)
//   dbLog('client_join', {
//     client: client
//   })

//   dbLog('setup', {
//     client
//   })

//   response.redirect('/index.html');
// })


/* Start a video based on a word clicked:
  1. Back screen is black
  2. Show the video, seek the time and start playing 
*/
let startVideo = word => {
  if (debug) console.log('starting video...', word);
  io.to(clients['back']).emit('message', black)
  io.to(clients['front']).emit('message', {
    type: 'video',
    action: 'start',
    word,
    info: videos[word]
  })
  dbLog('button_start', {
    word,
  })
}

/* Stop the current video playing:
  1. stop and hide the video
  2. black screen on the front
  3. white screen on the back for 10 seconds, then back to black
   */
let stopVideo = (word) => {
  if (debug) console.log('stoping video...', word)
  if (word) {
    io.to(clients['front']).emit('message', {
      type: 'video',
      action: 'stop',
      word,
      info: videos[word]
    })
  }
  currentWord = ''
  io.to(clients['back']).emit('message', white)
  setTimeout(function () {
    io.to(clients['back']).emit('message', black)
  }, faceLightTimeOut);
}


io.on('connection', socket => {
  if (debug) console.log('new client connected', socket.id);
  io.emit('console', `new client ${socket.id}`)

  // identify each client 
  socket.on('join', location => {
    clients[location] = socket.id
    io.emit('console', 'in room ' + location);
    if (debug) console.log('joined room ', location, clients)
    dbLog('client_join', {
      client: location
    })
  });


  socket.on('video', msg => {
    if (debug) console.log('msg from client: video ', msg)
    if (msg == 'end') {
      stopVideo(currentWord);
      dbLog('video_end', {
        word: currentWord
      })
    }
  })

  socket.on('audio', msg => {
    if (debug) console.log('msg from client: audio ', msg)
    dbLog('audio_' + msg, {
      audio: msg
    })
  })

  socket.on('disconnect', () => {
    currentWord = ''
    if (debug) console.log('user disconnected');
    dbLog('disconnection', {
      client: 'disconnected'
    })
  });
});



// IF USED ON SERIAL PORT RATHER THAN WIFI/REST API

// const serial = require('serialport')
// const Readline = require('@serialport/parser-readline')
// const serialpath = '/dev/cu.SLAB_USBtoUART';
// const port = new serial(serialpath, {
//   baudRate: 115200
// })


// socket.send('here is a test...of send...') // socket.send('message','...')

// const parser = port.pipe(new Readline());

// parser.on('data', line => {
//   if (line == 'on') {
//     console.log('starting video...')
//     io.to(clients['back']).emit('message', {
//       type: 'video',
//       time: 0
//     })
//     io.to(clients['front']).emit('message', black)
//   } else if (line == 'off') {
//     console.log('stoping video...')
//     io.to(clients['front']).emit('message', white)
//     io.to(clients['back']).emit('message', black)
//   }

// })