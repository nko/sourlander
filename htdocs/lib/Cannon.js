
var Cannon = function(map, x) {
    this.map = map;
    this.pos = { x: 0, 
                 y: 0 };
    this.can = { x: 0, y: 0 };
    this.r  = 20;
    this.ba = 0;
    this.ca = 0;
    this.turn_p = {};

    var y  = this.pos.y; 
    var py = map.getY(x-1);
    var ny = map.getY(x+1);
    var angl = Raphael.angle(x+1, ny, x-1, py);
    var can = map.paper.path('m -42,15 c 0,0 34,-13 56,-3 46,21 41,-12 41,-12 0,0 -1,-30 -39,-16 -26,9 -58,-9 -58,-9 l 0,40 z');
    var foot = map.paper.path('m 25,15 0,0 c 0,0 0,-60 -25,-60 -25,0 -25,60 -25,60 z'); 
    can.attr('fill', '#222').scale(0.5, 0.5);
    foot.attr('fill', '#aa4400').scale(0.5, 0.5);

    can.attr('cx', 400);

    this.ba    = angl;
    this.foot  = foot;
    this.tube  = can; 

    this.update(300);

    var can = this;

    function bindMovement() {
        var intv = {};
        $(document).keyup(function(ev) {
            switch(ev.which) {
                case 37:
                    window.clearInterval(intv.left);
                    delete intv.left;
                    break;
                case 38:
                    window.clearInterval(intv.top);
                    delete intv.top;
                    break;
                case 39:
                    window.clearInterval(intv.right);
                    delete intv.right;
                    break;
                case 40:
                    window.clearInterval(intv.down);
                    delete intv.down;
                    break;
            }
        });

        $(document).keydown(function(ev) {
            switch(ev.which) {
                case 37:
                    if(intv.left == undefined) {
                        intv.left = setInterval(function() {
                            can.move(-2);
                        }, 100);
                    }
                    event.preventDefault();
                    break;

                case 38:
                    if(intv.top == undefined) {
                        intv.top = setInterval(function() {
                            can.turn(2);
                        }, 100);
                    }
                    event.preventDefault();
                    break;
                case 39:
                    if(intv.right == undefined) {
                        intv.right = setInterval(function() {
                            can.move(2);
                        }, 100);
                    }
                    event.preventDefault();
                    break;
                case 40:
                    if(intv.down == undefined) {
                        intv.down = setInterval(function() {
                            can.turn(-2);
                        }, 100);
                    }
                    event.preventDefault();
                    break
            }
        });
    };
    bindMovement();
}

Cannon.prototype.move = function(diff) {
    var x    = this.pos.x + diff;
    this.update(x);
     /*
        y    = this.map.getY(x), 
        dy   = y - this.y, 
        t    = this;

    var angl = getAngle(x); 

    this.x = x;
    this.y = y;
    this.ba = angl;
    

    this.foot.translate(diff, dy);
    this.foot.attr({rotation: (angl) + ' ' + x +' ' + y});

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

    var tx = x + 20 * Math.sin(this.ca * Math.PI / 180);
    var ty = y - 20 * Math.cos(this.ca * Math.PI / 180);
    this.tube.attr({cx: 100, cy: 200});
*/
}

Cannon.prototype.getAngle = function(x) {
        var py = this.map.getY(x-5); 
        var ny = this.map.getY(x+5); 
        return Raphael.angle(x+5, ny, x-5, py);
    }


Cannon.prototype.update = function(x) {
    
    var ox = this.pos.x;
    var nx = x;
    var oy = this.pos.y;
    var ny = this.map.getY(nx);
    var a = this.getAngle(x);

    this.pos.x = nx;
    this.pos.y = ny;
    this.foot.translate(nx-ox, ny-oy);
    this.foot.attr({rotation: a + ' ' + nx + ' ' + ny});

    var dp = {  x: nx + 20 * Math.sin(a * Math.PI / 180), 
                y: ny - 20 * Math.cos(a * Math.PI / 180) };

    var cp = {  x: dp.x - 20 * Math.sin((this.ca+90) * Math.PI / 180),
                y: dp.y - 20 * Math.cos((this.ca+90) * Math.PI / 180) };
    this.tube.translate(cp.x - this.can.x, cp.y - this.can.y);
    this.tube.attr({rotation: (-this.ca) + ' ' + cp.x + ' ' + cp.y});
    this.can.x = cp.x;
    this.can.y = cp.y;
    this.map.paper.safari();

}

Cannon.prototype.turn = function(ang) {
    this.ca = this.ca - ang;
    this.update(this.pos.x);
}

