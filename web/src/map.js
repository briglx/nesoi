module.exports = function Map($){
    
    this.cells = [];

    this.cellBounds = {
        min: {x: 0, y:0},
        max: {x: 63, y:63}
    };

    this.worldBounds = {
        min: {x: 0, y:-16},
        max: {x: 40, y:20}
    };

    this.defaultBounds = {
        min: {x: 0, y:0},
        max: {x: 15, y:10},
        getWidth: function(){return this.max.x - this.min.x + 1},
        getHeight: function(){return this.max.y - this.min.y + 1}
    };

    this.bounds = this.defaultBounds;

    this.getCell = function(point) {

        var cell = this.cells.find(function(el){
            return el.x == point.x && el.y == point.y;
        })

        return cell;
    };

    this.inBoundary = function (target){

        if(target.x < this.bounds.min.x){
            return false;
        }

        if(target.x > this.bounds.max.x){
            return false;
        }

        if(target.y < this.bounds.min.y){
            return false;
        }

        if(target.y > this.bounds.max.y){
            return false;
        }

        return true;

    }

    this.getBounds = function(cell){
        // Load the bounds this cell is in

        var minX = Math.floor(cell.x / this.defaultBounds.getWidth()) * this.defaultBounds.getWidth();
        var minY = Math.floor(cell.y / this.defaultBounds.getHeight()) * this.defaultBounds.getHeight();
        var maxX = minX + this.defaultBounds.getWidth() -1;
        var maxY = minY + this.defaultBounds.getHeight() -1;

        this.bounds.min.x = minX;
        this.bounds.min.y = minY;
        this.bounds.max.x = maxX;
        this.bounds.max.y = maxY;

        return this.bounds;
    }

    this.drawMap = function(bounds){
                
        var cols = (bounds.max.x - bounds.min.x +1);
        var rows = (bounds.max.y - bounds.min.y +1)
        var width = cols * (this.cellBounds.max.x +1);
        var defaultCell = {terrain: "unknown", x:1, y:1}

        $(".content").width(width);        
        $(".content div").remove();      
        
        for(var i=0; i<rows; i++){
            for(var j=0; j<cols; j++){
                defaultCell.x = bounds.min.x + j;
                defaultCell.y = bounds.min.y + i;
                this.drawDefaultCell(defaultCell);
            }    
        }
    }

    this.updateMap = function(cells, bounds){
        
        var cell;
        
        for(var i=0; i<cells.length; i++){

            cell = cells[i];

            if(this.inBoundary(cell)){
                this.updateTerrain(cell);    
            } 
        }
    }

    this.drawDefaultCell = function(cell){

        var el = $("<div>", {class: cell.terrain, html:cell.x +":" + cell.y});
        $(".content").append(el);

    }

    this.updateTerrain = function(cell){

        var child = this.coordToIndex(cell.x, cell.y);
        var selector = '.content div:nth-child(' + child + ')';
        var el = document.querySelector(selector);
        
        el.className = cell.terrain;

    }

    this.coordToIndex = function(x, y){

        // Convert a coordinate to an index 1- (bounds.max.x+1) * (bounds.max.y+1)
        var idx = ((this.bounds.max.x - this.bounds.min.x + 1) * (y - this.bounds.min.y)) + (x - this.bounds.min.x) + 1;
        return idx;
    }
}