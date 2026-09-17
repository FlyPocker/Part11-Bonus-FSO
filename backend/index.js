require('dotenv').config()
const path = require('path')
const Number = require('./models/numbers')
const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')

app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')))
app.use(express.json())
app.use(morgan('tiny'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/numbers', (request, response, next) => {
  Number.find({}).then(numbers => {
    response.json(numbers)
  })
  .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    const currentTime = new Date().toString();
    response.send(
        `<div>
            <p>Phonebook has ${Number.length} numbers<p/>
            <p>${currentTime}<p/>
        <div/>`        
    )
    .catch(error => next(error)) // Przekazujemy błąd do middleware obsługującego błędy
})

app.get('/api/numbers/:id', (request, response, next) => {
    const id = request.params.id
    Number.findById(id)
        .then(number => {
            if(number){
                response.json(number)
            }else{
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/numbers/:id', (request, response, next) => {
    const id = request.params.id
    Number.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/numbers', (request, response, next) => {
    const body = request.body
    if(!body.name || !body.number){
        return response.status(400).json({error: 'name or number is missing'})
    }
    Number.findOne({name: body.name}).then(existingNumber => {
        if(existingNumber){
            return response.status(400).json({error: 'name must be unique'})
        }
    })
    const newNumber = {
        name: body.name,
        number: body.number
    }
    const number = new Number(newNumber)
    number.save().then(savedNumber => {
        response.status(201).json(savedNumber)
    })
    .catch(error => next(error))
})

app.put('/api/numbers/:id', (request, response, next) => {
    const { name, number } = request.body
    const id = request.params.id
    Number.findById(id)
        .then(note => {
            if (!note) {
                return response.status(404).end()
            }

            note.name = name
            note.number = number

            return note.save().then((updatedNote) => {
                response.json(updatedNote)
            })
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)
