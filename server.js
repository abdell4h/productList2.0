const express = require('express')
var cors = require('cors')
var mongodb = require('mongodb');


const app = express()

var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors())


var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb+srv://admin:test@cluster0.durgs.mongodb.net/?retryWrites=true&w=majority';
var db = null


MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    //console.log("it is working");
    // db.close();
    db = client.db('webDataBase')

})

var findProducts = function (db, callback) {
    var collection = db.collection('products');

    collection.find().toArray(function (err, products) {
        if (err) throw err;
        console.log(products);
        callback(products);
    })

}

var deleteProduct = function (db, idProduct, callback) {
    var collection = db.collection('products')
    var query = {}
    query._id = new mongodb.ObjectID(idProduct);
    console.log(query);
    // Insert a single document
    collection.deleteOne(query, function (err, r) {
        callback(r);
    })
}
var addProduct = function (db, product, callback) {
    var collection = db.collection('products')
    // Insert a single document
    collection.insertOne(product, function (err, r) {
        callback(r);
    })
}

var updateProduct = function (db, idProduct, product, callback) {
    var collection = db.collection('products')
    var query = {}
    query._id = new mongodb.ObjectID(idProduct);
    // Insert a single document
    collection.updateOne(query, { $set: product }, function (err, r) {
        callback(r);
    })
}



app.get('/', (req, res) => res.send('Hola Món!'))


app.get('/products', function (req, res) {
    findProducts(db, function (products) {
        res.send(products);
    });

})

app.delete('/products/:productId', function (req, res) {

    deleteProduct(db, req.params.productId, function (resultat) {
        res.send(resultat);
    });

})

app.post('/products', function (req, res) {
    addProduct(db, req.body, function (resultat) {
        res.send(resultat);
    });
})

app.put('/products/:productId', function (req, res) {
    updateProduct(db, req.params.productId, req.body, function (resultat) {
        res.send(resultat);
    });
})

app.listen(3000, () => console.log('ApiServer de productes escoltant el port 3000!'))