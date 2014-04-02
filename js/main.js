// Definition of Views, Models and Collections

var GameView = Backbone.View.extend({
  el : '#game',

  events : {
    'keydown'  : 'handleKeyPress'
  },

  handleKeyPress : function(e){
    e.preventDefault();
    
    if(e.which == '38')
      grid.moveUp();
    else if (e.which == '40')
      grid.moveDown();
    else if (e.which == '39')
      grid.moveRight();
    else if (e.which == '37')
      grid.moveLeft();
  }

});

var ViewGrid = Backbone.View.extend({
  el : '#grid',

  initialize : function(){
    this.listenTo(grid,'add',this.addOne);
  },

  addOne : function(tile){
    var view = new TileView({model : tile});
    this.$el.append(view.render().el);
  },

});

var Grid = Backbone.Collection.extend({
  model : Tile,

  cells : [],

  initialize : function(){

    // Init of cells array

    for (var i = 1 ; i <= size ; i++ ){
      for(var j = 1 ; j <= size ; j++){
        this.cells.push({x : i , y : j });
      }
    }
  },

  spawn : function(){
    // Find available cells to spawn a new tile
    var occupiedCells = [];
    this.each(function(tile){
      occupiedCells.push( {x : tile.get('x'), y : tile.get('y')} );
    });
    var availableCells = _.filter(this.cells, function(obj){ return !_.findWhere(occupiedCells, obj); });
    // Pick a random cell from available cells
    if (availableCells.length > 0){
      var coordinates = availableCells[Math.floor(Math.random() * (availableCells.length))];
      this.add( new Tile({ x : coordinates.x , y : coordinates.y }));
      console.log('Remaining cells  :',availableCells.length);
    }
  },

  moveUp : function(){
    var self = this;

    // Sort Tiles in ...

    this.chain().
    sortBy(function(tile){
     return tile.get('x'); // ... Ascending order for x
    }).
    sortBy(function(tile){
      return tile.get('y'); // ... Ascending order for y
    }).
    each(function(tile){

      var neighborTile = self.chain().filter(function(neighbor){
        return (neighbor.get('x') == tile.get('x')) && (neighbor.get('y') < tile.get('y') ) // Tiles in the same column that have a lower y than the current tile
      });

      if (neighborTile.value().length == 0 ){ // There is no neighbor tiles
        tile.set('y',1); // Move the tile to the extremity
      }
      else{ // There are neighbor(s)
        var nearestNeighbor = neighborTile.max(function(tile){ return tile.get('y') }).value();
        if ( nearestNeighbor.get('value') == tile.get('value') ){
           // Here we make the fusion between the two Tiles
          tile.set('y',nearestNeighbor.get('y'));
          nearestNeighbor.set('value',nearestNeighbor.get('value') * 2);
          
          tile.destroy();

          // Then we update the score ...
          score.set('value', score.get('value') + nearestNeighbor.get('value'));
        }
        else {
          tile.set('y',nearestNeighbor.get('y') + 1); // Move the tile as close as possible
        }
      }

    });
    this.spawn();

  },

  moveDown : function(){
    var self = this;

    // Sort Tiles in ...

    this.chain().
    sortBy(function(tile){
     return tile.get('x'); // ... Ascending order for x
    }).
    sortBy(function(tile){
      return size - tile.get('y'); // ... Descending order for y
    }).
    each(function(tile){

      var neighborTile = self.chain().filter(function(neighbor){
        return (neighbor.get('x') == tile.get('x')) && (neighbor.get('y') > tile.get('y') ) // Tiles in the same column that have a higher y than the current tile
      });

      if (neighborTile.value().length == 0 ){ // There is no neighbor tiles
        tile.set('y',size); // Move the tile to the extremity
      }
      else{ // There are neighbor(s)
        var nearestNeighbor = neighborTile.min(function(tile){ return tile.get('y') }).value();
        if ( nearestNeighbor.get('value') == tile.get('value') ){
           // Here we make the fusion between the two Tiles
          tile.set('y',nearestNeighbor.get('y'));
          nearestNeighbor.set('value',nearestNeighbor.get('value') * 2);
          tile.destroy();

          // Then we update the score ...
          score.set('value', score.get('value') + nearestNeighbor.get('value'));
        }
        else {
          tile.set('y',nearestNeighbor.get('y') - 1); // Move the tile as close as possible

        }

      }

    });
    self.spawn();

  },

  moveRight : function(){
    var self = this;

    // Sort Tiles in ...

    this.chain().
    sortBy(function(tile){
     return size - tile.get('x'); // ... Descending order for x
    }).
    sortBy(function(tile){
      return tile.get('y'); // ... Ascending order for y
    }).
    each(function(tile){

      var neighborTile = self.chain().filter(function(neighbor){
        return (neighbor.get('y') == tile.get('y')) && (neighbor.get('x') > tile.get('x') ) // Tiles in the same row that have a higher x than the current tile
      });

      if (neighborTile.value().length == 0 ){ // There is no neighbor tiles
        tile.set('x',size); // Move the tile to the extremity
      }
      else{ // There are neighbor(s)
        var nearestNeighbor = neighborTile.min(function(tile){ return tile.get('x') }).value();
        if ( nearestNeighbor.get('value') == tile.get('value') ){
           // Here we make the fusion between the two Tiles
          tile.set('x',nearestNeighbor.get('x'));
          nearestNeighbor.set('value',nearestNeighbor.get('value') * 2);
          tile.destroy();

          // Then we update the score ...
          score.set('value', score.get('value') + nearestNeighbor.get('value'));
        }
        else {
          tile.set('x',nearestNeighbor.get('x') - 1); // Move the tile as close as possible
        }

      }

    });
    this.spawn();

  },

  moveLeft : function(){
    var self = this;

    // Sort Tiles in ...

    this.chain().
    sortBy(function(tile){
     return tile.get('x'); // ... Ascending order for x
    }).
    sortBy(function(tile){
      return tile.get('y'); // ... Ascending order for y
    }).
    each(function(tile){

      var neighborTile = self.chain().filter(function(neighbor){
        return (neighbor.get('y') == tile.get('y')) && (neighbor.get('x') < tile.get('x') ) // Select tiles in the same row that have a lower x than the current tile
      });

      if (neighborTile.value().length == 0 ){ // There is no neighbor tiles
        tile.set('x',1); // Move the tile to the extremity
      }
      else{ // There are neighbor(s)
        var nearestNeighbor = neighborTile.max(function(tile){ return tile.get('x') }).value();
        if ( nearestNeighbor.get('value') == tile.get('value') ){
           // Here we make the fusion between the two Tiles
          tile.set('x',nearestNeighbor.get('x'));
          nearestNeighbor.set('value',nearestNeighbor.get('value') * 2);
          tile.destroy();

          // Then we update the score ...
          score.set('value', score.get('value') + nearestNeighbor.get('value'));
        }
        else {
          tile.set('x',nearestNeighbor.get('x') + 1); // Move the tile as close as possible
        }

      }

    });
    this.spawn();

  },

});

var Tile = Backbone.Model.extend({

  defaults : {
    "value" : 2,
    "x" : 1,
    "y" : 4
  }

});

var TileView = Backbone.View.extend({

  initialize : function(){
      this.listenTo(this.model,"change", this.render);
  },

  template : _.template($('#tile-template').html()),

  initialize: function () {
		this.listenTo(this.model,'change:value',this.render);
    this.listenTo(this.model, 'change', this.moveTile);
		this.listenTo(this.model, 'destroy', this.remove);
	},

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

  moveTile : function(){
    this.$el.children().removeClass().addClass('tile tile-'+this.model.get('value')+' tile-position-'+this.model.get('x')+'-'+this.model.get('y')+' tile-new');
    this.$el.find('.tile-inner').text(this.model.get('value'));
  }

});

var Score = Backbone.Model.extend({
  defaults : {
    "value": 0,
    "best" : 0
  }

});

var ScoreView = Backbone.View.extend({
  el:'#score',

  template: _.template($('#score-template').html()),

  initialize : function(){
    this.listenTo(this.model,'change',this.render);
    this.render();
  },

  render : function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }

});

// Setup

var size = 4; // Size of the grid
var score = new Score(); // New score model 
var scoreview = new ScoreView({model : score});
var game = new GameView();
var grid = new Grid();
var viewgrid = new ViewGrid();

// Setup initial blocks

grid.add( [new Tile({x : 1}), new Tile({x : 1, y : 2, value : 4}), new Tile({x : 2, y : 2, value : 8}), new Tile({x : 1, y : 1, value : 4})] ) ;
