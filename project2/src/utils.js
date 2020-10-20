// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax

const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
  };
  
const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};

const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor,255-floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
    let lg = ctx.createLinearGradient(startX,startY,endX,endY);
    for(let stop of colorStops){
        lg.addColorStop(stop.percent,stop.color);
    }
    return lg;
};


const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const drawRectangle = (ctx, x,y,width,height,fillStyle="black",lineWidth=0,strokeStyle="black") => {
    ctx.fillStyle = fillStyle;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x,y,width,height);
    ctx.closePath();
    ctx.fill();
    if(lineWidth >0){
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
    ctx.restore();
};

const dtr = (degrees) => {
    return degrees * (Math.PI/180);
}

const drawCircle = (ctx,x,y,radius,color) =>{
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
const getMouseCoordinates = (e) =>{
    let canvasBounds =  e.target.getBoundingClientRect();
    return {x: e.clientX - canvasBounds.x, y: e.clientY - canvasBounds.y};
}

const roundToMultipleOf = (number,multipleOf=10) =>{
    if(number < multipleOf){
        throw `Number ${number} is smaller than ${multipleOf}.`
    }
    //Divides submitted number by the 
    let divResult = number / multipleOf;
    return multipleOf * Math.round(divResult);
}

const drawLine = (ctx, x, y, length, color) =>{
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y+length);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = abcLib.getRandomInt(2,5);
    ctx.stroke();
    ctx.restore();
}

const getRandomColorWithinRange = (hueMin=0, hueMax=360, satMin=50,satMax=100, lumMin=35,lumMax=70) =>{
    return  `hsl(${abcLib.getRandomInt(hueMin, hueMax)}, ${abcLib.getRandomInt(satMin, satMax)}%, ${abcLib.getRandomInt(lumMin, lumMax)}%)`;
}

export {makeColor, getRandomColor, getLinearGradient, goFullscreen, getRandomInt, drawRectangle, dtr, drawCircle, getMouseCoordinates, roundToMultipleOf, drawLine, getRandomColorWithinRange};