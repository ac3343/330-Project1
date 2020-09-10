(function(){
    console.log("loaded");

    let abcLIB = {
        getRandomColor(){
            //function getByte(){
            //    return 55 + Math.round(Math.random() * 200);
            //}
            const getByte = _ => 55 + Math.round(Math.random() * 200);
            return `rgba(${getByte()},${getByte()},${getByte()},.8)`;
            },
        
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        drawRectangle(ctx, x,y,width,height,fillStyle="black",lineWidth=0,strokeStyle="black"){
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
        }
    };

    if(window){
        window["abcLib"] = abcLIB;
    }
    else{
        throw "'window' is not defined!";
    }
})();

