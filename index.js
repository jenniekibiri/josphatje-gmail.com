const helmet = require('helmet')

const compression = require('compression')
const rateLimit = require('express-rate-limit')
const { body, check } = require('express-validator')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')


const app = express()
app.use(compression())
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
const isProduction = process.env.NODE_ENV === 'production'
const origin = {
  origin: isProduction ? 'https://deploy-example5.herokuapp.com/' : '*',
}

app.use(cors(origin))
app.get('/helo',(req,res)=>{
  res.send('hello')
})
const getBooks = (request, response) => {
  pool.query('SELECT * FROM books', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
 
  })
}


const addBook = (request, response) => {
  const { author, title } = request.body

  pool.query('INSERT INTO books (author, title) VALUES ($1, $2)', [author, title], error => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'Book added.' })
  })
}

app
  .route('/books')
  // GET endpoint
  .get(getBooks)
  // POST endpoint
  .post(addBook)

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening`)
})