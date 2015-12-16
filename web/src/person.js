 "use strict";

 module.exports = function Person(config){

    var startingPoint = {
        x: 7,
        y: 5,
        partialX: 0,
        partialY: 0
    }

    var direction = config.direction;
    var map = config.map;
    var world = config.world;
        
    this.facing = direction.bottom;
    this.x = startingPoint.x;
    this.y = startingPoint.y;
    this.partialX = startingPoint.partialX;
    this.partialY = startingPoint.partialY;

    this.moveUp = function(){

        this.move(direction.top, 0, -1)

    };
    this.moveDown = function(){

        this.move(direction.bottom, 0, 1)

    };
    this.moveLeft = function(){

        this.move(direction.left, -1, 0)

    };
    this.moveRight = function(){

        this.move(direction.right, 1, 0)

    };

    this.moveToTarget = function(target){
        
        //var targetCell = getCell(target);
        bounds = map.getBounds(target);

        this.x = target.x;       
        this.y = target.y;       

        this.world.trigger("changeBounds", {bounds:bounds, refresh:true}); 
           
    };

    this.move = function(direction, delX, delY){

        if(this.facing != direction){
            this.facing = direction;
        } else {

            // Check for partial move
            if(!this.isPartialMove(direction)){    

                //Reset
                if(direction == direction.left){
                    this.partialX = 3;
                }
                if(direction == direction.right){
                    this.partialX = 0;    
                }
                if(direction == direction.top){
                    this.partialY = 3;
                }
                if(direction == direction.bottom){
                   this.partialY = 0;    
                }
                
                var target = {x: this.x + delX, y:this.y + delY};
                var targetCell = map.getCell(target);

                if(map.inBoundary(target)){                    

                    if(targetCell && targetCell.traversable){
                        if(targetCell.terrain == "quicksand"){
                            alert("You Died");
                            resetGame(this);
                        }
                        else
                        {
                            this.x = target.x;       
                            this.y = target.y;  

                            if(this.x == 4 && this.y == 1){
                                console.log("warp");
                                target = {x: 7, y:21};
                                
                                this.x = target.x;       
                                this.y = target.y; 
                                map.bounds = map.getBounds(target);
                                world.trigger("changeBounds", {bounds:map.bounds, refresh:false});      
                            }else if(this.x == 7 && this.y == 22){
                                console.log("warp");
                                target = {x: 4, y:1};
                                
                                this.x = target.x;       
                                this.y = target.y; 
                                map.bounds = map.getBounds(target);
                                world.trigger("changeBounds", {bounds:map.bounds, refresh:false});      
                            }
                            
                        }                        
                    }                
                } 
                else {

                    if(targetCell == undefined || targetCell.traversable){

                        map.bounds = map.getBounds(target);
                        if(delX > 0){
                            this.x = map.bounds.min.x;
                        }
                        if(delX < 0){
                            this.x = map.bounds.max.x;
                        }
                        if(delY > 0){
                            this.y = map.bounds.min.y;
                        }
                        if(delY < 0){
                            this.y = map.bounds.max.y;
                        }

                        if(this.x == 7 && this.y == 22){
                           
                            console.log("warp");
                            target = {x: 4, y:1};
                            
                            this.x = target.x;       
                            this.y = target.y; 
                            map.bounds = map.getBounds(target);
                            
                        }

                        world.trigger("changeBounds", {bounds:map.bounds, refresh:false}); 
                    }                 
                }

            }
            else {
                console.log("Partial")
            }

            
        }
    }

    this.isPartialMove = function(direction){
        var isPartial = false;

        if(direction == direction.bottom && this.partialY < 3) {
            this.partialY ++;
            isPartial = true;
        }

        if(direction == direction.top && this.partialY > 0) {
            this.partialY --;
            isPartial = true;
        }

        if(direction == direction.left && this.partialX > 0) {
            this.partialX --;
            isPartial = true;
        }

        if(direction == direction.right && this.partialX < 3) {
            this.partialX ++;
            isPartial = true;
        }

        return isPartial;

    }
}


