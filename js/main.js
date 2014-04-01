// Definition of Views, Models and Collections

var GameView = Backbone.View.extend({
  el : '#game',

  events : {
    'keyup'  : 'handleKeyPress'
  },

  handleKeyPress : function(e){
    e.preventDefault();
    if(e.which == '38'){
      console.log("UP");
      grid.moveUp();
    }
    else if (e.which == '40')
      console.log('DOWN');
    else if (e.which == '39')
      console.log('RIGHT');
    else if (e.which == '37')
      console.log('LEFT');
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
     return size - tile.get('x');
    }).
    sortBy(function(tile){
      return size - tile.get('y');
    }).
    each(function(tile){

      var furthestTile = self.chain().filter(function(othertile){
        return (othertile.get('x') == tile.get('x')) && (othertile.get('y') < tile.get('y') )
      });

      if (furthestTile.value() == [] ){
        tile.set('y',1);
        console.log("ca existe")
      }
      else{
        var min = furthestTile.min(function(tile){
          return tile.get('y');
        }).value();
         console.log(min);


      }

    });


    /*each(function(tile){
      var y = self.chain().
                    filter(function(othertile){
                      return (( othertile.get('x') == tile.get('x') ) && ( othertile.get('y') <= tile.get('y') ));
                    }).
                    min(function(othertile){
                      return ( othertile.get('y'));
                    }).
                    value().
                    get('y');
      tile.set('y',y);*/

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

grid.add( [new Tile({x : 1}), new Tile({x : 1, y : 2}), new Tile({x : 3})] ) ;

