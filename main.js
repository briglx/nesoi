"use strict";

(function() {

    function Person(){
        this.x = 5;
        this.y = 5;
        this.moveUp = function(){
            if(this.y > 0){
                this.y = this.y-1;                
            }            
            console.log(this.x + " " + this.y);
        };
        this.moveDown = function(){
            if(this.y < 7){
                this.y = this.y+1;
            }
            console.log(this.x + " " + this.y);
        };
        this.moveLeft = function(){
            if(this.x > 0){
                this.x = this.x-1;
            }
            console.log(this.x + " " + this.y);
        };
        this.moveRight = function(){
            if(this.x < 7){
                this.x = this.x+1;
            }
            console.log(this.x + " " + this.y);
        };

    }
    
    var jim = new Person();
   
    var cells = [
        {x: 0, y: 0, terrain: "sand"},
        {x: 1, y: 0, terrain: "sand"},
        {x: 2, y: 0, terrain: "grass"},
        {x: 3, y: 0, terrain: "grass"},
        {x: 4, y: 0, terrain: "grass"},
        {x: 5, y: 0, terrain: "hill"},
        {x: 6, y: 0, terrain: "grass"},
        {x: 7, y: 0, terrain: "sand"},
        {x: 0, y: 1, terrain: "sand"},
        {x: 1, y: 1, terrain: "grass"},
        {x: 2, y: 1, terrain: "grass"},
        {x: 3, y: 1, terrain: "grass"},
        {x: 4, y: 1, terrain: "hill"},
        {x: 5, y: 1, terrain: "hill"},
        {x: 6, y: 1, terrain: "hill"},
        {x: 7, y: 1, terrain: "grass"},
        {x: 0, y: 2, terrain: "sand"},
        {x: 1, y: 2, terrain: "sand"},
        {x: 2, y: 2, terrain: "grass"},
        {x: 3, y: 2, terrain: "grass"},
        {x: 4, y: 2, terrain: "grass"},
        {x: 5, y: 2, terrain: "hill"},
        {x: 6, y: 2, terrain: "grass"},
        {x: 7, y: 2, terrain: "grass"},
        {x: 0, y: 3, terrain: "sand"},
        {x: 1, y: 3, terrain: "sand"},
        {x: 2, y: 3, terrain: "sand"},
        {x: 3, y: 3, terrain: "grass"},
        {x: 4, y: 3, terrain: "grass"},
        {x: 5, y: 3, terrain: "grass"},
        {x: 6, y: 3, terrain: "grass"},
        {x: 7, y: 3, terrain: "grass"},
        {x: 0, y: 4, terrain: "sand"},
        {x: 1, y: 4, terrain: "sand"},
        {x: 2, y: 4, terrain: "grass"},
        {x: 3, y: 4, terrain: "grass"},
        {x: 4, y: 4, terrain: "grass"},
        {x: 5, y: 4, terrain: "grass"},
        {x: 6, y: 4, terrain: "grass"},
        {x: 7, y: 4, terrain: "sand"},
        {x: 0, y: 5, terrain: "sand"},
        {x: 1, y: 5, terrain: "grass"},
        {x: 2, y: 5, terrain: "grass"},
        {x: 3, y: 5, terrain: "hill"},
        {x: 4, y: 5, terrain: "grass"},
        {x: 5, y: 5, terrain: "grass"},
        {x: 6, y: 5, terrain: "sand"},
        {x: 7, y: 5, terrain: "sand"},
        {x: 0, y: 6, terrain: "sand"},
        {x: 1, y: 6, terrain: "sand"},
        {x: 2, y: 6, terrain: "grass"},
        {x: 3, y: 6, terrain: "grass"},
        {x: 4, y: 6, terrain: "grass"},
        {x: 5, y: 6, terrain: "sand"},
        {x: 6, y: 6, terrain: "sand"},
        {x: 7, y: 6, terrain: "sand"},
        {x: 0, y: 7, terrain: "sand"},
        {x: 1, y: 7, terrain: "sand"},
        {x: 2, y: 7, terrain: "sand"},
        {x: 3, y: 7, terrain: "grass"},
        {x: 4, y: 7, terrain: "sand"},
        {x: 5, y: 7, terrain: "sand"},
        {x: 6, y: 7, terrain: "sand"},
        {x: 7, y: 7, terrain: "sand"}
    ];

    drawMap(cells);    
    drawPerson(jim);


    var body = document.querySelector("body");
    body.addEventListener("keydown", function(e){
        
        
        if(e.keyCode === 38){
            jim.moveUp();
            e.preventDefault();
        } else if (e.keyCode === 37){
            jim.moveLeft();
            e.preventDefault();
        } else if (e.keyCode === 39){
            jim.moveRight();
            e.preventDefault();
        } else if (e.keyCode === 40){
            jim.moveDown();
            e.preventDefault();
        } else {
            // nothing
        }
        drawMap(cells);
        drawPerson(jim);
        
    });
    







    function drawMap(cells){
        var cell;
        for(var i=0; i<cells.length; i++){
            cell = cells[i];
            drawTerrain(cell);
            console.log(cell.terrain)
        }
    }
    function drawPerson(person){
        var child = coordToIndex(person.x, person.y);
        var selector = '.content div:nth-child(' + child + ')';
        var el = document.querySelector(selector);
        el.style.backgroundColor = "rgba(0,255,0,0.5)";

    }

    function drawTerrain(cell){

        var child = coordToIndex(cell.x, cell.y);
        var selector = '.content div:nth-child(' + child + ')';
        var el = document.querySelector(selector);
        var color = "black";

        if(cell.terrain === "sand"){
            color = "rgba(233, 180, 78, 1)";
        } else if(cell.terrain === "grass"){
            color = "rgba(17, 172, 0, 1)";
        } else if(cell.terrain === "hill"){
            color = "rgba(222, 226, 4, 1)";
        }

        el.style.backgroundColor = color;

    }

    function coordToIndex(x, y){
        return (8 * y) + x + 1;
    }

})();