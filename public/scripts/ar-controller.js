const DEBUG = true;

let socket = io();
let page;


// DOM Elements in view mode
let qrcode = document.getElementById('qrcode')
let arimg = document.getElementById('ar-img')

function connectXRBox(c) {
  // client = c;
  socket.emit('join', client);
}

(function () {

  if (client == 'index') {
    socket.emit('page','')
    document.querySelectorAll('.arlink').forEach(item => {
      item.addEventListener('click', event => {
        // event.preventDefault()
        console.log('clicked...', event.target.id)
        page = event.target.id;
        socket.emit('page', page)
      })
    })
  }

  socket.on('page', msg => {
    page = msg
    if (DEBUG)console.log(`page received ${msg}`)
    // only on the VIEW screen
    if (client == 'view') {
    //   // hide the QRCode 
      qrcode.style.display = (page)?'none':'block'
    //   // load and show the corresponding image based on the msg
      if (page) {
        arimg.src = `/assets/images/${msg}.png`
        arimg.className = ''
        arimg.className = msg
      }
      arimg.style.display = (page)?'block':'none'
    }
  })

  socket.on('disconnect', err => {
    if (DEBUG) console.log('disconnected...', err)
    connectXRBox(client);
  })
})()
