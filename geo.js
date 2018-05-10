var express = require('express')
var exphbs = require('express-handlebars')
var mongo = require('mongodb').MongoClient
var assert = require('assert')
var url = 'mongodb://localhost/'
var geodb = 'geodb'
var app = express()

// Conectamos con database mongodb
mongo.connect(url, function (err, client) {
  assert.equal(null, err)
  console.log('conexion exitosa con mongodb')
  var db = client.db(geodb)
  buscar(db, function () {
    client.close()
  })
})
// -------------------------------

// Funcion para insertar varios Jsons en la database de mongo
const insertDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('markers')
  // Insert some documents
  collection.insertMany([
    {lat: 20.02, lng: 33.03, tipomarker: 'Dealer', nombre: 'Pepe argento', direccion: 'Sargento Cabral 1239', telefono: '4361-2225', icono: '/images/0.jpg'},
    {lat: 10.023, lng: 14.022, tipomarker: 'Artista', nombre: 'Test Artista', icono: '/images/6.jpg'}
  ], function (err, result) {
    assert.equal(err, null)
    console.log('Inserted 2 documents into the collection')
    callback(result)
  })
}
// -----------------------------------------------------------
// Funcion para leer todo de una base de datos
const buscar = function (db, callback) {
  // Get the documents collection
  var coll = db.collection('markers')
  // Find some documents
  coll.find({}).toArray(function (err, docs) {
    assert.equal(err, null)
    console.log('Found records')
    // console.log(docs)
    callback(docs)
  })
}
// ------------------------------------------

// Seteamos el View Engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
// -----------------------

// Handleamos el acceso a localhost:3000/
app.get('/', function (req, res) {
  mongo.connect(url, function (err, client) {
    assert.equal(null, err)
    console.log('conexion exitosa con mongodb')
    var db = client.db(geodb)
    var coll = db.collection('markers')
    coll.find({}).toArray(function (err,docs){
      assert.equal(err,null)
console.log(docs)
      res.render('map', {markers: docs})
    })
    })


})
// --------------------------------------

// Abrimos el puerto 3000 para que arranque la app
app.listen(3000, () => console.log('Escuchando en puerto 3000'))
