import * as utils from './utils.js';

class Bubble{
    constructor(_x, _y){
        this.x = _x;
        this.y = _y;
        this.velocity = 9;
        this.radius = 2.5;
    }

    Draw(ctx,fillColor){
        //let color = `rgba(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]}, 100)`;
        let color = fillColor;
        utils.drawCircle(ctx, this.x, this.y, this.radius, color);
        this.y -= this.velocity;
        this.alpha -= this.transparencyRate;
    }
}

export{Bubble};