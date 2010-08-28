var Map = module.exports = function Map(seed) {

    this.seed = seed;
    this.data = {};
    this.destroyed = false;
}

Map.prototype.toString = function() {
    if(this.destroyed === false) {
        return JSON.stringify({type: 'map', dataType: 'seed', data: this.seed});  
    } else {
        return JSON.stringify({type: 'map', dataType: 'coord', data: this.data})
    }
}
