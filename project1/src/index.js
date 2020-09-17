"use strict";
        const canvasWidth = 600, canvasHeight = 600;
        let ctx;
        let x=0,y=0;
        let counter  = 0;
        const fps = 12;
        let sinColor = 0;
        let cosColor = 0;

        let splits = [];

        let currentMode = 0;
        let prevMouseCoor;
        let isMouseDown;
        let selectedSplit;

        let buttons;

        window.onload = init;
        function init(){
            ctx = canvas.getContext("2d");

            domEvents();

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            splits.push({x: 5, counter:0});
            drawWave();
            //loop();
        }
        function domEvents(){
            canvas.onmouseup = (e) =>{
                let mouseCoor = abcLib.getMouseCoordinates(e);
                //console.log(`currx=${mouseCoor.x}  prevX=${prevMouseCoor.y} counter: ${splits[0].counter}`);

                if(currentMode == 0){
                    splits.push({x: abcLib.roundToMultipleOf(mouseCoor.x, 5), counter:0});
                }
                if(currentMode == 1){
                    isMouseDown = false;
                    //selectedSplit = null;
                }
                drawWave();
            };
            canvas.onmousedown = (e) =>{
                if(currentMode == 1){
                    isMouseDown = true;
                    let mouseCoor = abcLib.getMouseCoordinates(e);
                    selectSplit(mouseCoor.x);
                    prevMouseCoor = mouseCoor;
                }
            };
            canvas.onmousemove = (e) =>{
                if(isMouseDown){
                    let mouseCoor = abcLib.getMouseCoordinates(e);
                    //console.log(mouseCoor.x);
                    selectedSplit.counter += (prevMouseCoor.x - mouseCoor.x)/33;
                    drawWave();
                    prevMouseCoor = mouseCoor;
                }
            };

            buttons = document.querySelectorAll("button");
            for (const b of buttons) {
                b.onclick = (e) =>{
                    clearButtons();
                    currentMode = e.target.value;
                    e.target.disabled = true;
                };
            }
        }

        function drawWave(){
            ctx.fillRect(0,0,canvasWidth,canvasHeight);

            x=0
            y=0;
            counter  = 0;
            let prevSplit = null;

            for(let i = 0; i < canvasWidth; i++){
                x+=5;
                counter += .15;

                checkSplits();

                y=canvasHeight/2 + Math.sin(counter)*100;
                abcLib.drawCircle(ctx,x ,y ,2,`hsl(${sinColor}, 100%, 80%)`);
                y=canvasHeight/2 + Math.cos(counter)*100;

                abcLib.drawCircle(ctx,x ,y ,2,`hsl(${cosColor}, 100%, 50%)`);
            }
        }

        function checkSplits(){
            for (const s of splits) {
                if(s.x == x){
                    counter = s.counter;
                    if(s == selectedSplit){
                        sinColor = 150;
                        cosColor =150;
                    }
                    else{
                        sinColor = 0;
                        cosColor = 0;
                    }
                }
            }
        }

        function selectSplit(selectedX){
            for (let i = 0; i < splits.length; i++) {
                //debugger;
                let s = splits[i];
                let t = null;
                if(i != splits.length -1){
                    t = splits[i + 1];                    
                }
                if( selectedX>= s.x && (t == null || t.x > selectedX)){
                    selectedSplit = s;
                }
            }
        }

        function clearButtons(){
            for (const b of buttons) {
                b.disabled = false;
            }
        }
        function loop(){
            setTimeout(loop, 1000/fps);
            ctx.save();
            ctx.globalAlpha = 1/fps;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.restore();
            x+=10;
            counter += .3;

            y=canvasHeight/2 + Math.sin(counter)*100;

            abcLib.drawCircle(ctx,x ,y ,2,`hsl(${sinColor}, 100%, 80%)`);

            y=canvasHeight/2 + Math.cos(counter)*100;

            abcLib.drawCircle(ctx,x ,y ,2,`hsl(${cosColor}, 100%, 50%)`);

            sinColor +=1;
            cosColor +=30;

            if(sinColor >= 360) sinColor = 0;
            if(cosColor >= 360) cosColor = 0;
            if(x>canvasWidth) x=0;
            //debugger;
            //let counter  = 0;
            //let increase = Math.PI *2 / 100;
            //for(let i = 0; i < 1; i+=.01){
            //    x=i;
            //    y = Math.sin(counter) / 2 + 0.5;
            //    console.log(x,y);
            //    drawCircle(ctx,x * canvasWidth,(y * 100) + canvasHeight/2,2,"white");
            //    counter+= increase;
            //}
        }