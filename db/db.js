"use strict";

var conn = new Mongo();
var db = conn.getDB("nesoi");

// Greeting
print("\nStarting nesoi Setup...");
// Print databases
print("\nList databases...");
var dbs = db.adminCommand('listDatabases').databases;
for(var i=0;i<dbs.length;i++){
    print(dbs[i].name);    
}

print("\nDrop Collections...");
db.terrain.drop();


print("\nCreate Terrain...");
db.runCommand( { 
    create: "terrain"
});


print("\nList Collections...");
print(db.getCollectionNames());


print("\nAdd Terrain...");

var cells = [
        {x: 0, y: 0, terrain: "sand", traversable:true},
        {x: 1, y: 0, terrain: "sand", traversable:true},
        {x: 2, y: 0, terrain: "grass", traversable:true},
        {x: 3, y: 0, terrain: "grass", traversable:true},
        {x: 4, y: 0, terrain: "grass", traversable:true},
        {x: 5, y: 0, terrain: "water", traversable:false},
        {x: 6, y: 0, terrain: "grass", traversable:true},
        {x: 7, y: 0, terrain: "sand", traversable:true},
        {x: 0, y: 1, terrain: "sand", traversable:true},
        {x: 1, y: 1, terrain: "grass", traversable:true},
        {x: 2, y: 1, terrain: "grass", traversable:true},
        {x: 3, y: 1, terrain: "grass", traversable:true},
        {x: 4, y: 1, terrain: "water", traversable:false},
        {x: 5, y: 1, terrain: "water", traversable:false},
        {x: 6, y: 1, terrain: "water", traversable:false},
        {x: 7, y: 1, terrain: "grass", traversable:true},
        {x: 0, y: 2, terrain: "sand", traversable:true},
        {x: 1, y: 2, terrain: "sand", traversable:true},
        {x: 2, y: 2, terrain: "grass", traversable:true},
        {x: 3, y: 2, terrain: "grass", traversable:true},
        {x: 4, y: 2, terrain: "grass", traversable:true},
        {x: 5, y: 2, terrain: "water", traversable:false},
        {x: 6, y: 2, terrain: "grass", traversable:true},
        {x: 7, y: 2, terrain: "grass", traversable:true},
        {x: 0, y: 3, terrain: "sand", traversable:true},
        {x: 1, y: 3, terrain: "sand", traversable:true},
        {x: 2, y: 3, terrain: "sand", traversable:true},
        {x: 3, y: 3, terrain: "grass", traversable:true},
        {x: 4, y: 3, terrain: "grass", traversable:true},
        {x: 5, y: 3, terrain: "grass", traversable:true},
        {x: 6, y: 3, terrain: "grass", traversable:true},
        {x: 7, y: 3, terrain: "grass", traversable:true},
        {x: 0, y: 4, terrain: "sand", traversable:true},
        {x: 1, y: 4, terrain: "sand", traversable:true},
        {x: 2, y: 4, terrain: "grass", traversable:true},
        {x: 3, y: 4, terrain: "grass", traversable:true},
        {x: 4, y: 4, terrain: "grass", traversable:true},
        {x: 5, y: 4, terrain: "grass", traversable:true},
        {x: 6, y: 4, terrain: "grass", traversable:true},
        {x: 7, y: 4, terrain: "sand", traversable:true},
        {x: 0, y: 5, terrain: "sand", traversable:true},
        {x: 1, y: 5, terrain: "grass", traversable:true},
        {x: 2, y: 5, terrain: "grass", traversable:true},
        {x: 3, y: 5, terrain: "water", traversable:false},
        {x: 4, y: 5, terrain: "grass", traversable:true},
        {x: 5, y: 5, terrain: "grass", traversable:true},
        {x: 6, y: 5, terrain: "sand", traversable:true},
        {x: 7, y: 5, terrain: "sand", traversable:true},
        {x: 0, y: 6, terrain: "sand", traversable:true},
        {x: 1, y: 6, terrain: "sand", traversable:true},
        {x: 2, y: 6, terrain: "grass", traversable:true},
        {x: 3, y: 6, terrain: "grass", traversable:true},
        {x: 4, y: 6, terrain: "grass", traversable:true},
        {x: 5, y: 6, terrain: "sand", traversable:true},
        {x: 6, y: 6, terrain: "sand", traversable:true},
        {x: 7, y: 6, terrain: "sand", traversable:true},
        {x: 0, y: 7, terrain: "sand", traversable:true},
        {x: 1, y: 7, terrain: "sand", traversable:true},
        {x: 2, y: 7, terrain: "sand", traversable:true},
        {x: 3, y: 7, terrain: "grass", traversable:true},
        {x: 4, y: 7, terrain: "sand", traversable:true},
        {x: 5, y: 7, terrain: "sand", traversable:true},
        {x: 6, y: 7, terrain: "sand", traversable:true},
        {x: 7, y: 7, terrain: "sand", traversable:true}
    ];

addCells();

function addCells(){
    var cell;
    for(var i=0; i<cells.length; i++){
        cell = cells[i];
        db.terrain.insert(cell);
    }
}


