const mongoose = require('mongoose')

const Media = mongoose.model('Media', {
  filename: {type: String},
  time: {type: Date, default: Date.now }
})

module.exports = Media