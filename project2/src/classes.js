import * as utils from './utils.js';

class Bubble{
    constructor(_x, _y){
        this.x = _x;
        this.y = _y;
        this.velocity = 8;
        this.alpha = 100;
        this.fillColor = [100, 0, 0];
        this.radius = 2;
        this.transparencyRate = 32;
    }

    Draw(ctx){
        let color = `rgba(${this.fillColor[0]}, ${this.fillColor[1]}, ${this.fillColor[2]}, 100)`;
        utils.drawCircle(ctx, this.x, this.y, this.radius, color)
        this.y += this.velocity;
        this.alpha -= this.transparencyRate;
    }

    get visible(){
        return this.alpha > 0 || this.velocity > 0;
    }
}

export{Bubble};