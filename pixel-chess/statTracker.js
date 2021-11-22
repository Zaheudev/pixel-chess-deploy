function Status(db) {
    // we use "db" argument to update data in corresponding column. We call it in functions who starts with "inc" and "dec".
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
        db.run('update records set value=value+1 where _id=3;');
    }

    this.incAborted = function() {
        this.gamesAborted++;
        db.run('update records set value=value+1 where _id=2;');
    }

    this.incCompleted = function() {
        this.gamesCompleted++;
        db.run('update records set value=value+1 where _id=1;');
    }

    this.decStarted = function(){
        if(this.gamesStarted == 0) return;
        this.gamesStarted--;
        db.run('update records set value=value-1 where _id=3;');
    }

}
module.exports = Status;