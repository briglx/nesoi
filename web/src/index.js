"use strict";

(function() {

    var $ = require('jquery');
    var Backbone = require('backbone');
    var _ = require('underscore');
    Backbone.$ = $;

    var cellBounds = {
        min: {x: 0, y:0},
        max: {x: 63, y:63}
    };

    var worldBounds = {
        min: {x: 0, y:0},
        max: {x: 40, y:19}
    };
    var defaultBounds = {
        min: {x: 0, y:0},
        max: {x: 15, y:9},
        getWidth: function(){return this.max.x - this.min.x + 1},
        getHeight: function(){return this.max.y - this.min.y + 1}
    };
    var bounds = defaultBounds;

    drawMap(bounds);

    var Direction = {
        top: 12,
        right: 3,
        bottom: 6,
        left: 9
    }

    // Elements
    var personEl = document.querySelector("p");

    
    // Objects
    function Person(){
        this.facing = Direction.right;
        this.x = 4;
        this.y = 4;
        this.moveUp = function(){

            if(this.facing != Direction.top){
                this.facing = Direction.top;
                return false;
            }

            var target = {x: this.x, y:this.y-1};

            if(inBoundary(target) && inWorld(target)){

                // check if the target is traversable
                var targetCell = getCell(target);

                if(targetCell.traversable){
                    if(targetCell.terrain == "quicksand"){
                        alert("You Died");
                        resetGame(this);
                    }
                    else
                    {
                        this.y = target.y;       
                    }
                    
                }                
            } 
            else {
                if(inWorld(target)){
                    bounds = getBounds(target);
                    // bounds = {
                    //     min: {x: bounds.min.x, y: bounds.min.y - (bounds.max.y - bounds.min.y + 1)},
                    //     max: {x: bounds.max.x, y: bounds.max.y - (bounds.max.y - bounds.min.y + 1)}
                    // };
                    this.y = bounds.max.y;    
                }
            }                   
        };
        this.moveDown = function(){

            if(this.facing != Direction.bottom){
                this.facing = Direction.bottom;
                return false;
            }

            var target = {x: this.x, y:this.y+1};
            if(inBoundary(target) && inWorld(target)){                
                var targetCell = getCell(target);
                if(targetCell.traversable){
                    if(targetCell.terrain == "quicksand"){
                        alert("You Died");
                        resetGame(this);
                    }
                    else
                    {
                        this.y = target.y;
                    }
                }
            }  
            else {
                if(inWorld(target)){
                    bounds = getBounds(target);

                    // bounds = {
                    //     min: {x: bounds.min.x, y: bounds.min.y + (bounds.max.y - bounds.min.y + 1)},
                    //     max: {x: bounds.max.x, y: bounds.max.y + (bounds.max.y - bounds.min.y + 1)}
                    // };
                    this.y = bounds.min.y;    
                }
            }          
        };
        this.moveLeft = function(){

            if(this.facing != Direction.left){
                this.facing = Direction.left;
                return false;
            }


            var target = {x: this.x-1, y:this.y};
            
            if(inBoundary(target) && inWorld(target)){                
                var targetCell = getCell(target);
                if(targetCell.traversable){
                    if(targetCell.terrain == "quicksand"){
                        alert("You Died");
                        resetGame(this);
                    }
                    else
                    {
                        this.x = target.x;
                    }
                }
            } else {

                if(inWorld(target)){
                    bounds = getBounds(target);

                    //  bounds = {
                    //     min: {x: bounds.min.x - (bounds.max.x - bounds.min.x + 1 ), y: bounds.min.y},
                    //     max: {x: bounds.max.x - (bounds.max.x - bounds.min.x + 1), y: bounds.max.y}
                    // };
                    this.x = bounds.max.x;    
                }
                
            }           
        };
        this.moveRight = function(){

            if(this.facing != Direction.right){
                this.facing = Direction.right;
                return false;
            }

            var target = {x: this.x+1, y:this.y};
            if(inBoundary(target) && inWorld(target)){                
                var targetCell = getCell(target);
                if(targetCell.traversable){
                    if(targetCell.terrain == "quicksand"){
                        alert("You Died");
                        resetGame(this);
                    }
                    else
                    {
                        this.x = target.x;
                    }
                }
            } else {
                // Load new boundary
                if(inWorld(target)){
                    bounds = getBounds(target);
                    // bounds = {
                    //     min: {x: bounds.min.x + (bounds.max.x - bounds.min.x + 1), y: bounds.min.y} ,
                    //     max: {x: bounds.max.x + (bounds.max.x - bounds.min.x + 1), y: bounds.max.y} 
                    // };

                    this.x = bounds.min.x;
                }
            }            
        };

    }

    function resetGame(person){
        bounds = {
            min: {x: 0, y: 0},
            max: {x: 15, y: 9}
        };
        person.x = 5;
        person.y = 5;

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

   
    var cells = [
        {x: 0, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 1, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 2, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 3, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 4, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 5, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 6, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 7, y: 0, terrain: "dirt", traversable:true},
        {x: 8, y: 0, terrain: "dirt", traversable:true},
        {x: 9, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 10, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 11, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 12, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 13, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 14, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 15, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 16, y: 0, terrain: "mountainGreen", traversable:false},
        {x: 17, y: 0, terrain: "water", traversable:false},
        {x: 18, y: 0, terrain: "water", traversable:false},
        {x: 19, y: 0, terrain: "dirt", traversable:true},
        {x: 20, y: 0, terrain: "dirt", traversable:true},
        {x: 21, y: 0, terrain: "water", traversable:false},
        {x: 22, y: 0, terrain: "water", traversable:false},
        {x: 23, y: 0, terrain: "dirt", traversable:true},
        {x: 24, y: 0, terrain: "dirt", traversable:true},
        {x: 25, y: 0, terrain: "sand", traversable:true},
        {x: 26, y: 0, terrain: "dirt", traversable:true},
        {x: 27, y: 0, terrain: "water", traversable:false},
        {x: 28, y: 0, terrain: "water", traversable:false},
        {x: 29, y: 0, terrain: "dirt", traversable:true},
        {x: 30, y: 0, terrain: "dirt", traversable:true},
        {x: 31, y: 0, terrain: "water", traversable:false},
        {x: 32, y: 0, terrain: "water", traversable:false},
        {x: 33, y: 0, terrain: "dirt", traversable:true},
        {x: 34, y: 0, terrain: "dirt", traversable:true},
        {x: 35, y: 0, terrain: "sand", traversable:true},
        {x: 36, y: 0, terrain: "dirt", traversable:true},
        {x: 37, y: 0, terrain: "water", traversable:false},
        {x: 38, y: 0, terrain: "water", traversable:false},
        {x: 39, y: 0, terrain: "dirt", traversable:true},
        {x: 40, y: 0, terrain: "dirt", traversable:true},
       
        {x: 0, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 1, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 2, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 3, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 4, y: 1, terrain: "cave", traversable:true},
        {x: 5, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 6, y: 1, terrain: "mountainGreenLowerRight", traversable:false},
        {x: 7, y: 1, terrain: "dirt", traversable:true},
        {x: 8, y: 1, terrain: "dirt", traversable:true},
        {x: 9, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 10, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 11, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 12, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 13, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 14, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 15, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 16, y: 1, terrain: "mountainGreen", traversable:false},
        {x: 17, y: 1, terrain: "water", traversable:false},
        {x: 18, y: 1, terrain: "water", traversable:false},
        {x: 19, y: 1, terrain: "dirt", traversable:true},
        {x: 20, y: 1, terrain: "dirt", traversable:true},
        {x: 21, y: 1, terrain: "water", traversable:false},
        {x: 22, y: 1, terrain: "water", traversable:false},
        {x: 23, y: 1, terrain: "dirt", traversable:true},
        {x: 24, y: 1, terrain: "dirt", traversable:true},
        {x: 25, y: 1, terrain: "sand", traversable:true},
        {x: 26, y: 1, terrain: "dirt", traversable:true},
        {x: 27, y: 1, terrain: "water", traversable:false},
        {x: 28, y: 1, terrain: "water", traversable:false},
        {x: 29, y: 1, terrain: "dirt", traversable:true},
        {x: 30, y: 1, terrain: "dirt", traversable:true},
        {x: 31, y: 1, terrain: "water", traversable:false},
        {x: 32, y: 1, terrain: "water", traversable:false},
        {x: 33, y: 1, terrain: "dirt", traversable:true},
        {x: 34, y: 1, terrain: "dirt", traversable:true},
        {x: 35, y: 1, terrain: "sand", traversable:true},
        {x: 36, y: 1, terrain: "dirt", traversable:true},
        {x: 37, y: 1, terrain: "water", traversable:false},
        {x: 38, y: 1, terrain: "water", traversable:false},
        {x: 39, y: 1, terrain: "dirt", traversable:true},
        {x: 40, y: 1, terrain: "dirt", traversable:true},


        {x: 0, y: 2, terrain: "mountainGreen", traversable:false},
        {x: 1, y: 2, terrain: "mountainGreen", traversable:false},
        {x: 2, y: 2, terrain: "mountainGreen", traversable:false},
        {x: 3, y: 2, terrain: "mountainGreenLowerRight", traversable:false},
        {x: 4, y: 2, terrain: "dirt", traversable:true},
        {x: 5, y: 2, terrain: "dirt", traversable:true},
        {x: 6, y: 2, terrain: "dirt", traversable:true},
        {x: 7, y: 2, terrain: "dirt", traversable:true},
        {x: 8, y: 2, terrain: "dirt", traversable:true},
        {x: 9, y: 2, terrain: "mountainGreen", traversable:false},
        {x: 10, y: 2, terrain: "mountainGreen", traversable:false},
        {x: 11, y: 2, terrain: "mountainGreen", traversable:false},
        {x: 12, y: 2, terrain: "mountainGreen", traversable:false},
        {x: 13, y: 2, terrain: "mountainGreen", traversable:false},
        {x: 14, y: 2, terrain: "mountainGreen", traversable:false},
        {x: 15, y: 2, terrain: "mountainGreen", traversable:false},
        {x: 16, y: 2, terrain: "mountainGreen", traversable:false},
        {x: 17, y: 2, terrain: "dirt", traversable:true},
        {x: 18, y: 2, terrain: "dirt", traversable:true},
        {x: 19, y: 2, terrain: "dirt", traversable:true},
        {x: 20, y: 2, terrain: "water", traversable:false},
        {x: 21, y: 2, terrain: "water", traversable:false},
        {x: 22, y: 2, terrain: "water", traversable:false},
        {x: 23, y: 2, terrain: "water", traversable:false},
        {x: 24, y: 2, terrain: "water", traversable:false},
        {x: 25, y: 2, terrain: "dirt", traversable:true},
        {x: 26, y: 2, terrain: "dirt", traversable:true},
        {x: 27, y: 2, terrain: "dirt", traversable:true},
        {x: 28, y: 2, terrain: "dirt", traversable:true},
        {x: 29, y: 2, terrain: "dirt", traversable:true},
        {x: 30, y: 2, terrain: "water", traversable:false},
        {x: 31, y: 2, terrain: "water", traversable:false},
        {x: 32, y: 2, terrain: "water", traversable:false},
        {x: 33, y: 2, terrain: "water", traversable:false},
        {x: 34, y: 2, terrain: "water", traversable:false},
        {x: 35, y: 2, terrain: "dirt", traversable:true},
        {x: 36, y: 2, terrain: "dirt", traversable:true},
        {x: 37, y: 2, terrain: "dirt", traversable:true},
        {x: 38, y: 2, terrain: "dirt", traversable:true},
        {x: 39, y: 2, terrain: "dirt", traversable:true},
        {x: 40, y: 2, terrain: "dirt", traversable:true},
        


        {x: 0, y: 3, terrain: "mountainGreen", traversable:false},
        {x: 1, y: 3, terrain: "mountainGreen", traversable:false},
        {x: 2, y: 3, terrain: "mountainGreenLowerRight", traversable:false},
        {x: 3, y: 3, terrain: "dirt", traversable:true},
        {x: 4, y: 3, terrain: "dirt", traversable:true},
        {x: 5, y: 3, terrain: "dirt", traversable:true},
        {x: 6, y: 3, terrain: "dirt", traversable:true},
        {x: 7, y: 3, terrain: "dirt", traversable:true},
        {x: 8, y: 3, terrain: "dirt", traversable:true},
        {x: 9, y: 3, terrain: "mountainGreen", traversable:false},
        {x: 10, y: 3, terrain: "mountainGreen", traversable:false},
        {x: 11, y: 3, terrain: "mountainGreen", traversable:false},
        {x: 12, y: 3, terrain: "mountainGreen", traversable:false},
        {x: 13, y: 3, terrain: "mountainGreen", traversable:false},
        {x: 14, y: 3, terrain: "mountainGreen", traversable:false},
        {x: 15, y: 3, terrain: "mountainGreen", traversable:false},
        {x: 16, y: 3, terrain: "mountainGreen", traversable:false},
        {x: 17, y: 3, terrain: "sand", traversable:true},
        {x: 18, y: 3, terrain: "sand", traversable:true},
        {x: 19, y: 3, terrain: "dirt", traversable:true},
        {x: 20, y: 3, terrain: "dirt", traversable:true},
        {x: 21, y: 3, terrain: "dirt", traversable:true},
        {x: 22, y: 3, terrain: "dirt", traversable:true},
        {x: 23, y: 3, terrain: "dirt", traversable:true},
        {x: 24, y: 3, terrain: "dirt", traversable:true},
        {x: 25, y: 3, terrain: "dirt", traversable:true},
        {x: 26, y: 3, terrain: "dirt", traversable:true},
        {x: 27, y: 3, terrain: "water", traversable:false},
        {x: 28, y: 3, terrain: "dirt", traversable:true},
        {x: 29, y: 3, terrain: "dirt", traversable:true},
        {x: 30, y: 3, terrain: "dirt", traversable:true},
        {x: 31, y: 3, terrain: "dirt", traversable:true},
        {x: 32, y: 3, terrain: "dirt", traversable:true},
        {x: 33, y: 3, terrain: "dirt", traversable:true},
        {x: 34, y: 3, terrain: "dirt", traversable:true},
        {x: 35, y: 3, terrain: "dirt", traversable:true},
        {x: 36, y: 3, terrain: "dirt", traversable:true},
        {x: 37, y: 3, terrain: "water", traversable:false},
        {x: 38, y: 3, terrain: "dirt", traversable:true},
        {x: 39, y: 3, terrain: "dirt", traversable:true},
        {x: 40, y: 3, terrain: "dirt", traversable:true},

        {x: 0, y: 4, terrain: "mountainGreen", traversable:false},
        {x: 1, y: 4, terrain: "mountainGreenLowerRight", traversable:false},
        {x: 2, y: 4, terrain: "dirt", traversable:true},
        {x: 3, y: 4, terrain: "dirt", traversable:true},
        {x: 4, y: 4, terrain: "dirt", traversable:true},
        {x: 5, y: 4, terrain: "dirt", traversable:true},
        {x: 6, y: 4, terrain: "dirt", traversable:true},
        {x: 7, y: 4, terrain: "dirt", traversable:true},
        {x: 8, y: 4, terrain: "dirt", traversable:true},
        {x: 9, y: 4, terrain: "mountainGreenLowerLeft", traversable:false},
        {x: 10, y: 4, terrain: "mountainGreen", traversable:false},
        {x: 11, y: 4, terrain: "mountainGreen", traversable:false},
        {x: 12, y: 4, terrain: "mountainGreen", traversable:false},
        {x: 13, y: 4, terrain: "mountainGreen", traversable:false},
        {x: 14, y: 4, terrain: "mountainGreen", traversable:false},
        {x: 15, y: 4, terrain: "mountainGreen", traversable:false},
        {x: 16, y: 4, terrain: "mountainGreen", traversable:false},
        {x: 17, y: 4, terrain: "water", traversable:false},
        {x: 18, y: 4, terrain: "water", traversable:false},
        {x: 19, y: 4, terrain: "dirt", traversable:true},
        {x: 20, y: 4, terrain: "dirt", traversable:true},
        {x: 21, y: 4, terrain: "water", traversable:false},
        {x: 22, y: 4, terrain: "water", traversable:false},
        {x: 23, y: 4, terrain: "dirt", traversable:true},
        {x: 24, y: 4, terrain: "dirt", traversable:true},
        {x: 25, y: 4, terrain: "sand", traversable:true},
        {x: 26, y: 4, terrain: "dirt", traversable:true},
        {x: 27, y: 4, terrain: "water", traversable:false},
        {x: 28, y: 4, terrain: "water", traversable:false},
        {x: 29, y: 4, terrain: "dirt", traversable:true},
        {x: 30, y: 4, terrain: "dirt", traversable:true},
        {x: 31, y: 4, terrain: "water", traversable:false},
        {x: 32, y: 4, terrain: "water", traversable:false},
        {x: 33, y: 4, terrain: "dirt", traversable:true},
        {x: 34, y: 4, terrain: "dirt", traversable:true},
        {x: 35, y: 4, terrain: "sand", traversable:true},
        {x: 36, y: 4, terrain: "dirt", traversable:true},
        {x: 37, y: 4, terrain: "water", traversable:false},
        {x: 38, y: 4, terrain: "water", traversable:false},
        {x: 39, y: 4, terrain: "dirt", traversable:true},
        {x: 40, y: 4, terrain: "dirt", traversable:true},
       
        {x: 0, y: 5, terrain: "dirt", traversable:true},
        {x: 1, y: 5, terrain: "dirt", traversable:true},
        {x: 2, y: 5, terrain: "dirt", traversable:true},
        {x: 3, y: 5, terrain: "dirt", traversable:true},
        {x: 4, y: 5, terrain: "dirt", traversable:true},
        {x: 5, y: 5, terrain: "dirt", traversable:true},
        {x: 6, y: 5, terrain: "dirt", traversable:true},
        {x: 7, y: 5, terrain: "dirt", traversable:true},
        {x: 8, y: 5, terrain: "dirt", traversable:true},
        {x: 9, y: 5, terrain: "dirt", traversable:true},
        {x: 10, y: 5, terrain: "dirt", traversable:true},
        {x: 11, y: 5, terrain: "dirt", traversable:true},
        {x: 12, y: 5, terrain: "dirt", traversable:true},
        {x: 13, y: 5, terrain: "dirt", traversable:true},
        {x: 14, y: 5, terrain: "dirt", traversable:true},
        {x: 15, y: 5, terrain: "dirt", traversable:true},
        {x: 16, y: 5, terrain: "dirt", traversable:true},
        {x: 17, y: 5, terrain: "water", traversable:false},
        {x: 18, y: 5, terrain: "water", traversable:false},
        {x: 19, y: 5, terrain: "dirt", traversable:true},
        {x: 20, y: 5, terrain: "dirt", traversable:true},
        {x: 21, y: 5, terrain: "water", traversable:false},
        {x: 22, y: 5, terrain: "water", traversable:false},
        {x: 23, y: 5, terrain: "dirt", traversable:true},
        {x: 24, y: 5, terrain: "dirt", traversable:true},
        {x: 25, y: 5, terrain: "sand", traversable:true},
        {x: 26, y: 5, terrain: "dirt", traversable:true},
        {x: 27, y: 5, terrain: "water", traversable:false},
        {x: 28, y: 5, terrain: "water", traversable:false},
        {x: 29, y: 5, terrain: "dirt", traversable:true},
        {x: 30, y: 5, terrain: "dirt", traversable:true},
        {x: 31, y: 5, terrain: "water", traversable:false},
        {x: 32, y: 5, terrain: "water", traversable:false},
        {x: 33, y: 5, terrain: "dirt", traversable:true},
        {x: 34, y: 5, terrain: "dirt", traversable:true},
        {x: 35, y: 5, terrain: "sand", traversable:true},
        {x: 36, y: 5, terrain: "dirt", traversable:true},
        {x: 37, y: 5, terrain: "water", traversable:false},
        {x: 38, y: 5, terrain: "water", traversable:false},
        {x: 39, y: 5, terrain: "dirt", traversable:true},
        {x: 40, y: 5, terrain: "dirt", traversable:true},


        {x: 0, y: 6, terrain: "mountainGreenTop", traversable:false},
        {x: 1, y: 6, terrain: "mountainGreenTopRight", traversable:false},
        {x: 2, y: 6, terrain: "dirt", traversable:true},
        {x: 3, y: 6, terrain: "dirt", traversable:true},
        {x: 4, y: 6, terrain: "dirt", traversable:true},
        {x: 5, y: 6, terrain: "dirt", traversable:true},
        {x: 6, y: 6, terrain: "dirt", traversable:true},
        {x: 7, y: 6, terrain: "dirt", traversable:true},
        {x: 8, y: 6, terrain: "dirt", traversable:true},
        {x: 9, y: 6, terrain: "dirt", traversable:true},
        {x: 10, y: 6, terrain: "dirt", traversable:true},
        {x: 11, y: 6, terrain: "dirt", traversable:true},
        {x: 12, y: 6, terrain: "dirt", traversable:true},
        {x: 13, y: 6, terrain: "dirt", traversable:true},
        {x: 14, y: 6, terrain: "mountainGreenTop", traversable:false},
        {x: 15, y: 6, terrain: "mountainGreenTop", traversable:false},
        {x: 16, y: 6, terrain: "dirt", traversable:true},
        {x: 17, y: 6, terrain: "dirt", traversable:true},
        {x: 18, y: 6, terrain: "dirt", traversable:true},
        {x: 19, y: 6, terrain: "dirt", traversable:true},
        {x: 20, y: 6, terrain: "water", traversable:false},
        {x: 21, y: 6, terrain: "water", traversable:false},
        {x: 22, y: 6, terrain: "water", traversable:false},
        {x: 23, y: 6, terrain: "water", traversable:false},
        {x: 24, y: 6, terrain: "water", traversable:false},
        {x: 25, y: 6, terrain: "dirt", traversable:true},
        {x: 26, y: 6, terrain: "dirt", traversable:true},
        {x: 27, y: 6, terrain: "dirt", traversable:true},
        {x: 28, y: 6, terrain: "dirt", traversable:true},
        {x: 29, y: 6, terrain: "dirt", traversable:true},
        {x: 30, y: 6, terrain: "water", traversable:false},
        {x: 31, y: 6, terrain: "water", traversable:false},
        {x: 32, y: 6, terrain: "water", traversable:false},
        {x: 33, y: 6, terrain: "water", traversable:false},
        {x: 34, y: 6, terrain: "water", traversable:false},
        {x: 35, y: 6, terrain: "dirt", traversable:true},
        {x: 36, y: 6, terrain: "dirt", traversable:true},
        {x: 37, y: 6, terrain: "dirt", traversable:true},
        {x: 38, y: 6, terrain: "dirt", traversable:true},
        {x: 39, y: 6, terrain: "dirt", traversable:true},
        {x: 40, y: 6, terrain: "dirt", traversable:true},
        


        {x: 0, y: 7, terrain: "mountainGreen", traversable:false},
        {x: 1, y: 7, terrain: "mountainGreen", traversable:false},
        {x: 2, y: 7, terrain: "dirt", traversable:true},
        {x: 3, y: 7, terrain: "dirt", traversable:true},
        {x: 4, y: 7, terrain: "dirt", traversable:true},
        {x: 5, y: 7, terrain: "dirt", traversable:true},
        {x: 6, y: 7, terrain: "dirt", traversable:true},
        {x: 7, y: 7, terrain: "dirt", traversable:true},
        {x: 8, y: 7, terrain: "dirt", traversable:true},
        {x: 9, y: 7, terrain: "dirt", traversable:true},
        {x: 10, y: 7, terrain: "dirt", traversable:true},
        {x: 11, y: 7, terrain: "dirt", traversable:true},
        {x: 12, y: 7, terrain: "dirt", traversable:true},
        {x: 13, y: 7, terrain: "dirt", traversable:true},
        {x: 14, y: 7, terrain: "mountainGreen", traversable:false},
        {x: 15, y: 7, terrain: "mountainGreen", traversable:false},
        {x: 16, y: 7, terrain: "sand", traversable:true},
        {x: 17, y: 7, terrain: "sand", traversable:true},
        {x: 18, y: 7, terrain: "sand", traversable:true},
        {x: 19, y: 7, terrain: "dirt", traversable:true},
        {x: 20, y: 7, terrain: "dirt", traversable:true},
        {x: 21, y: 7, terrain: "dirt", traversable:true},
        {x: 22, y: 7, terrain: "dirt", traversable:true},
        {x: 23, y: 7, terrain: "dirt", traversable:true},
        {x: 24, y: 7, terrain: "dirt", traversable:true},
        {x: 25, y: 7, terrain: "dirt", traversable:true},
        {x: 26, y: 7, terrain: "dirt", traversable:true},
        {x: 27, y: 7, terrain: "water", traversable:false},
        {x: 28, y: 7, terrain: "dirt", traversable:true},
        {x: 29, y: 7, terrain: "dirt", traversable:true},
        {x: 30, y: 7, terrain: "dirt", traversable:true},
        {x: 31, y: 7, terrain: "dirt", traversable:true},
        {x: 32, y: 7, terrain: "dirt", traversable:true},
        {x: 33, y: 7, terrain: "dirt", traversable:true},
        {x: 34, y: 7, terrain: "dirt", traversable:true},
        {x: 35, y: 7, terrain: "dirt", traversable:true},
        {x: 36, y: 7, terrain: "dirt", traversable:true},
        {x: 37, y: 7, terrain: "water", traversable:false},
        {x: 38, y: 7, terrain: "dirt", traversable:true},
        {x: 39, y: 7, terrain: "dirt", traversable:true},
        {x: 40, y: 7, terrain: "dirt", traversable:true},

        {x: 0, y: 8, terrain: "mountainGreen", traversable:false},
        {x: 1, y: 8, terrain: "mountainGreen", traversable:false},
        {x: 2, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 3, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 4, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 5, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 6, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 7, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 8, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 9, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 10, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 11, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 12, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 13, y: 8, terrain: "mountainGreenTop", traversable:false},
        {x: 14, y: 8, terrain: "mountainGreen", traversable:false},
        {x: 15, y: 8, terrain: "mountainGreen", traversable:false},
        {x: 16, y: 8, terrain: "sand", traversable:true},
        {x: 17, y: 8, terrain: "sand", traversable:true},
        {x: 18, y: 8, terrain: "dirt", traversable:true},
        {x: 19, y: 8, terrain: "dirt", traversable:true},
        {x: 20, y: 8, terrain: "dirt", traversable:true},
        {x: 21, y: 8, terrain: "dirt", traversable:true},
        {x: 22, y: 8, terrain: "dirt", traversable:true},
        {x: 23, y: 8, terrain: "sand", traversable:true},
        {x: 24, y: 8, terrain: "sand", traversable:true},
        {x: 25, y: 8, terrain: "sand", traversable:true},
        {x: 26, y: 8, terrain: "dirt", traversable:true},
        {x: 27, y: 8, terrain: "dirt", traversable:true},
        {x: 28, y: 8, terrain: "dirt", traversable:true},
        {x: 29, y: 8, terrain: "dirt", traversable:true},
        {x: 30, y: 8, terrain: "sand", traversable:true},
        {x: 31, y: 8, terrain: "dirt", traversable:true},
        {x: 32, y: 8, terrain: "dirt", traversable:true},
        {x: 33, y: 8, terrain: "sand", traversable:true},
        {x: 34, y: 8, terrain: "sand", traversable:true},
        {x: 35, y: 8, terrain: "dirt", traversable:true},
        {x: 36, y: 8, terrain: "dirt", traversable:true},
        {x: 37, y: 8, terrain: "dirt", traversable:true},
        {x: 38, y: 8, terrain: "dirt", traversable:true},
        {x: 39, y: 8, terrain: "dirt", traversable:true},
        {x: 40, y: 8, terrain: "sand", traversable:true},

        {x: 0, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 1, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 2, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 3, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 4, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 5, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 6, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 7, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 8, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 9, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 10, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 11, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 12, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 13, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 14, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 15, y: 9, terrain: "mountainGreen", traversable:false},
        {x: 16, y: 9, terrain: "sand", traversable:true},
        {x: 17, y: 9, terrain: "sand", traversable:true},
        {x: 18, y: 9, terrain: "dirt", traversable:true},
        {x: 19, y: 9, terrain: "dirt", traversable:true},
        {x: 20, y: 9, terrain: "dirt", traversable:true},
        {x: 21, y: 9, terrain: "dirt", traversable:true},
        {x: 22, y: 9, terrain: "dirt", traversable:true},
        {x: 23, y: 9, terrain: "sand", traversable:true},
        {x: 24, y: 9, terrain: "sand", traversable:true},
        {x: 25, y: 9, terrain: "sand", traversable:true},
        {x: 26, y: 9, terrain: "dirt", traversable:true},
        {x: 27, y: 9, terrain: "dirt", traversable:true},
        {x: 28, y: 9, terrain: "dirt", traversable:true},
        {x: 29, y: 9, terrain: "dirt", traversable:true},
        {x: 30, y: 9, terrain: "sand", traversable:true},
        {x: 31, y: 9, terrain: "dirt", traversable:true},
        {x: 32, y: 9, terrain: "dirt", traversable:true},
        {x: 33, y: 9, terrain: "sand", traversable:true},
        {x: 34, y: 9, terrain: "sand", traversable:true},
        {x: 35, y: 9, terrain: "sand", traversable:true},
        {x: 36, y: 9, terrain: "dirt", traversable:true},
        {x: 37, y: 9, terrain: "dirt", traversable:true},
        {x: 38, y: 9, terrain: "dirt", traversable:true},
        {x: 39, y: 9, terrain: "dirt", traversable:true},
        {x: 40, y: 9, terrain: "sand", traversable:true},
       
        {x: 0, y: 10, terrain: "sand", traversable:true},
        {x: 1, y: 10, terrain: "sand", traversable:true},
        {x: 2, y: 10, terrain: "dirt", traversable:true},
        {x: 3, y: 10, terrain: "dirt", traversable:true},
        {x: 4, y: 10, terrain: "dirt", traversable:true},
        {x: 5, y: 10, terrain: "dirt", traversable:true},
        {x: 6, y: 10, terrain: "dirt", traversable:true},
        {x: 7, y: 10, terrain: "sand", traversable:true},
        {x: 8, y: 10, terrain: "sand", traversable:true},
        {x: 9, y: 10, terrain: "dirt", traversable:true},
        {x: 10, y: 10, terrain: "dirt", traversable:true},
        {x: 11, y: 10, terrain: "dirt", traversable:true},
        {x: 12, y: 10, terrain: "dirt", traversable:true},
        {x: 13, y: 10, terrain: "sand", traversable:true},
        {x: 14, y: 10, terrain: "sand", traversable:true},
        {x: 15, y: 10, terrain: "dirt", traversable:true},
        {x: 16, y: 10, terrain: "sand", traversable:true},
        {x: 17, y: 10, terrain: "sand", traversable:true},
        {x: 18, y: 10, terrain: "dirt", traversable:true},
        {x: 19, y: 10, terrain: "dirt", traversable:true},
        {x: 20, y: 10, terrain: "dirt", traversable:true},
        {x: 21, y: 10, terrain: "dirt", traversable:true},
        {x: 22, y: 10, terrain: "dirt", traversable:true},
        {x: 23, y: 10, terrain: "sand", traversable:true},
        {x: 24, y: 10, terrain: "sand", traversable:true},
        {x: 25, y: 10, terrain: "sand", traversable:true},
        {x: 26, y: 10, terrain: "dirt", traversable:true},
        {x: 27, y: 10, terrain: "dirt", traversable:true},
        {x: 28, y: 10, terrain: "dirt", traversable:true},
        {x: 29, y: 10, terrain: "dirt", traversable:true},
        {x: 30, y: 10, terrain: "sand", traversable:true},
        {x: 31, y: 10, terrain: "dirt", traversable:true},
        {x: 32, y: 10, terrain: "dirt", traversable:true},
        {x: 33, y: 10, terrain: "sand", traversable:true},
        {x: 34, y: 10, terrain: "sand", traversable:true},
        {x: 35, y: 10, terrain: "sand", traversable:true},
        {x: 36, y: 10, terrain: "dirt", traversable:true},
        {x: 37, y: 10, terrain: "dirt", traversable:true},
        {x: 38, y: 10, terrain: "dirt", traversable:true},
        {x: 39, y: 10, terrain: "dirt", traversable:true},
        {x: 40, y: 10, terrain: "sand", traversable:true},

        {x: 0, y: 11, terrain: "sand", traversable:true},
        {x: 1, y: 11, terrain: "sand", traversable:true},
        {x: 2, y: 11, terrain: "dirt", traversable:true},
        {x: 3, y: 11, terrain: "dirt", traversable:true},
        {x: 4, y: 11, terrain: "dirt", traversable:true},
        {x: 5, y: 11, terrain: "dirt", traversable:true},
        {x: 6, y: 11, terrain: "dirt", traversable:true},
        {x: 7, y: 11, terrain: "sand", traversable:true},
        {x: 8, y: 11, terrain: "sand", traversable:true},
        {x: 9, y: 11, terrain: "dirt", traversable:true},
        {x: 10, y: 11, terrain: "dirt", traversable:true},
        {x: 11, y: 11, terrain: "dirt", traversable:true},
        {x: 12, y: 11, terrain: "dirt", traversable:true},
        {x: 13, y: 11, terrain: "sand", traversable:true},
        {x: 14, y: 11, terrain: "sand", traversable:true},
        {x: 15, y: 11, terrain: "dirt", traversable:true},
        {x: 16, y: 11, terrain: "sand", traversable:true},
        {x: 17, y: 11, terrain: "sand", traversable:true},
        {x: 18, y: 11, terrain: "dirt", traversable:true},
        {x: 19, y: 11, terrain: "dirt", traversable:true},
        {x: 20, y: 11, terrain: "dirt", traversable:true},
        {x: 21, y: 11, terrain: "dirt", traversable:true},
        {x: 22, y: 11, terrain: "dirt", traversable:true},
        {x: 23, y: 11, terrain: "sand", traversable:true},
        {x: 24, y: 11, terrain: "sand", traversable:true},
        {x: 25, y: 11, terrain: "sand", traversable:true},
        {x: 26, y: 11, terrain: "dirt", traversable:true},
        {x: 27, y: 11, terrain: "dirt", traversable:true},
        {x: 28, y: 11, terrain: "dirt", traversable:true},
        {x: 29, y: 11, terrain: "dirt", traversable:true},
        {x: 30, y: 11, terrain: "sand", traversable:true},
        {x: 31, y: 11, terrain: "dirt", traversable:true},
        {x: 32, y: 11, terrain: "dirt", traversable:true},
        {x: 33, y: 11, terrain: "sand", traversable:true},
        {x: 34, y: 11, terrain: "sand", traversable:true},
        {x: 35, y: 11, terrain: "sand", traversable:true},
        {x: 36, y: 11, terrain: "dirt", traversable:true},
        {x: 37, y: 11, terrain: "dirt", traversable:true},
        {x: 38, y: 11, terrain: "dirt", traversable:true},
        {x: 39, y: 11, terrain: "dirt", traversable:true},
        {x: 40, y: 11, terrain: "sand", traversable:true},

        {x: 0, y: 12, terrain: "sand", traversable:true},
        {x: 1, y: 12, terrain: "sand", traversable:true},
        {x: 2, y: 12, terrain: "dirt", traversable:true},
        {x: 3, y: 12, terrain: "dirt", traversable:true},
        {x: 4, y: 12, terrain: "dirt", traversable:true},
        {x: 5, y: 12, terrain: "dirt", traversable:true},
        {x: 6, y: 12, terrain: "dirt", traversable:true},
        {x: 7, y: 12, terrain: "sand", traversable:true},
        {x: 8, y: 12, terrain: "sand", traversable:true},
        {x: 9, y: 12, terrain: "dirt", traversable:true},
        {x: 10, y: 12, terrain: "dirt", traversable:true},
        {x: 11, y: 12, terrain: "dirt", traversable:true},
        {x: 12, y: 12, terrain: "dirt", traversable:true},
        {x: 13, y: 12, terrain: "sand", traversable:true},
        {x: 14, y: 12, terrain: "sand", traversable:true},
        {x: 15, y: 12, terrain: "dirt", traversable:true},
        {x: 16, y: 12, terrain: "sand", traversable:true},
        {x: 17, y: 12, terrain: "sand", traversable:true},
        {x: 18, y: 12, terrain: "dirt", traversable:true},
        {x: 19, y: 12, terrain: "dirt", traversable:true},
        {x: 20, y: 12, terrain: "dirt", traversable:true},
        {x: 21, y: 12, terrain: "dirt", traversable:true},
        {x: 22, y: 12, terrain: "dirt", traversable:true},
        {x: 23, y: 12, terrain: "sand", traversable:true},
        {x: 24, y: 12, terrain: "sand", traversable:true},
        {x: 25, y: 12, terrain: "sand", traversable:true},
        {x: 26, y: 12, terrain: "dirt", traversable:true},
        {x: 27, y: 12, terrain: "dirt", traversable:true},
        {x: 28, y: 12, terrain: "dirt", traversable:true},
        {x: 29, y: 12, terrain: "dirt", traversable:true},
        {x: 30, y: 12, terrain: "sand", traversable:true},
        {x: 31, y: 12, terrain: "dirt", traversable:true},
        {x: 32, y: 12, terrain: "dirt", traversable:true},
        {x: 33, y: 12, terrain: "sand", traversable:true},
        {x: 34, y: 12, terrain: "sand", traversable:true},
        {x: 35, y: 12, terrain: "sand", traversable:true},
        {x: 36, y: 12, terrain: "dirt", traversable:true},
        {x: 37, y: 12, terrain: "dirt", traversable:true},
        {x: 38, y: 12, terrain: "dirt", traversable:true},
        {x: 39, y: 12, terrain: "dirt", traversable:true},
        {x: 40, y: 12, terrain: "sand", traversable:true},

        {x: 0, y: 13, terrain: "sand", traversable:true},
        {x: 1, y: 13, terrain: "sand", traversable:true},
        {x: 2, y: 13, terrain: "dirt", traversable:true},
        {x: 3, y: 13, terrain: "dirt", traversable:true},
        {x: 4, y: 13, terrain: "dirt", traversable:true},
        {x: 5, y: 13, terrain: "dirt", traversable:true},
        {x: 6, y: 13, terrain: "dirt", traversable:true},
        {x: 7, y: 13, terrain: "sand", traversable:true},
        {x: 8, y: 13, terrain: "sand", traversable:true},
        {x: 9, y: 13, terrain: "dirt", traversable:true},
        {x: 10, y: 13, terrain: "dirt", traversable:true},
        {x: 11, y: 13, terrain: "dirt", traversable:true},
        {x: 12, y: 13, terrain: "dirt", traversable:true},
        {x: 13, y: 13, terrain: "sand", traversable:true},
        {x: 14, y: 13, terrain: "sand", traversable:true},
        {x: 15, y: 13, terrain: "dirt", traversable:true},
        {x: 16, y: 13, terrain: "sand", traversable:true},
        {x: 17, y: 13, terrain: "sand", traversable:true},
        {x: 18, y: 13, terrain: "dirt", traversable:true},
        {x: 19, y: 13, terrain: "dirt", traversable:true},
        {x: 20, y: 13, terrain: "dirt", traversable:true},
        {x: 21, y: 13, terrain: "dirt", traversable:true},
        {x: 22, y: 13, terrain: "dirt", traversable:true},
        {x: 23, y: 13, terrain: "sand", traversable:true},
        {x: 24, y: 13, terrain: "sand", traversable:true},
        {x: 25, y: 13, terrain: "sand", traversable:true},
        {x: 26, y: 13, terrain: "dirt", traversable:true},
        {x: 27, y: 13, terrain: "dirt", traversable:true},
        {x: 28, y: 13, terrain: "dirt", traversable:true},
        {x: 29, y: 13, terrain: "dirt", traversable:true},
        {x: 30, y: 13, terrain: "sand", traversable:true},
        {x: 31, y: 13, terrain: "dirt", traversable:true},
        {x: 32, y: 13, terrain: "dirt", traversable:true},
        {x: 33, y: 13, terrain: "sand", traversable:true},
        {x: 34, y: 13, terrain: "sand", traversable:true},
        {x: 35, y: 13, terrain: "sand", traversable:true},
        {x: 36, y: 13, terrain: "dirt", traversable:true},
        {x: 37, y: 13, terrain: "dirt", traversable:true},
        {x: 38, y: 13, terrain: "dirt", traversable:true},
        {x: 39, y: 13, terrain: "dirt", traversable:true},
        {x: 40, y: 13, terrain: "sand", traversable:true},

        {x: 0, y: 14, terrain: "sand", traversable:true},
        {x: 1, y: 14, terrain: "sand", traversable:true},
        {x: 2, y: 14, terrain: "dirt", traversable:true},
        {x: 3, y: 14, terrain: "dirt", traversable:true},
        {x: 4, y: 14, terrain: "dirt", traversable:true},
        {x: 5, y: 14, terrain: "dirt", traversable:true},
        {x: 6, y: 14, terrain: "dirt", traversable:true},
        {x: 7, y: 14, terrain: "sand", traversable:true},
        {x: 8, y: 14, terrain: "sand", traversable:true},
        {x: 9, y: 14, terrain: "dirt", traversable:true},
        {x: 10, y: 14, terrain: "dirt", traversable:true},
        {x: 11, y: 14, terrain: "dirt", traversable:true},
        {x: 12, y: 14, terrain: "dirt", traversable:true},
        {x: 13, y: 14, terrain: "sand", traversable:true},
        {x: 14, y: 14, terrain: "sand", traversable:true},
        {x: 15, y: 14, terrain: "dirt", traversable:true},
        {x: 16, y: 14, terrain: "sand", traversable:true},
        {x: 17, y: 14, terrain: "sand", traversable:true},
        {x: 18, y: 14, terrain: "dirt", traversable:true},
        {x: 19, y: 14, terrain: "dirt", traversable:true},
        {x: 20, y: 14, terrain: "dirt", traversable:true},
        {x: 21, y: 14, terrain: "dirt", traversable:true},
        {x: 22, y: 14, terrain: "dirt", traversable:true},
        {x: 23, y: 14, terrain: "sand", traversable:true},
        {x: 24, y: 14, terrain: "sand", traversable:true},
        {x: 25, y: 14, terrain: "sand", traversable:true},
        {x: 26, y: 14, terrain: "dirt", traversable:true},
        {x: 27, y: 14, terrain: "dirt", traversable:true},
        {x: 28, y: 14, terrain: "dirt", traversable:true},
        {x: 29, y: 14, terrain: "dirt", traversable:true},
        {x: 30, y: 14, terrain: "sand", traversable:true},
        {x: 31, y: 14, terrain: "dirt", traversable:true},
        {x: 32, y: 14, terrain: "dirt", traversable:true},
        {x: 33, y: 14, terrain: "sand", traversable:true},
        {x: 34, y: 14, terrain: "sand", traversable:true},
        {x: 35, y: 14, terrain: "sand", traversable:true},
        {x: 36, y: 14, terrain: "dirt", traversable:true},
        {x: 37, y: 14, terrain: "dirt", traversable:true},
        {x: 38, y: 14, terrain: "dirt", traversable:true},
        {x: 39, y: 14, terrain: "dirt", traversable:true},
        {x: 40, y: 14, terrain: "sand", traversable:true},

        {x: 0, y: 15, terrain: "sand", traversable:true},
        {x: 1, y: 15, terrain: "sand", traversable:true},
        {x: 2, y: 15, terrain: "dirt", traversable:true},
        {x: 3, y: 15, terrain: "dirt", traversable:true},
        {x: 4, y: 15, terrain: "dirt", traversable:true},
        {x: 5, y: 15, terrain: "dirt", traversable:true},
        {x: 6, y: 15, terrain: "dirt", traversable:true},
        {x: 7, y: 15, terrain: "sand", traversable:true},
        {x: 8, y: 15, terrain: "sand", traversable:true},
        {x: 9, y: 15, terrain: "dirt", traversable:true},
        {x: 10, y: 15, terrain: "dirt", traversable:true},
        {x: 11, y: 15, terrain: "dirt", traversable:true},
        {x: 12, y: 15, terrain: "dirt", traversable:true},
        {x: 13, y: 15, terrain: "sand", traversable:true},
        {x: 14, y: 15, terrain: "sand", traversable:true},
        {x: 15, y: 15, terrain: "dirt", traversable:true},
        {x: 16, y: 15, terrain: "sand", traversable:true},
        {x: 17, y: 15, terrain: "sand", traversable:true},
        {x: 18, y: 15, terrain: "dirt", traversable:true},
        {x: 19, y: 15, terrain: "dirt", traversable:true},
        {x: 20, y: 15, terrain: "dirt", traversable:true},
        {x: 21, y: 15, terrain: "dirt", traversable:true},
        {x: 22, y: 15, terrain: "dirt", traversable:true},
        {x: 23, y: 15, terrain: "sand", traversable:true},
        {x: 24, y: 15, terrain: "sand", traversable:true},
        {x: 25, y: 15, terrain: "sand", traversable:true},
        {x: 26, y: 15, terrain: "dirt", traversable:true},
        {x: 27, y: 15, terrain: "dirt", traversable:true},
        {x: 28, y: 15, terrain: "dirt", traversable:true},
        {x: 29, y: 15, terrain: "dirt", traversable:true},
        {x: 30, y: 15, terrain: "sand", traversable:true},
        {x: 31, y: 15, terrain: "dirt", traversable:true},
        {x: 32, y: 15, terrain: "dirt", traversable:true},
        {x: 33, y: 15, terrain: "sand", traversable:true},
        {x: 34, y: 15, terrain: "sand", traversable:true},
        {x: 35, y: 15, terrain: "sand", traversable:true},
        {x: 36, y: 15, terrain: "dirt", traversable:true},
        {x: 37, y: 15, terrain: "dirt", traversable:true},
        {x: 38, y: 15, terrain: "dirt", traversable:true},
        {x: 39, y: 15, terrain: "dirt", traversable:true},
        {x: 40, y: 15, terrain: "sand", traversable:true},

        {x: 0, y: 16, terrain: "sand", traversable:true},
        {x: 1, y: 16, terrain: "sand", traversable:true},
        {x: 2, y: 16, terrain: "dirt", traversable:true},
        {x: 3, y: 16, terrain: "dirt", traversable:true},
        {x: 4, y: 16, terrain: "dirt", traversable:true},
        {x: 5, y: 16, terrain: "dirt", traversable:true},
        {x: 6, y: 16, terrain: "dirt", traversable:true},
        {x: 7, y: 16, terrain: "sand", traversable:true},
        {x: 8, y: 16, terrain: "sand", traversable:true},
        {x: 9, y: 16, terrain: "dirt", traversable:true},
        {x: 10, y: 16, terrain: "dirt", traversable:true},
        {x: 11, y: 16, terrain: "dirt", traversable:true},
        {x: 12, y: 16, terrain: "dirt", traversable:true},
        {x: 13, y: 16, terrain: "sand", traversable:true},
        {x: 14, y: 16, terrain: "sand", traversable:true},
        {x: 15, y: 16, terrain: "dirt", traversable:true},
        {x: 16, y: 16, terrain: "sand", traversable:true},
        {x: 17, y: 16, terrain: "sand", traversable:true},
        {x: 18, y: 16, terrain: "dirt", traversable:true},
        {x: 19, y: 16, terrain: "dirt", traversable:true},
        {x: 20, y: 16, terrain: "dirt", traversable:true},
        {x: 21, y: 16, terrain: "dirt", traversable:true},
        {x: 22, y: 16, terrain: "dirt", traversable:true},
        {x: 23, y: 16, terrain: "sand", traversable:true},
        {x: 24, y: 16, terrain: "sand", traversable:true},
        {x: 25, y: 16, terrain: "sand", traversable:true},
        {x: 26, y: 16, terrain: "dirt", traversable:true},
        {x: 27, y: 16, terrain: "dirt", traversable:true},
        {x: 28, y: 16, terrain: "dirt", traversable:true},
        {x: 29, y: 16, terrain: "dirt", traversable:true},
        {x: 30, y: 16, terrain: "sand", traversable:true},
        {x: 31, y: 16, terrain: "dirt", traversable:true},
        {x: 32, y: 16, terrain: "dirt", traversable:true},
        {x: 33, y: 16, terrain: "sand", traversable:true},
        {x: 34, y: 16, terrain: "sand", traversable:true},
        {x: 35, y: 16, terrain: "sand", traversable:true},
        {x: 36, y: 16, terrain: "dirt", traversable:true},
        {x: 37, y: 16, terrain: "dirt", traversable:true},
        {x: 38, y: 16, terrain: "dirt", traversable:true},
        {x: 39, y: 16, terrain: "dirt", traversable:true},
        {x: 40, y: 16, terrain: "sand", traversable:true},

        {x: 0, y: 17, terrain: "sand", traversable:true},
        {x: 1, y: 17, terrain: "sand", traversable:true},
        {x: 2, y: 17, terrain: "dirt", traversable:true},
        {x: 3, y: 17, terrain: "dirt", traversable:true},
        {x: 4, y: 17, terrain: "dirt", traversable:true},
        {x: 5, y: 17, terrain: "dirt", traversable:true},
        {x: 6, y: 17, terrain: "dirt", traversable:true},
        {x: 7, y: 17, terrain: "sand", traversable:true},
        {x: 8, y: 17, terrain: "sand", traversable:true},
        {x: 9, y: 17, terrain: "dirt", traversable:true},
        {x: 10, y: 17, terrain: "dirt", traversable:true},
        {x: 11, y: 17, terrain: "dirt", traversable:true},
        {x: 12, y: 17, terrain: "dirt", traversable:true},
        {x: 13, y: 17, terrain: "sand", traversable:true},
        {x: 14, y: 17, terrain: "sand", traversable:true},
        {x: 15, y: 17, terrain: "dirt", traversable:true},
        {x: 16, y: 17, terrain: "sand", traversable:true},
        {x: 17, y: 17, terrain: "sand", traversable:true},
        {x: 18, y: 17, terrain: "dirt", traversable:true},
        {x: 19, y: 17, terrain: "dirt", traversable:true},
        {x: 20, y: 17, terrain: "dirt", traversable:true},
        {x: 21, y: 17, terrain: "dirt", traversable:true},
        {x: 22, y: 17, terrain: "dirt", traversable:true},
        {x: 23, y: 17, terrain: "sand", traversable:true},
        {x: 24, y: 17, terrain: "sand", traversable:true},
        {x: 25, y: 17, terrain: "sand", traversable:true},
        {x: 26, y: 17, terrain: "dirt", traversable:true},
        {x: 27, y: 17, terrain: "dirt", traversable:true},
        {x: 28, y: 17, terrain: "dirt", traversable:true},
        {x: 29, y: 17, terrain: "dirt", traversable:true},
        {x: 30, y: 17, terrain: "sand", traversable:true},
        {x: 31, y: 17, terrain: "dirt", traversable:true},
        {x: 32, y: 17, terrain: "dirt", traversable:true},
        {x: 33, y: 17, terrain: "sand", traversable:true},
        {x: 34, y: 17, terrain: "sand", traversable:true},        
        {x: 35, y: 17, terrain: "sand", traversable:true},
        {x: 36, y: 17, terrain: "dirt", traversable:true},        
        {x: 37, y: 17, terrain: "dirt", traversable:true},
        {x: 38, y: 17, terrain: "dirt", traversable:true},
        {x: 39, y: 17, terrain: "dirt", traversable:true},
        {x: 40, y: 17, terrain: "sand", traversable:true},

        {x: 0, y: 18, terrain: "sand", traversable:true},
        {x: 1, y: 18, terrain: "sand", traversable:true},
        {x: 2, y: 18, terrain: "dirt", traversable:true},
        {x: 3, y: 18, terrain: "dirt", traversable:true},
        {x: 4, y: 18, terrain: "dirt", traversable:true},
        {x: 5, y: 18, terrain: "dirt", traversable:true},
        {x: 6, y: 18, terrain: "dirt", traversable:true},
        {x: 7, y: 18, terrain: "sand", traversable:true},
        {x: 8, y: 18, terrain: "sand", traversable:true},
        {x: 9, y: 18, terrain: "dirt", traversable:true},
        {x: 10, y: 18, terrain: "dirt", traversable:true},
        {x: 11, y: 18, terrain: "dirt", traversable:true},
        {x: 12, y: 18, terrain: "dirt", traversable:true},
        {x: 13, y: 18, terrain: "sand", traversable:true},
        {x: 14, y: 18, terrain: "sand", traversable:true},
        {x: 15, y: 18, terrain: "dirt", traversable:true},
        {x: 16, y: 18, terrain: "sand", traversable:true},
        {x: 17, y: 18, terrain: "sand", traversable:true},
        {x: 18, y: 18, terrain: "dirt", traversable:true},
        {x: 19, y: 18, terrain: "dirt", traversable:true},
        {x: 20, y: 18, terrain: "dirt", traversable:true},
        {x: 21, y: 18, terrain: "dirt", traversable:true},
        {x: 22, y: 18, terrain: "dirt", traversable:true},
        {x: 23, y: 18, terrain: "sand", traversable:true},
        {x: 24, y: 18, terrain: "sand", traversable:true},
        {x: 25, y: 18, terrain: "sand", traversable:true},
        {x: 26, y: 18, terrain: "dirt", traversable:true},
        {x: 27, y: 18, terrain: "dirt", traversable:true},
        {x: 28, y: 18, terrain: "dirt", traversable:true},
        {x: 29, y: 18, terrain: "dirt", traversable:true},
        {x: 30, y: 18, terrain: "sand", traversable:true},
        {x: 31, y: 18, terrain: "dirt", traversable:true},
        {x: 32, y: 18, terrain: "dirt", traversable:true},
        {x: 33, y: 18, terrain: "sand", traversable:true},
        {x: 34, y: 18, terrain: "sand", traversable:true},
        {x: 35, y: 18, terrain: "sand", traversable:true},
        {x: 36, y: 18, terrain: "dirt", traversable:true},
        {x: 37, y: 18, terrain: "dirt", traversable:true},
        {x: 38, y: 18, terrain: "dirt", traversable:true},
        {x: 39, y: 18, terrain: "dirt", traversable:true},
        {x: 40, y: 18, terrain: "sand", traversable:true},


        {x: 0, y: 19, terrain: "sand", traversable:true},
        {x: 1, y: 19, terrain: "sand", traversable:true},
        {x: 2, y: 19, terrain: "dirt", traversable:true},
        {x: 3, y: 19, terrain: "dirt", traversable:true},
        {x: 4, y: 19, terrain: "dirt", traversable:true},
        {x: 5, y: 19, terrain: "dirt", traversable:true},
        {x: 6, y: 19, terrain: "dirt", traversable:true},
        {x: 7, y: 19, terrain: "sand", traversable:true},
        {x: 8, y: 19, terrain: "sand", traversable:true},
        {x: 9, y: 19, terrain: "dirt", traversable:true},
        {x: 10, y: 19, terrain: "dirt", traversable:true},
        {x: 11, y: 19, terrain: "dirt", traversable:true},
        {x: 12, y: 19, terrain: "dirt", traversable:true},
        {x: 13, y: 19, terrain: "sand", traversable:true},
        {x: 14, y: 19, terrain: "sand", traversable:true},
        {x: 15, y: 19, terrain: "dirt", traversable:true},
        {x: 16, y: 19, terrain: "sand", traversable:true},
        {x: 17, y: 19, terrain: "sand", traversable:true},
        {x: 18, y: 19, terrain: "dirt", traversable:true},
        {x: 19, y: 19, terrain: "dirt", traversable:true},
        {x: 20, y: 19, terrain: "dirt", traversable:true},
        {x: 21, y: 19, terrain: "dirt", traversable:true},
        {x: 22, y: 19, terrain: "dirt", traversable:true},
        {x: 23, y: 19, terrain: "sand", traversable:true},
        {x: 24, y: 19, terrain: "sand", traversable:true},
        {x: 25, y: 19, terrain: "sand", traversable:true},
        {x: 26, y: 19, terrain: "dirt", traversable:true},
        {x: 27, y: 19, terrain: "dirt", traversable:true},
        {x: 28, y: 19, terrain: "dirt", traversable:true},
        {x: 29, y: 19, terrain: "dirt", traversable:true},
        {x: 30, y: 19, terrain: "sand", traversable:true},
        {x: 31, y: 19, terrain: "dirt", traversable:true},
        {x: 32, y: 19, terrain: "dirt", traversable:true},
        {x: 33, y: 19, terrain: "sand", traversable:true},
        {x: 34, y: 19, terrain: "sand", traversable:true},
        {x: 35, y: 19, terrain: "sand", traversable:true},
        {x: 36, y: 19, terrain: "dirt", traversable:true},
        {x: 37, y: 19, terrain: "dirt", traversable:true},
        {x: 38, y: 19, terrain: "dirt", traversable:true},
        {x: 39, y: 19, terrain: "dirt", traversable:true},
        {x: 40, y: 19, terrain: "sand", traversable:true},

        
        
        
        
        
        
        
    ];

    // bounds = {
    //     min: {x: 8, y:0},
    //     max: {x: 15, y:7}
    // };
    updateMap(cells, bounds);    
    drawPerson(jim);

    // Bind Document Events
    $("body").on("keydown", function(e){
        var moved = false;

        // Map arrows to events
        if(e.keyCode === 38){
            jim.trigger("moveUp");            
            moved = true;
            e.preventDefault();
        } else if (e.keyCode === 37){
            jim.trigger("moveLeft");            
            moved = true;
            e.preventDefault();
        } else if (e.keyCode === 39){
            jim.trigger("moveRight");            
            moved = true;
            e.preventDefault();
        } else if (e.keyCode === 40){
            jim.trigger("moveDown");            
            moved = true;
            e.preventDefault();
        } else if (e.keyCode === 32){

        } else {
            // nothing
            //console.log(e.keyCode);
        }

        if(moved){
            
            drawMap(bounds);
            updateMap(cells, bounds);
            drawPerson(jim);    
        }
        
        
    });
    
    
    function drawMap(bounds){
        var cell;
                
        var cols = (bounds.max.x - bounds.min.x +1);
        var rows = (bounds.max.y - bounds.min.y +1)
        var width = cols * (cellBounds.max.x +1);

        console.log(cols);
        console.log(rows);

        $(".content").width(width);        
        $(".content div").remove();

        var defaultCell = {terrain: "water", x:1, y:1}
        
        for(var i=0; i<rows; i++){
            for(var j=0; j<cols; j++){
                defaultCell.x = bounds.min.x + j;
                defaultCell.y = bounds.min.y + i;
                drawTerrain(defaultCell);
            }    
        }
    }

    function updateMap(cells, bounds){
        var cell;
        
        for(var i=0; i<cells.length; i++){

            cell = cells[i];

            if(inBoundary(cell)){

                updateTerrain(cell);    
            } 
        }
    }
    function drawPerson(person){

        var child = coordToIndex(person.x, person.y);
        var selector = '.content div:nth-child(' + child + ')';
        var el = document.querySelector(selector);

        if(el){
            personEl.style.width =  el.offsetWidth  + "px";
            personEl.style.left =  el.offsetLeft + el.offsetWidth / 2 + "px";
            personEl.style.top = el.offsetTop + "px";
        }
        else {
            console.log("el not found for: ", child)
            
        }

        

        $(personEl).removeClass("top right bottom left")        
        if(person.facing == Direction.right){
            $(personEl).addClass("right");            
        } else if (person.facing == Direction.bottom){
            $(personEl).addClass("bottom");
        } else if (person.facing == Direction.left){
            $(personEl).addClass("left");
        } else if (person.facing == Direction.top){
            $(personEl).addClass("top");
        } else {
            // Nothing
        } 

    }

    function drawTerrain(cell){


        var el = $("<div>", {class: cell.terrain, html:cell.x +":" + cell.y});
        // el.className = cell.terrain;
        // el.append(cell.x)

        $(".content").append(el);

        //el.className = cell.terrain;

    }

    function updateTerrain(cell){

        var child = coordToIndex(cell.x, cell.y);
        var selector = '.content div:nth-child(' + child + ')';
        var el = document.querySelector(selector);
        var color = "black";

        //var el = $("<div>", {class: cell.terrain, html:cell.x +":" + cell.y});
        // el.className = cell.terrain;
        // el.append(cell.x)

        //$(".content").append(el);

        el.className = cell.terrain;

    }

    function inBoundary(target){

        if(target.x < bounds.min.x){
            return false;
        }

        if(target.x > bounds.max.x){
            return false;
        }

        if(target.y < bounds.min.y){
            return false;
        }

        if(target.y > bounds.max.y){
            return false;
        }

        return true;

    }

    function inWorld(target){

        if(target.x < worldBounds.min.x){
            return false;
        }

        if(target.x > worldBounds.max.x){
            return false;
        }

        if(target.y < worldBounds.min.y){
            return false;
        }

        if(target.y > worldBounds.max.y){
            return false;
        }

        return true;

    }

    function coordToIndex(x, y){

        // Convert a coordinate to an index 1- (bounds.max.x+1) * (bounds.max.y+1)
        var idx = ((bounds.max.x - bounds.min.x + 1) * (y - bounds.min.y)) + (x - bounds.min.x) + 1;
        return idx
    }

    function getBounds(cell){
        // Load the bounds this cell is in

        var minX = Math.floor(cell.x / defaultBounds.getWidth()) * defaultBounds.getWidth();
        var minY = Math.floor(cell.y / defaultBounds.getHeight()) * defaultBounds.getHeight();
        var maxX = minX + defaultBounds.getWidth() -1;
        var maxY = minY + defaultBounds.getHeight() -1;

        var bounds = {
            min: {x: minX, y:minY},
            max: {x: maxX, y: maxY}
        };

        console.dir(cell)
        console.dir(bounds)
        return bounds;
    }

    function getCell(point) {

        var cell = cells.find(function(el){
            return el.x == point.x && el.y == point.y;
        })

        return cell;
    }

    if (!Array.prototype.find) {
      Array.prototype.find = function(predicate) {
        if (this == null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
        return undefined;
      };
    }

})();