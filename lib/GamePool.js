var GamePool = module.exports = {
    games: {}, 
    get: function(key) {
        if(this.exists(key)) {
            return this.games[key];
        } else {
            return;
        }
    }, 

    exists: function(key) {
        return this.games[key] !== undefined;
    }, 
    
    store: function(key, game) {
        this.games[key] = game;
    },    

    remove: function(key) {
        delete this.games[key];
    }
}
