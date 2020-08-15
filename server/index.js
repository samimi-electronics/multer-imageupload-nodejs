require('dotenv').config()
const PORT = process.env.PORT
const express = require('express')
const multer = require('multer')

/** Multer settings */

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Wrong file type')
    error.code = "LIMIT_FILE_TYPES"
    return cb(error, false)
  }
  cb(null, true)
}
const MAX_FILE_SIZE = 200000
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/tmp')
  },
  filename: function (req, file, cb) {
    let fileExtention = ''
    switch (file.mimetype) {
      case 'image/jpeg':
        fileExtention = '.jpg'
        break
      case 'image/png':
        fileExtention = '.png'
        break
      case 'image/gif':
        fileExtention = '.gif'
        break
    }
    console.log(file.mimetype, fileExtention)
    cb(null, file.fieldname + Date.now() + fileExtention)
  }
})
const upload = multer({
  //dest: './uploads/',
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  storage
})

const app = express()



app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file })
})

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_TYPES') {
    res.status(422).json({ error: 'Only images are allowed' })
    return
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(422).json({ error: `Only files below ${MAX_FILE_SIZE / 1000}Kb are allowed` })
    return
  }
})



app.listen(PORT, console.log(`Server started on port ${PORT}`))