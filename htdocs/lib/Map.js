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
    this.drawCanon(250)
}

Map.prototype.drawCanon = function(x, y) {
    new Canon(this, x);
}

var Canon = function(map, x) {
    this.map = map;
    this.x  = x;
    this.y  = y = map.getY(x);
    this.r  = 20;
    this.ba = 0;
    this.ca = 0;
    this.turn_p = {};

    var py = map.getY(x-1);
    var ny = map.getY(x+1);
    var angl = Raphael.angle(x+1, ny, x-1, py);
    var can = map.paper.path('m ' + (x-62) + ',' + (y-5) + ' c 0,0 34,-13 56,-3 46,21 41,-12 41,-12 0,0 -1,-30 -39,-16 -26,9 -58,-9 -58,-9 l 0,40 z');
    var can_set = map.paper.set();
    can_set.push(can);
    var foot_set = map.paper.set();
    var foot = map.paper.path('m ' + (x+25) + ',' + (y+15) + ' 0,0 c 0,0 0,-60 -25,-60 -25,0 -25,60 -25,60 z'); 
    foot_set.push(foot);
    can.attr('fill', '#222');
    foot.attr('fill', '#aa4400');

    var canon = map.paper.set();
    canon.push(can_set);
    canon.push(foot_set);
    canon.scale(0.5, 0.5);
    canon.attr({rotation: (angl) + ' ' + x +' ' + y});
    this.ba    = angl;
    this.foot  = foot_set;
    this.tube  = can_set; 
    this.canon = canon; 
    this.move(20);

    var can = this;

    function bindMovement() {
        var intv = {};
        $('body').bind('keyup', function(ev) {
            console.log(ev);
            switch(ev.keyCode) {
                case 37:
                    window.clearInterval(intv.left);
                    console.log('up');
                    break;
                case 38:
                    window.clearInterval(intv.top);
                    console.log('up');
                    break;
                case 39:
                    window.clearInterval(intv.right);
                    console.log('up');
                    break;
                case 40:
                    window.clearInterval(intv.down);
                    console.log('up');
                    break;
            }
        });

        $('body').bind('keydown', function(ev) {
            if(ev.keyCode == 37) {
                if(intv.left == undefined) {
                    intv.left = setInterval(function() {
                        can.move(-2);
                    }, 100);
                }
            }
            if(ev.keyCode == 38) {
                if(intv.top == undefined) {
                    intv.top = setInterval(function() {
                        can.turn(2);
                    }, 100);
                }
            }
            if(ev.keyCode == 39) {
                if(intv.right == undefined) {
                    intv.right = setInterval(function() {
                        can.move(2);
                    }, 100);
                }
            }
            if(ev.keyCode == 40) {
                if(intv.down == undefined) {
                    intv.down = setInterval(function() {
                        can.turn(-2);
                    }, 100);
                }
            }
        });
    };
    bindMovement();
}

Canon.prototype.move = function(diff) {
    var x    = this.x + diff, 
        y    = this.map.getY(x), 
        dy   = y - this.y, 
        py   = this.map.getY(x-1), 
        ny   = this.map.getY(x+1), 
        angl = Raphael.angle(x+1, ny, x-1, py);

    this.x = x;
    this.y = y;
    this.ba = angl;
    

    this.canon.translate(diff, dy);
    this.canon.attr({rotation: (angl) + ' ' + x +' ' + y});

    var ang = this.ba;
    if(ang > 180) {
        ang -= 180;
    }
    var dx = x + 20 * Math.sin(this.ba * Math.PI / 180);
    var dy = y - 20 * Math.cos(this.ba * Math.PI / 180);
    this.turnp = {x: dx, y: dy};
    if(this.turnpo) {
        this.turnpo.attr({cx: dx, cy:dy});
    } else {
        this.turnpo = this.map.paper.circle(dx, dy, 2);
    }
}

Canon.prototype.turn = function(ang) {
      var  ang = this.ca + ang,
           dx  = this.turnp.x,
           dy  = this.turnp.y;

      this.ca = ang;

      this.tube.attr({rotation: (ang + this.ba) + ' ' + dx + ' ' + dy});
}


