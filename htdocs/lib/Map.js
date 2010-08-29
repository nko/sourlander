var Map = function Map(sel, seed) {
    $('#' + sel).html('');
    this.size  = {x: 720, y: 400};
    this.paper = Raphael(sel, this.size.x, this.size.y);
    this.paper.rect(0, 0, this.size.x, this.size.y).attr('fill', '#AAF');
    this.points = [];
    this.seed = seed;
    var res = 5;


    for(i=0;i<=this.size.x/res;i++) {
        var j = i * res;
        this.points[i] = {
                          x: j
                        , y: this.getY(j)
                        };
    }
    this.draw();
}
 
Map.prototype.getY = function(x) {
    var seed = this.seed;
        return parseInt( this.size.y - (Math.sin((x+90) * Math.PI / 180)*(-seed[2])+100 + Math.sin((x+seed[0])*10 * Math.PI / 180)*2 + Math.sin((x+seed[0]+45)*seed[1] * Math.PI / 180)*1));

    }

Map.prototype.draw = function() {
    var path = 'M' + this.points[0].x + ' ' + this.points[0].y; 
    for(i=1;i<this.points.length;i++) {
       path += 'L' + this.points[i].x + ' ' + this.points[i].y; 
    }
    path += 'L' + this.size.x + ' ' +this.size.y;
    path += 'L0 ' +this.size.y + 'z';
    this.paper.path(path).attr({'fill': 'green', 'stroke': 'green'});
    this.drawCannon(250)
}

Map.prototype.drawCannon = function(x, y) {
    new Cannon(this, x);
}

