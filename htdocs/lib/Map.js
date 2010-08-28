var Map = function Map(sel) {
    this.size  = {x: 720, y: 400};
    this.paper = Raphael(sel, this.size.x, this.size.y);
    this.paper.rect(0, 0, this.size.x, this.size.y);
    
    this.points = [];
    var r0 = Math.random() * 180;
    var r1 = Math.random() * 1 - 0.5;
    for(i=0;i<this.size.x;i++) {
        this.points[i] = {
                          x: i
                        , y:  (this.size.y - Math.sin((i+90) * Math.PI / 180)*50)-100
                            + Math.sin((i+r0)*10 * Math.PI / 180)*2
                            + Math.sin((i+180-r0)*r1 * Math.PI / 180)*30
                        };
    }
    this.draw();
}

Map.prototype.draw = function() {
    var path = 'M' + this.points[0].x + ' ' + this.points[0].y; 
    for(i=1;i<this.points.length;i++) {
       path += 'L' + this.points[i].x + ' ' + this.points[i].y; 
    }
    path += 'L' + this.size.x + ' ' +this.size.y;
    path += 'L0 ' +this.size.y + 'z';
    this.paper.path(path).attr({'fill': 'green', 'stroke': 'green'});
    console.log(path);
}
