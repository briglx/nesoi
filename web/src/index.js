"use strict";

(function() {

    var $ = require('jquery');
    var Backbone = require('backbone');
    var _ = require('underscore');
    Backbone.$ = $;

    var apiBaseUrl = "http://localhost:8080/api/";
    var cells = [];
    var cellBounds = {
        min: {x: 0, y:0},
        max: {x: 63, y:63}
    };

    var worldBounds = {
        min: {x: 0, y:-16},
        max: {x: 40, y:20}
    };
    var defaultBounds = {
        min: {x: 0, y:0},
        max: {x: 15, y:10},
        getWidth: function(){return this.max.x - this.min.x + 1},
        getHeight: function(){return this.max.y - this.min.y + 1}
    };
    var miniMapBounds = {
        scale: 2,
        min: {x: 0, y:0},
        max: {x: 0, y:0},
        getWidth: function(){return this.max.x - this.min.x + 1},
        getHeight: function(){return this.max.y - this.min.y + 1}
    }
    var startingPoint = {
        x: 7,
        y: 5
    }

    var bounds = defaultBounds;

    var Direction = {
        top: 12,
        right: 3,
        bottom: 6,
        left: 9
    }

    // Elements
    var personEl = document.querySelector("p");
    
    // Objects
    function World(){};
    function Person(){
        
        this.facing = Direction.right;
        this.x = startingPoint.x;
        this.y = startingPoint.y;

        this.moveUp = function(){

            this.move(Direction.top, 0, -1)

        };
        this.moveDown = function(){

            this.move(Direction.bottom, 0, 1)

        };
        this.moveLeft = function(){

            this.move(Direction.left, -1, 0)

        };
        this.moveRight = function(){

            this.move(Direction.right, 1, 0)

        };

        this.moveToTarget = function(target){
            
            //var targetCell = getCell(target);
            bounds = getBounds(target);

            this.x = target.x;       
            this.y = target.y;       

            world.trigger("changeBounds", {bounds:bounds, refresh:true}); 
               
        };

        this.move = function(direction, delX, delY){

            if(this.facing != direction){
                this.facing = direction;
            } else {

                var target = {x: this.x + delX, y:this.y + delY};
                var targetCell = getCell(target);

                if(inBoundary(target)){                    

                    if(targetCell && targetCell.traversable){
                        if(targetCell.terrain == "quicksand"){
                            alert("You Died");
                            resetGame(this);
                        }
                        else
                        {
                            this.x = target.x;       
                            this.y = target.y;       
                        }                        
                    }                
                } 
                else {

                    if(targetCell == undefined || targetCell.traversable){

                        bounds = getBounds(target);
                        if(delX > 0){
                            this.x = bounds.min.x;
                        }
                        if(delX < 0){
                            this.x = bounds.max.x;
                        }
                        if(delY > 0){
                            this.y = bounds.min.y;
                        }
                        if(delY < 0){
                            this.y = bounds.max.y;
                        }

                        world.trigger("changeBounds", {bounds:bounds, refresh:false}); 
                    }                 
                }
            }
        }
    }


    var jim = new Person();
    var world = new World();
    function ready(){

        createPlayer();
        createWorld();

        drawMap(bounds);
        drawMiniMap();

        $.get(getUrl(defaultBounds.min))
        .done(function(data){
           
            cells = data.terrain;

            if(cells){
                updateMap(cells, bounds);    
                drawPerson(jim);    
            }

            getPrecachedCells(defaultBounds);
            
        })
        .fail(function(xHr, textStatus, e){
            console.log("Failed",e)
        })

    }

    
    function createPlayer(){
        _.extend(jim, Backbone.Events);
        jim.on("moveUp", function(e) {
            this.moveUp(); 
            drawPerson(this);       
        });
        jim.on("moveDown", function(e) {
            this.moveDown();        
            drawPerson(this);
        });
        jim.on("moveLeft", function(e) {
            this.moveLeft(); 
            drawPerson(this);       
        });
        jim.on("moveRight", function(e) {
            this.moveRight();
            drawPerson(this);        
        });
    }
    
    function createWorld(){
        _.extend(world, Backbone.Events);
        world.on("changeBounds", function(e){

            drawMap(e.bounds);
            updateMap(cells, e.bounds);    
            drawPerson(jim); 

            $.get(getUrl(e.bounds.min))
            .done(function(data){
                
                var cs = data.terrain;

                // reset
                if(cs){
                    cells = [];
                    cells = cells.concat(cs); 

                    if(e.refresh){                        
                        updateMap(cells, e.bounds);                                    
                    }
                    
                }
                getPrecachedCells(e.bounds);
                
            });
            

        });

    }
    
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
            
        }       
        
    });

    $(".map").on("click", function(e){
                
        var mapX = Math.floor((e.pageX - $(this).offset().left) / miniMapBounds.scale);
        var mapY = Math.floor((e.pageY - $(this).offset().top) / miniMapBounds.scale);
        
        var cell = convertOrigin({x:mapX, y:mapY}, {x:miniMapBounds.min.x, y:miniMapBounds.min.y}, {x:0, y:0})

        jim.moveToTarget(cell, 0, 0);
    });

    $(".pallet .tab h1").on("click", function(e){

        var tab = $(this).parent(".tab");
        $(".icons", tab).slideToggle("slow");
        $(tab).toggleClass("active");

    });

    var selectedTerrain;
    $(".pallet .icons div").on("click", function(e){
        $(".pallet .icons div").removeClass("selected");

        if(selectedTerrain != $(this).attr("class").replace("selected", "").trim()){
            
            $(this).toggleClass("selected");
            selectedTerrain = $(this).attr("class").replace("selected", "").trim();

            $('.chk').prop('checked', isTerrainTraversable(selectedTerrain));
        } else {
            selectedTerrain = "";
        }
        
        
    });

    $(".content").on("click", "div", function(e){
        if(selectedTerrain){

            $(this).removeClass($(this).attr("class"));
            $(this).addClass(selectedTerrain);

            var updatePoint = indexToCoord($(this).index()+1, bounds);
            var updateCell = getCell(updatePoint);

            if(!updateCell){                
                // Must be part of a new world
                updateCell = {x:updatePoint.x,y:updatePoint.y};
            }
            updateCell.terrain = selectedTerrain;
            updateCell.traversable = $('.chk').prop('checked')==true;

            // Save to DB
            $.post(apiBaseUrl + "terrain/", updateCell)    
            

        }
    });


    function getUrl(point){
        return apiBaseUrl + "terrain?p=" + point.x + "," + point.y;
    }
    
    function getPrecachedCells(bounds){
        var topBounds = {
            min: {x: bounds.min.x, y: bounds.min.y - defaultBounds.getHeight()},
            max: {x: bounds.max.x, y: bounds.max.y - defaultBounds.getHeight()}
        }
        $.get(getUrl(topBounds.min), function(data){
            var cs = data.terrain;
            if(cs){
                cells = cells.concat(cs);
            }
        })
        var rightBounds = {
            min: {x: bounds.min.x + defaultBounds.getWidth(), y: bounds.min.y},
            max: {x: bounds.max.x + defaultBounds.getWidth(), y: bounds.max.y}
        }
        $.get(getUrl(rightBounds.min), function(data){
            var cs = data.terrain;
            if(cs){
                cells = cells.concat(cs);
            }
        })
        var bottomBounds = {
            min: {x: bounds.min.x, y: bounds.min.y + defaultBounds.getHeight()},
            max: {x: bounds.max.x, y: bounds.max.y + defaultBounds.getHeight()}
        }
        $.get(getUrl(bottomBounds.min), function(data){
            var cs = data.terrain;
            if(cs){
                cells = cells.concat(cs);
            }
        })
        var leftBounds = {
            min: {x: bounds.min.x - defaultBounds.getWidth(), y: bounds.min.y},
            max: {x: bounds.max.x - defaultBounds.getWidth(), y: bounds.max.y}
        }
        $.get(getUrl(leftBounds.min), function(data){
            var cs = data.terrain;
            if(cs){
                cells = cells.concat(cs);
            }
        })
    }
    
    function resetGame(person){
        bounds = defaultBounds;
        person.x = startingPoint.x;
        person.y = startingPoint.y;
    }

    function drawMiniMap(){

        // var minX = 0;
        // var maxX = 0;
        // var minY = 0;
        // var maxY = 0;
        // var mapWidth = 0;
        // var mapHeight = 0;

        $.get(apiBaseUrl + "terrain", function(data){
            var cs = data.terrain;

            var c = {};
            for(var i=0;i<cs.length;i++){
                c = cs[i];

                if(c.x < miniMapBounds.min.x){
                    miniMapBounds.min.x = c.x;
                }
                if(c.x > miniMapBounds.max.x){
                    miniMapBounds.max.x = c.x
                }
                if(c.y < miniMapBounds.min.y){
                    miniMapBounds.min.y = c.y;
                }
                if(c.y > miniMapBounds.max.y){
                    miniMapBounds.max.y = c.y
                }
            }
 
            var svgStr = '<svg>'
            var color = "black";
            for(var i=0;i<cs.length;i++){
                c = cs[i];
               
                svgStr = svgStr + '<rect x="' + (c.x - miniMapBounds.min.x) * miniMapBounds.scale + '" y="' + (c.y - miniMapBounds.min.y)*miniMapBounds.scale + '" width="' + miniMapBounds.scale  + '" height="' + miniMapBounds.scale + '" fill="' + getDefaultColor(c.terrain) + '" />"' 
            }
            svgStr = svgStr + '</svg>'
            
            $(".map").append($(svgStr));
            var svg = $(".map svg");
            
            svg.attr("width", miniMapBounds.getWidth()*miniMapBounds.scale);
            svg.attr("height", miniMapBounds.getHeight()*miniMapBounds.scale);
            
        });

    }

    function getDefaultColor(terrain){
        var defaultColor = "black";

        if(terrain.toLowerCase().indexOf("water") >= 0){
            defaultColor = "#0000FF";
        }
        else if(terrain.toLowerCase().indexOf("green") >= 0){
            defaultColor = "#138E01";
        } else if(terrain.toLowerCase().indexOf("red") >= 0){
            defaultColor = "#B02503";
        } else if(terrain.toLowerCase().indexOf("sand") >= 0){
            defaultColor = "#FEB367";
        } else if(terrain.toLowerCase().indexOf("water") >= 0){
            defaultColor = "#0000FF";
        } else if(terrain.toLowerCase().indexOf("dirt") >= 0){
            defaultColor = "#FEB367";
        } else {
            defaultColor = "black";
        }
        
        return defaultColor;
    }
    
    function drawMap(bounds){
                
        var cols = (bounds.max.x - bounds.min.x +1);
        var rows = (bounds.max.y - bounds.min.y +1)
        var width = cols * (cellBounds.max.x +1);
        var defaultCell = {terrain: "water", x:1, y:1}

        $(".content").width(width);        
        $(".content div").remove();      
        
        for(var i=0; i<rows; i++){
            for(var j=0; j<cols; j++){
                defaultCell.x = bounds.min.x + j;
                defaultCell.y = bounds.min.y + i;
                drawDefaultCell(defaultCell);
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
            personEl.style.left =  el.offsetLeft + "px";
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

    function drawDefaultCell(cell){

        var el = $("<div>", {class: cell.terrain, html:cell.x +":" + cell.y});
        $(".content").append(el);

    }

    function updateTerrain(cell){

        var child = coordToIndex(cell.x, cell.y);
        var selector = '.content div:nth-child(' + child + ')';
        var el = document.querySelector(selector);
        
        el.className = cell.terrain;

    }

    function isTerrainTraversable(terrain){

        var isTraversable = false;

        if(terrain == "cave"){
            isTraversable = true;
        } else if(terrain == "dirt"){
            isTraversable = true;
        } else if(terrain == "grass"){
            isTraversable = true;
        } else if(terrain.indexOf("sand") >= 0){
            isTraversable = true;
        } else if(terrain.indexOf("Outside") >= 0){
            isTraversable = true;
        } else if(terrain == "bridge"){
            isTraversable = true;
        } else if(terrain.indexOf("stairs") >= 0){
            isTraversable = true;
        } else if(terrain.indexOf("ladder") >= 0){
            isTraversable = true;
        }    

        return isTraversable;
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

    function convertOrigin(point, oldOrigin, newOrigin){
        // origin is based on X,Y of DB cell coordinates. IE (0,0) is the first map

        var newPoint = {x:0, y:0};

        newPoint.x = (oldOrigin.x + point.x) ;
        newPoint.y = (oldOrigin.y + point.y) ;

        return newPoint;
    }

    function coordToIndex(x, y){

        // Convert a coordinate to an index 1- (bounds.max.x+1) * (bounds.max.y+1)
        var idx = ((bounds.max.x - bounds.min.x + 1) * (y - bounds.min.y)) + (x - bounds.min.x) + 1;
        return idx
    }

    function indexToCoord(idx, bounds){

        var point = {x:0, y:0};
        
        var y = bounds.min.y + Math.floor((idx -1) / bounds.getWidth());

        var length = bounds.min.y

        var distanceFromMinY = y - bounds.min.y;
        
        point.x = bounds.min.x + (idx - 1) - bounds.getWidth() * distanceFromMinY;
        point.y = y;

        return point
    }

    function getBounds(cell){
        // Load the bounds this cell is in

        var minX = Math.floor(cell.x / defaultBounds.getWidth()) * defaultBounds.getWidth();
        var minY = Math.floor(cell.y / defaultBounds.getHeight()) * defaultBounds.getHeight();
        var maxX = minX + defaultBounds.getWidth() -1;
        var maxY = minY + defaultBounds.getHeight() -1;

        bounds.min.x = minX;
        bounds.min.y = minY;
        bounds.max.x = maxX;
        bounds.max.y = maxY;

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

    ready();

})();