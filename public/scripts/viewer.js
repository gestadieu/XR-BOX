const DEBUG = true;
  
    const timerAudio = 3000;
    const timerVideo = 1000;
  
    let socket = io();
    let currentVideo = '';
    let client;
  
    $(function () {
  
      const reconnectServer = () => {
        const params = new URLSearchParams(window.location.search)
        for (let p of params) {
          if (p[0] == 'client') {
            client = p[1]
            socket.emit('join', client);
            $('form').hide();
          }
        }
      }
  
      const v = new Video('#video')
      reconnectServer();
  
      $('form').submit(function (e) {
        e.preventDefault();
        reconnectServer();
        return false;
      });
  
      socket.on('message', function (msg) {
        if (DEBUG) console.log(msg)
  
        switch (msg.type) {
          case 'background':
            changeBackground(msg.src);
            break;
  
          case 'video':
            if (msg.action == 'start') {
              v.setInfo(msg.info)
              v.play()
            } else {
              v.stop()
            }
            break;
  
          default:
            break;
        }
      });
  
  
      socket.on('disconnect', err => {
        if (DEBUG) console.log('disconnected...', err)
        v.stop();
        reconnectServer();
      })
  
      const changeBackground = (col) => {
        (col == 'white') ? $('#light').addClass('lithophane'): $('#light').removeClass('lithophane')
  
        // $('body').removeClass('black white').addClass(col)
      }
  
    });
  
    // Video Class
    class Video {
      constructor(id) {
        this.id = id;
        this.vElt = $(this.id); //document.getElementsByTagName('video')[0];
        this.v = this.vElt[0]
        this.a = new Soundtrack('#soundtrack')
        this.audioTimeout;
      }
  
      setInfo(info) {
        this.info = info;
      }
  
      play() {
        clearTimeout(this.audioTimeout)
        this.a.pause();
        this.v.currentTime = this.info.start_time;
        this.vElt.fadeIn(timerVideo, () => {
          this.v.play()
        });
        this.v.addEventListener('timeupdate', (event) => {
          if (this.v.currentTime >= this.info.end_time) {
            this.end();
          }
        });
      }
  
      pause() {
        this.v.pause();
        this.vElt.fadeOut(timerVideo, () => {
          this.v.currentTime = 0;
          this.audioTimeout = setTimeout(() => this.a.play(), timerAudio)
        });
      }
  
      end() {
        this.pause();
        socket.emit('video', 'end')
      }
  
      stop() {
        this.pause();
        socket.emit('video', 'stop')
      }
    }
  
    class Soundtrack {
      constructor(id) {
        this.id = id;
        this.aElt = $(this.id);
        this.a = this.aElt[0];
        this.a.volume = 0.2
      }
  
      play() {
        if (client == 'front') {
          this.a.currentTime = 0;
          this.a.play();
          socket.emit('audio', 'play')
        }
      }
  
      pause() {
        if (client == 'front') {
          this.a.pause();
          socket.emit('audio', 'stop')
        }
      }
    }