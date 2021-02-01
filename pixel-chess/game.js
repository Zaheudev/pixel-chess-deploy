function Game(chess, wsWhite, id){
    this.id = id;
    this.chess = chess;
    this.wsWhite = wsWhite;
    this.wsBlack = null;
    this.gameState = "Waiting";
    
    this.getWsWhite = function() {
      return this.wsWhite;
    }

    this.setWsWhite = function(wsWhite){
      this.wsWhite = wsWhite;
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

    /*possible states
    "Waiting"
      "Aborted"
    "Started"
    "White"
    "Black"
    */
    this.setState = function(state) {
      this.gameState = state;
    }

    this.getState = function(){
      return this.gameState;
    }
  }

  module.exports = Game;