// Definition of Views, Models and Collections

var GameView = Backbone.View.extend({
  el : '#game',

  events : {
    'keyup'  : 'handleKeyPress'
  },

  handleKeyPress : function(e){
    e.preventDefault();
    if(e.which == '38'){
      grid.moveUp();
    }
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


  moveUp : function(){
    var self = this;

    // Sort Tiles

    this.chain().
    sortBy(function(tile){
     return tile.get('x');
    }).
    sortBy(function(tile){
      return tile.get('y');
    }).
    each(function(tile){

      var furthestTile = self.chain().filter(function(othertile){
        return (othertile.get('x') == tile.get('x')) && (othertile.get('y') < tile.get('y') )
      });

      if (furthestTile.value().length == 0 ){
        tile.set('y',1);
        console.log("ca existe")
      }
      else{
        var max = furthestTile.max(function(tile){
          return tile.get('y');
        }).value().get('y');
         tile.set('y',max + 1);

      }

    });

  },

  moveDown : function(){
    var self = this;

    // Sort Tiles

    this.chain().
    sortBy(function(tile){
     return tile.get('x');
    }).
    sortBy(function(tile){
      return size - tile.get('y');
    }).
    each(function(tile){

      var furthestTile = self.chain().filter(function(othertile){
        return (othertile.get('x') == tile.get('x')) && (othertile.get('y') > tile.get('y') )
      });

      if (furthestTile.value().length == 0 ){
        tile.set('y',4);
      }
      else{
        var min = furthestTile.min(function(tile){
          return tile.get('y');
        }).value().get('y');
         tile.set('y',min - 1);

      }

    });

  },

  moveRight : function(){
    var self = this;

    // Sort Tiles

    this.chain(). // Descending order for x
    sortBy(function(tile){
     return size - tile.get('x');
    }).
    sortBy(function(tile){
      return tile.get('y');
    }).
    each(function(tile){

      var furthestTile = self.chain().filter(function(othertile){
        return (othertile.get('y') == tile.get('y')) && (othertile.get('x') > tile.get('x') )
      });

      if (furthestTile.value().length == 0 ){
        tile.set('x',4);
      }
      else{
        var min = furthestTile.min(function(tile){
          return tile.get('x');
        }).value().get('x');
         tile.set('x',min - 1);

      }

    });

  },

  moveLeft : function(){
    var self = this;

    // Sort Tiles

    this.chain(). // Descending order for x
    sortBy(function(tile){
     return tile.get('x');
    }).
    sortBy(function(tile){
      return tile.get('y');
    }).
    each(function(tile){

      var furthestTile = self.chain().filter(function(othertile){
        return (othertile.get('y') == tile.get('y')) && (othertile.get('x') < tile.get('x') )
      });

      if (furthestTile.value().length == 0 ){
        tile.set('x',1);
      }
      else{
        var min = furthestTile.min(function(tile){
          return tile.get('x');
        }).value().get('x');
         tile.set('x',min + 1);

      }

    });

  }
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
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

});


// Scaffolding

var size = 4;

var game = new GameView();
var grid = new Grid();
var test = new Tile();

var viewgrid = new ViewGrid();

grid.add( [new Tile({x : 1}), new Tile({x : 1, y : 2, value : 4}), new Tile({x : 2, y : 2, value : 8}), new Tile({x : 1, y : 1, value : 8})] ) ;

