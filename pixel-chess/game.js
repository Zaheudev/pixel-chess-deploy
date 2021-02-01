function Game(chess, wsWhite, id){
    this.id = id;
    this.chess = chess;
    this.wsWhite = wsWhite;
    this.wsBlack = null;
    
    this.getWsWhite = function() {
      return this.wsWhite;
    }
  
    this.setWsBlack = function(wsBlack){
      this.wsBlack = wsBlack;
    }
    
    this.getWsBlack = function() {
      return this.wsBlack;
    }
  
    this.getId = function(){
      return this.id;
    }

    this.getChess = function() {
      return this.chess;
    }
  }

  module.exports = Game;