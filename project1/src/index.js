"use strict";
        const canvasWidth = 600, canvasHeight = 600;
        const backgroundColor = "#09BE6C";
        const fps = 12;
        let ctx;
        
        let x,y;
        let counter;
        let counterRate = .15; 
        let iterator;
        let waveType;
        let yScale;

        
        let sinColor = 0;
        let cosColor = 0;

        let splits = [];

        let currentMode = 0;
        let buttons;

        let prevMouseCoor;
        let isMouseDown;
        let selectedSplit;

        
        

        window.onload = init;
        function init(){
            ctx = canvas.getContext("2d");

            domEvents();

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            x = 0;
            y= 0;
            splits.push({x: 5, counter:0, iterator:3, waveType:0, yScale:100, counterRate:.15});
            drawWave();
            //loop();
        }
        function domEvents(){
            canvas.onmouseup = (e) =>{
                let mouseCoor = abcLib.getMouseCoordinates(e);

                if(currentMode == 0){
                    splits.push({x: abcLib.roundToMultipleOf(mouseCoor.x, 5), counter:0, iterator:5, waveType:0, yScale:100, counterRate:.15});
                    arrangeSplits(0);
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
                    if(currentMode == 0){
                        selectedSplit = null;
                        document.querySelector("#waveProp").hidden = true;
                    }
                    else if(currentMode ==1){
                        document.querySelector("#waveProp").hidden = false;
                        selectedSplit = splits[0];
                        updateControls();
                    }
                    drawWave();

                };
            }
            document.querySelector("#width").onchange = (e) =>{
                if(selectedSplit){
                    selectedSplit.iterator = parseInt(e.target.value);
                    drawWave();
                }
            };
            document.querySelector("#height").onchange = (e) =>{
                if(selectedSplit){
                    selectedSplit.yScale = parseInt(e.target.value);
                    drawWave();
                }
            };
            document.querySelector("#counterSlide").onchange = (e) =>{
                    selectedSplit.counterRate = parseFloat(e.target.value) / 100;
                    drawWave();
            };
            let waveTypeButtons =  document.querySelectorAll('input[name="waveType"]');

            for (const b of waveTypeButtons) {
                b.onclick = (e) =>{
                    if(selectedSplit && e.target.checked){
                        selectedSplit.waveType = e.target.value;
                        drawWave();
                    }
                };
            }

            window.onkeyup= (e) =>{
                if(e.key == "Delete" && selectedSplit){
                    for(let i = 0; i < splits.length; i++){
                        if(splits[i] == selectedSplit && e.key == "Delete" && splits.length > 1){
                            splits.splice(i, 1);
                            drawWave();
                            if(i == 0){
                                splits.push({x: 5, counter:0, iterator:3, waveType:0, yScale:100, counterRate:.15});
                                arrangeSplits();
                            }
                            return;
                        }
                    }
                }
            };
        }

        function drawWave(){
            abcLib.drawRectangle(ctx,0,0,canvasWidth,canvasHeight, backgroundColor);

            x=0
            y=0;
            counter  = 0;
            iterator = 5;
            waveType = 0;
            yScale = 100;

            for(let i = 0; x <= canvasWidth; i++){
                x+=iterator;
                counter += counterRate;

                checkSplits();

                if(waveType == 0){
                    y=canvasHeight/2 + Math.sin(counter)*yScale;
                    abcLib.drawCircle(ctx,x ,y ,2,`hsl(${sinColor}, 100%, 80%)`);
                }
                else if(waveType == 1){
                    y=canvasHeight/2 + Math.cos(counter)*yScale;
                    abcLib.drawCircle(ctx,x ,y ,2,`hsl(${cosColor}, 100%, 50%)`);
                }
                
            }
        }

        function checkSplits(){
            for (const s of splits) {
                if(s.x >= x - 2 && x + 2 >= s.x){
                    counter = s.counter;
                    iterator = s.iterator;
                    waveType = s.waveType;
                    yScale = s.yScale;
                    counterRate = s.counterRate;

                    if(s == selectedSplit){
                        sinColor = 150;
                        cosColor =150;
                    }
                    else{
                        sinColor = 0;
                        cosColor = 0;
                    }
                    return;
                }
            }
        }

        function selectSplit(selectedX){
            for (let i = 0; i < splits.length; i++) {
                let s = splits[i];
                let t = null;
                if(i != splits.length - 1){
                    t = splits[i + 1];                    
                }
                if( selectedX>= s.x && (t == null || t.x > selectedX)){
                    selectedSplit = s;
                    updateControls();
                    return;
                }
            }
        }
        function arrangeSplits(){
            splits.sort(function(a,b){return a.x-b.x});
        }

        function updateControls(){
            document.querySelector("#width").value = selectedSplit.iterator;

            let waveTypeButtons =  document.querySelectorAll('input[name="waveType"]');

            for (const b of waveTypeButtons) {
                b.checked = b.value == selectedSplit.waveType;
            }

            document.querySelector("#height").value = selectedSplit.yScale;
            document.querySelector("#counterSlide").value = selectedSplit.counterRate * 100;
        }

        function clearButtons(){
            for (const b of buttons) {
                b.disabled = false;
            }
        }
        function loop(){
            setTimeout(loop, 1000/fps);
            //ctx.save();
            //ctx.globalAlpha = .5/fps;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            //counterRate+= .1;
            //drawWave();
            //ctx.restore();
            x+=10;
            counter += counterRate;

            y=canvasHeight/2 + Math.sin(counter)*100;

            abcLib.drawCircle(ctx,x ,y ,2,`hsl(${sinColor}, 100%, 80%)`);

            y=canvasHeight/2 + Math.cos(counter)*100;

            abcLib.drawCircle(ctx,x ,y ,2,`hsl(${cosColor}, 100%, 50%)`);
//
            sinColor +=1;
            cosColor +=30;
//
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