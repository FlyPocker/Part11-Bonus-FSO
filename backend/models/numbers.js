const mongoose = require('mongoose')

// Tutaj wstawiasz swój string połączenia (ten z MongoDB Atlas)
const url = process.env.MONGODB_URI 

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Definicja schematu
const numberSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, required: true, unique: true },
  number: { type: String, minlength: 8, required: true }
})

// Konwersja na format, który przyda się później (usuwa _id i __v)
numberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Eksportujemy model
module.exports = mongoose.model('Number', numberSchema)