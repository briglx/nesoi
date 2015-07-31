"use strict";

(function() {

    var $ = require('jquery');
    var Backbone = require('backbone');
    var _ = require('underscore');
    Backbone.$ = $;

    // Elements
    var personEl = document.querySelector("p");

    
    // Objects
    function Person(){
        this.x = 5;
        this.y = 5;
        this.moveUp = function(){
            if(this.y > 0){

                // Can I move to the target?
                var target = {x: this.x, y:this.y-1};

                // check if the target is traversable
                var targetCell = getCell(target);

                if(targetCell.traversable){
                    this.y = target.y;   
                }                
            }                        
        };
        this.moveDown = function(){
            if(this.y < 7){
                var target = {x: this.x, y:this.y+1};
                var targetCell = getCell(target);
                if(targetCell.traversable){
                    this.y = target.y;
                }
            }            
        };
        this.moveLeft = function(){
            if(this.x > 0){
                var target = {x: this.x-1, y:this.y};
                var targetCell = getCell(target);
                if(targetCell.traversable){
                    this.x = target.x;
                }
            }            
        };
        this.moveRight = function(){
            if(this.x < 7){
                var target = {x: this.x+1, y:this.y};
                var targetCell = getCell(target);
                if(targetCell.traversable){
                    this.x = target.x;
                }
            }            
        };

    }
    
    
    var jim = new Person();

    _.extend(jim, Backbone.Events);
    jim.on("moveUp", function(e) {
        this.moveUp();        
    });
    jim.on("moveDown", function(e) {
        this.moveDown();        
    });
    jim.on("moveLeft", function(e) {
        this.moveLeft();        
    });
    jim.on("moveRight", function(e) {
        this.moveRight();        
    });

    // Data
    var cells = [
        {x: 0, y: 0, terrain: "sand", traversable:true},
        {x: 1, y: 0, terrain: "sand", traversable:true},
        {x: 2, y: 0, terrain: "grass", traversable:true},
        {x: 3, y: 0, terrain: "grass", traversable:true},
        {x: 4, y: 0, terrain: "grass", traversable:true},
        {x: 5, y: 0, terrain: "hill", traversable:false},
        {x: 6, y: 0, terrain: "grass", traversable:true},
        {x: 7, y: 0, terrain: "sand", traversable:true},
        {x: 0, y: 1, terrain: "sand", traversable:true},
        {x: 1, y: 1, terrain: "grass", traversable:true},
        {x: 2, y: 1, terrain: "grass", traversable:true},
        {x: 3, y: 1, terrain: "grass", traversable:true},
        {x: 4, y: 1, terrain: "hill", traversable:false},
        {x: 5, y: 1, terrain: "hill", traversable:false},
        {x: 6, y: 1, terrain: "hill", traversable:false},
        {x: 7, y: 1, terrain: "grass", traversable:true},
        {x: 0, y: 2, terrain: "sand", traversable:true},
        {x: 1, y: 2, terrain: "sand", traversable:true},
        {x: 2, y: 2, terrain: "grass", traversable:true},
        {x: 3, y: 2, terrain: "grass", traversable:true},
        {x: 4, y: 2, terrain: "grass", traversable:true},
        {x: 5, y: 2, terrain: "hill", traversable:false},
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
        {x: 3, y: 5, terrain: "hill", traversable:false},
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

    drawMap(cells);    
    drawPerson(jim);

    // Bind Document Events
    $("body").on("keydown", function(e){
        
        // Map arrows to events
        if(e.keyCode === 38){
            jim.trigger("moveUp");            
            e.preventDefault();
        } else if (e.keyCode === 37){
            jim.trigger("moveLeft");            
            e.preventDefault();
        } else if (e.keyCode === 39){
            jim.trigger("moveRight");            
            e.preventDefault();
        } else if (e.keyCode === 40){
            jim.trigger("moveDown");            
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
            
        }
    }
    function drawPerson(person){

        var child = coordToIndex(person.x, person.y);
        var selector = '.content div:nth-child(' + child + ')';
        var el = document.querySelector(selector);

        personEl.style.width =  el.offsetWidth  + "px";
        personEl.style.left =  el.offsetLeft + "px";
        personEl.style.top = el.offsetTop + "px";

    }

    function drawTerrain(cell){

        var child = coordToIndex(cell.x, cell.y);
        var selector = '.content div:nth-child(' + child + ')';
        var el = document.querySelector(selector);
        var color = "black";

        el.className = cell.terrain;

    }

    function coordToIndex(x, y){
        return (8 * y) + x + 1;
    }

    function getCell(point) {
        return cells[coordToIndex(point.x, point.y)-1];
    }

})();