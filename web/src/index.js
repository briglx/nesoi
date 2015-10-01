"use strict";

(function() {

    var $ = require('jquery');
    var Backbone = require('backbone');
    var _ = require('underscore');
    var Map = require('./map');

    Backbone.$ = $;

    var apiBaseUrl = "http://localhost:8080/api/";

    var map = new Map($);
 
    var miniMapBounds = {
        scale: 4,
        min: {x: 0, y:0},
        max: {x: 0, y:0},
        getWidth: function(){return this.max.x - this.min.x + 1},
        getHeight: function(){return this.max.y - this.min.y + 1}
    }

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
   
    var Person = require('./person');
    var world = new World();
    var jim = new Person({direction: Direction, map: map, world:world})
    

    function ready(){

        createPlayer();
        createWorld();

        map.drawMap(map.bounds);
        drawMiniMap();

        $.get(getUrl(map.defaultBounds.min))
        .done(function(data){
           
            map.cells = data.terrain;

            if(map.cells){
                map.updateMap(map.cells, map.bounds);    
                drawPerson(jim);    
            }

            getPrecachedCells(map.defaultBounds);
            
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

            map.drawMap(e.bounds);
            map.updateMap(map.cells, e.bounds);    
            drawPerson(jim); 

            $.get(getUrl(e.bounds.min))
            .done(function(data){
                
                var cs = data.terrain;

                // reset
                if(cs){
                    map.cells = [];
                    map.cells = map.cells.concat(cs); 

                    if(e.refresh){                        
                        map.updateMap(map.cells, e.bounds);                                    
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

            var updatePoint = indexToCoord($(this).index()+1, map.bounds);
            var updateCell = map.getCell(updatePoint);

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
            min: {x: bounds.min.x, y: bounds.min.y - map.defaultBounds.getHeight()},
            max: {x: bounds.max.x, y: bounds.max.y - map.defaultBounds.getHeight()}
        }
        $.get(getUrl(topBounds.min), function(data){
            var cs = data.terrain;
            if(cs){
                map.cells = map.cells.concat(cs);
            }
        })
        var rightBounds = {
            min: {x: bounds.min.x + map.defaultBounds.getWidth(), y: bounds.min.y},
            max: {x: bounds.max.x + map.defaultBounds.getWidth(), y: bounds.max.y}
        }
        $.get(getUrl(rightBounds.min), function(data){
            var cs = data.terrain;
            if(cs){
                map.cells = map.cells.concat(cs);
            }
        })
        var bottomBounds = {
            min: {x: bounds.min.x, y: bounds.min.y + map.defaultBounds.getHeight()},
            max: {x: bounds.max.x, y: bounds.max.y + map.defaultBounds.getHeight()}
        }
        $.get(getUrl(bottomBounds.min), function(data){
            var cs = data.terrain;
            if(cs){
                map.cells = map.cells.concat(cs);
            }
        })
        var leftBounds = {
            min: {x: bounds.min.x - map.defaultBounds.getWidth(), y: bounds.min.y},
            max: {x: bounds.max.x - map.defaultBounds.getWidth(), y: bounds.max.y}
        }
        $.get(getUrl(leftBounds.min), function(data){
            var cs = data.terrain;
            if(cs){
                map.cells = map.cells.concat(cs);
            }
        })
    }
    
    function resetGame(person){
        map.bounds = map.defaultBounds;
        person.x = startingPoint.x;
        person.y = startingPoint.y;
    }

    function drawMiniMap(){

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
        // Used for minimap

        var defaultColor = "black";

        if(terrain.toLowerCase().indexOf("water") >= 0){
            defaultColor = "#0000FF";
        } else if(terrain.toLowerCase().indexOf("green") >= 0){
            defaultColor = "#138E01";
        } else if(terrain.toLowerCase().indexOf("red") >= 0){
            defaultColor = "#B02503";
        } else if(terrain.toLowerCase().indexOf("grey") >= 0){
            defaultColor = "#666666";
        } else if(terrain.toLowerCase().indexOf("white") >= 0){
            defaultColor = "#ffffff";
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
    
    function drawPerson(person){

        console.log(person.x + "." + person.partialX + ":" + person.y + "." + person.partialY );

        var child = map.coordToIndex(person.x, person.y);
        var selector = '.content div:nth-child(' + child + ')';
        var el = document.querySelector(selector);

        if(el){
            personEl.style.width =  el.offsetWidth  + "px";
            personEl.style.left =  el.offsetLeft + person.partialX * 16 + "px";
            personEl.style.top = el.offsetTop + person.partialY * 16 + "px";
        }
        else {
            console.log("el not found for: ", child)    
        }

        if(person.partialY % 2 == 0) {
            $(personEl).toggleClass("two");   
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

    

    

    function isTerrainTraversable(terrain){

        var isTraversable = false;

        if(terrain == "cave"){
            isTraversable = true;
        } else if(terrain.indexOf("dirt") >= 0){
            isTraversable = true;
        } else if(terrain == "grass"){
            isTraversable = true;
        } else if(terrain.indexOf("sand") >= 0){
            isTraversable = true;
        } else if(terrain.indexOf("Outside") >= 0){
            isTraversable = true;
        } else if(terrain.indexOf("bridge") >= 0){
            isTraversable = true;
        } else if(terrain.indexOf("stairs") >= 0){
            isTraversable = true;
        } else if(terrain.indexOf("ladder") >= 0){
            isTraversable = true;
        }    

        return isTraversable;
    }

    

    function inWorld(target){

        if(target.x < map.worldBounds.min.x){
            return false;
        }

        if(target.x > map.worldBounds.max.x){
            return false;
        }

        if(target.y < map.worldBounds.min.y){
            return false;
        }

        if(target.y > map.worldBounds.max.y){
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

    function indexToCoord(idx, bounds){

        var point = {x:0, y:0};
        
        var y = bounds.min.y + Math.floor((idx -1) / bounds.getWidth());

        var length = bounds.min.y

        var distanceFromMinY = y - bounds.min.y;
        
        point.x = bounds.min.x + (idx - 1) - bounds.getWidth() * distanceFromMinY;
        point.y = y;

        return point
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