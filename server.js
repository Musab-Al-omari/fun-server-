'use strict'

require('dotenv').config();


const express = require('express');
const superagent = require('superagent')
const PORT = process.env.PORT
const app = express();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL)
client.on('error', err => console.log(err))
var methodOverride = require('method-override')

// console.log('outside')
// app.get('/', (req, res) => {
//   console.log('inside')
//   res.send('test')
// })
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', homePage)

function homePage(request, response) {
  console.log('hi');
  let SQL = 'SELECT * FROM newTable;'
  client.query(SQL).then(result => {
    // console.log(result.rows);
    response.status(200).render('pages/index', { mainPic: result.rows })

  })
}

app.get('/new', bookSearcher)

function bookSearcher(request, response) {


  response.status(200).render('pages/searches/new')
}

app.post('/new', formHandler)

function formHandler(request, response) {

  let url = `https://www.googleapis.com/books/v1/volumes?q=in${request.body.sortBy}:${request.body.searchQueary}`;
  superagent.get(encodeURI(url))
    .then(data => {
      data.body.items.forEach(book => {

        let authors = book.volumeInfo.authors
        if (authors === undefined) {
          authors = 'not detected'
        } else if (typeof authors === 'object') {
          authors = authors.join(',')
        } else {
          authors === book.volumeInfo.authors
        }

        let imageUrl = ''
        if (book.volumeInfo.imageLinks) {
          imageUrl = book.volumeInfo.imageLinks.smallThumbnail
        } else {
          imageUrl = 'https://i.imgur.com/J5LVHEL.jpg'

        }

        new Books(book, authors, imageUrl)

      })
      response.status(200).render('pages/searches/show', { myBooks: array })

    })

}
let array = []
function Books(book, authors, imageUrl) {
  this.title = book.volumeInfo.title;
  this.authors = authors;
  this.description = book.volumeInfo.description || 'no description available'
  this.img_url = imageUrl
  this.isbn = book.volumeInfo.industryIdentifiers[0].identifier || 'no code'
  array.push(this)
}

app.get('/book/:id', getOneBook)
function getOneBook(request, response) {
  let id = request.params.id
  let value = [id]
  let sql = 'SELECT * FROM newTable WHERE id=$1;'
  client.query(sql, value).then(result => {
    console.log(result.rows[0]);
    response.render('pages/books/detail', { oneThing: result.rows[0] })
  }).catch(err => console.log(err))

}

app.post('/book', addBook)
function addBook(request, response) {
  // console.log(request.body);
  const { title, author, description, isbn, img_url } = request.body
  let values = [author, title, isbn, img_url, description]
  console.log(values);
  let sql = 'INSERT INTO newTable(author, title,isbn, image_url, description)VALUES($1,$2,$3,$4,$5) returning *'
  client.query(sql, values).then(result => {
    response.redirect(`/book/${result.rows[0].id}`)
  })
}

app.put('/book/:id', updateOneBook)
function updateOneBook(request, response) {
  let id = request.params.id
  // console.log("hi from put", id);
  const { title, author, description, isbn, image_url } = request.body
  let values = [author, title, isbn, image_url, description, id]
  let sql = 'UPDATE newTable SET author=$1,title=$2,isbn=$3,image_url=$4,description=$5 WHERE id=$6;'
  client.query(sql, values).then(() => {
    //  console.log('hi from in side',result);

    response.redirect(`/book/${id}`)
  })

}

app.delete('/books/:id',deleteHandler)
function deleteHandler(request, response) {
  let id = request.params.id
  let sql ='DELETE FROM newTable WHERE id=$1'
  client.query(sql,[id]).then(()=>{
    response.redirect('/')
  })
}


// error and not found handler 
app.get('/err', (request, response) => {
  throw new Error('gg')
})
app.use('*', notFound)
app.use(errorHandler)

function notFound(request, response) {
  response.status(404).send('the hell that you are looking to not found')

}
function errorHandler(error, request, response, next) {
  response.status(500).render('pages/error')
}

client.connect().then(() => {
  app.listen(PORT, () => console.log(`we are listening on ${PORT}`))
})






































// 'use strict'

// require('dotenv').config()


// const PORT = process.env.PORT

// const express = require('express')
// const superagent = require('superagent')

// const app = express();


// app.set('view engine', 'ejs')
// app.use(express.static('./public'))
// app.use(express.urlencoded({ extended: true }))


// app.get('/', homeHandler)

// function homeHandler(req, res) {
//   const url = ``
//     // res.status(200).send('every thing is ok ')
// }
// app.get('/err', throwingError)

// function throwingError(req, res) {
//   throw new Error('gg well played')
// }


// app.use('*', notFound)

// function notFound(req, res) {
//   res.status(404).send('the page you looking is not found')
// }

// app.use((error, req, res) => {
//   res.status(500).send(error)
// })





// app.listen(PORT, () => console.log(`app working on this port ${PORT}`))



















































// require('dotenv').config()
// const PORT = process.env.PORT


// const express = require('express');
// const superagent = require('superagent');


// const app = express();


// app.get('/boo', booHandler)

// function booHandler(request, response) {
//   throw new Error('gg well play')
// }

// app.get('/', homePageHandler)

// function homePageHandler(request, response) {
//   response.status(200).send('you did great jop')

// }


// app.use('*', notFoundHandler)

// function notFoundHandler(request, response) {
//   response.status(404).send('what you looking about is not found !!! ')
// }

// app.use(errorHandler)

// function errorHandler(error, request, response) {
//   response.status(500).send(error)
// }


// app.listen(PORT, () => console.log(`my app is in ${PORT}`))