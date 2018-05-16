var express = require('express')
var exphbs = require('express-handlebars')
var mongo = require('mongodb').MongoClient
var assert = require('assert')
var url = 'mongodb://localhost/'
var geodb = 'geodb'
var app = express()
const https = require('https')
const fs = require('fs')
const port = 3000

// Conectamos con database mongodb
mongo.connect(url, function (err, client) {
  assert.equal(null, err)
// var db = client.db(geodb)
})
// ----------------------------------------------

// Funcion para insertar varios Jsons en la database de mongo
const insertDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('markers')
  // Insert some documents
  collection.insertMany([{test: 'test'}], function (err, result) {
    assert.equal(err, null)
    console.log('Inserted Document(s)')
    callback(result)
  })
}
// ---------------------------------------------
// Funcion para leer todo de una base de datos
const buscar = function (db, callback) {
  // Get the documents collection
  var coll = db.collection('markers')
  // Find some documents
  coll.find({}).toArray(function (err, docs) {
    assert.equal(err, null)
    // console.log('Found records')

    // console.log(docs)
    callback(docs)
  })
}
// ------------------------------------------

// Seteamos el View Engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
// ------------------------------------------
// Handleamos el acceso a localhost:3000/
app.get('/', function (req, res) {
  // test googleMapsClient
  // ----------------------------------------
  // nos conectamos a la base
  mongo.connect(url, function (err, client) {
    assert.equal(null, err)
    // console.log('conexion exitosa con mongodb')
    var db = client.db(geodb)
    var coll = db.collection('markers')
    // buscamos en markers
    coll.find({}).toArray(function (err, docs) {
      assert.equal(err, null)
      // console.log(docs)
      res.render('map', {markers: docs})
    })
  })
})
// -----------------------------------------

// Abrimos el puerto 3000 para que arranque la app

// app.listen(3000, () => console.log('Escuchando en puerto 3000'))
const httpsOptions = {
  key: fs.readFileSync('public/key-20180514-102809.pem'),
  cert: fs.readFileSync('public/cert-20180514-102809.crt')
}
const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log('server running at ' + port)
})
