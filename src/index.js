var http = require('http');
var express = require('express');
var app = express(); 
var bodyParser = require('body-parser');
var db = require('./db')
var assert = require('assert');
var extend = require('util')._extend;

// Defaults
var defaultBounds = {
    min: {x: 0, y:0},
    max: {x: 15, y:10},
    getWidth: function(){return this.max.x - this.min.x + 1},
    getHeight: function(){return this.max.y - this.min.y + 1}
};
var url = 'mongodb://localhost:27017/nesoi';
var port = process.env.PORT || 8080; 

// App
var router = express.Router();



router.get('/terrain/:terrainType?', function(req, res) {
    res.setHeader('Last-Modified', (new Date()).toUTCString());

    var collection = db.get().collection('terrain')
    
    var query = {};

    if(req.params.terrainType){
        query = extend(query, {terrain: req.params.terrainType})  
    } 

    if(req.query.x){
        var x = parseInt(req.query.x);
        query = extend(query, {x: x})  
    } 

    if(req.query.y){
        var y = parseInt(req.query.y);
        query = extend(query, {y: y})  
    } 

    // Look for boundary point
    if(req.query.p){
        var ps = req.query.p.split(",");

        var x = parseInt(ps[0], 10);
        var y = parseInt(ps[1], 10);  
       
        if(isNumeric(x) && isNumeric(y)){
            var minPoint = new Point(x, y);
            var maxPoint = new Point(minPoint.x + defaultBounds.getWidth(), minPoint.y + defaultBounds.getHeight());

            query = { $and: [ 
                {x: { $gte: minPoint.x }},  
                {x: { $lt: maxPoint.x }},
                {y: { $gte: minPoint.y }},  
                {y: { $lt: maxPoint.y }}
                ]
            };
        }
        else {
            // missing parameter
            res.status(400).send({ error: 'missing parameters for point. Ensure point is in the pattern p=3,5' });
        }
    }

    collection.find(query).toArray(function(err, docs) {
        res.json({terrain: docs})
    })    
    
});

router.post('/terrain/', function(req, res) {
    
    var collection = db.get().collection('terrain')

    var terrain = req.body;

    console.log(terrain);
    
    // validate parameters
    if(terrain && terrain.x && terrain.y && terrain.terrain && terrain.traversable)
    {
        if(isNumeric(terrain.x) && isNumeric(terrain.y)){
            terrain.x = parseInt(terrain.x);
            terrain.y = parseInt(terrain.y);
            
            terrain.traversable = terrain.traversable == 'true';

            if(terrain._id) {
                delete(terrain["_id"]);
                console.log("Updateding");
                collection.update({x: terrain.x, y:terrain.y},terrain, function(err, result) {
                    assert.equal(err, null);
                    console.log("Updated");
                    res.json({ message: 'Updated 1 documents in the document collection', terrain: terrain });   
                }); 

            } else {
                console.log("Inserting");

                // Check if terrain already exists
                collection.find({x: terrain.x, y: terrain.y}).toArray(function(err, docs) {
                    console.log(docs);
                    if(docs && docs.length > 0){
                        console.log("Inserting new record when one already exists")    
                        res.status(409).send({ error: "Inserting new record when one already exists", terrain:terrain });
                    }
                    else {
                        collection.insert(terrain, function(err, result) {
                            assert.equal(err, null);
                            assert.equal(1, result.result.n);
                            assert.equal(1, result.ops.length);
                            console.log("Inserted");
                            res.json({ message: 'Inserted 1 documents into the document collection', terrain: terrain });   
                        }); 
                    }
                });
            }
            
        } else {
            res.status(400).send({ error: 'invalid parameters for terrain. Ensure terrain x, y are numeric.' });
        }

    } else {       
       res.status(400).send({ error: 'missing parameters for terrain. Ensure terrain has x, y, terrain, and traversable.' });
    }
    
});


// Configure and start app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use('/api', router);


db.connect('mongodb://localhost:27017/nesoi', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(port, function() {
      console.log('Server running at http://127.0.0.1:' + port)
    })
  }
})


function Point(x, y){
    this.x = x,
    this.y = y
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}