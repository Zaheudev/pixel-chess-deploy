function Status() {
    this.since = Date.now();
    this.gamesStarted = 0;
    this.gamesAborted = 0;
    this.gamesCompleted = 0;

    this.getSince = function(){
        return this.since;
    }

    this.getStarted = function(){
        return this.gamesStarted;
    }

    this.getAborted = function(){
        return this.gamesAborted;
    }

    this.getCompleted = function() {
        return this.gamesCompleted;
    }

    this.incStarted = function() {
        this.gamesStarted++;
    }

    this.incAborted = function() {
        this.gamesAborted++;
    }

    this.incCompleted = function() {
        this.gamesCompleted++;
    }
}
module.exports = Status;