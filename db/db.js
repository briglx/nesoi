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
db.terrain_test.drop();


print("\nCreate Terrain...");
db.runCommand( { 
    create: "terrain"
});


print("\nList Collections...");
print(db.getCollectionNames());


print("\nAdd Terrain...");

load("zelda.js");

addCells();

function addCells(){
    var cell;
    for(var i=0; i<cells.length; i++){
        cell = cells[i];
        db.terrain.insert(cell);
    }
}


