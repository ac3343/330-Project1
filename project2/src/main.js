/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';
import * as dat from './dat.gui.module.js';

const drawParams = {
    showGradient    :true,
    gradientColor   :"rgb(0,0,139)",
    showInvert      :false,
    showMono        :false,
    showBubbles     :false,
    showAurora      :true,
    showQuad        :true,
    useFreqData     :true,
    useWaveData     :false,
    auroraSpeed     :2,
    auroraRange     :1
}

const SOUNDS = {
    newAdventureTheme   :   "media/New Adventure Theme.mp3", 
    thePicardSong       :   "media/The Picard Song.mp3",
    peanutsTheme        :   "media/Peanuts Theme.mp3"
}

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1      :  "media/New Adventure Theme.mp3",
    sound1Name  : "newAdventureTheme"
});

let progressBar,progressLabel;

function init(){
    audio.setupWebaudio(DEFAULTS.sound1);
	console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    loop();
}

function setupUI(canvasElement){
    


    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");
        
    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");

    let durationLabel = document.querySelector("#durationLabel");

    //Creates DAT GUI
    let gui = new dat.GUI();

    //Adds folder for audio controls
    let audioFolder = gui.addFolder("Audio");
    let tracks = {song:DEFAULTS.sound1}
    let trackSelect = audioFolder.add(tracks, "song", SOUNDS);

    trackSelect.onChange((function(e){
        audio.loadSoundFile(e);

        if(playButton.dataset.playing = "yes"){
            playButton.dispatchEvent(new MouseEvent("click"));
        }
        durationLabel.innerHTML = "0:00";

    }));

    let biquadToggle = audioFolder.add({filter: false}, "filter");
    biquadToggle.onChange((e)=>{
        if(e){
            audio.setBiquad(800, "lowpass");
        }
        else{
            audio.setBiquad(0);
        }
    });

    //Folder for aurora controls
    let auroraFolder = gui.addFolder("Aurora");
    let auroraToggle = auroraFolder.add({showAurora: drawParams.showAurora}, "showAurora");
    auroraToggle.onChange((e)=>{
        drawParams.showAurora = e;
    });
    let quadToggle = auroraFolder.add({showWave: drawParams.showQuad}, "showWave");
    quadToggle.onChange((e)=>{
        drawParams.showQuad = e;
    });
    let colorChangeSlider = auroraFolder.add({colorChangeSpeed: drawParams.auroraSpeed},"colorChangeSpeed", -10, 10);
    colorChangeSlider.onChange((e)=>{
        drawParams.auroraSpeed = e;
    });
    let colorRangeSlider = auroraFolder.add({colorRange: drawParams.auroraRange},"colorRange", .1, 5);
    colorRangeSlider.onChange((e)=>{
        drawParams.auroraRange = e;
    });


    //Folder for bubble controls
    let bubblesFolder = gui.addFolder("Bubbles");
    let showBubblesSelect = bubblesFolder.add({showBubbles: drawParams.showBubbles}, "showBubbles");
    showBubblesSelect.onChange((e)=>{
        drawParams.showBubbles = e;
    });

    //Folder for visual options
    let visualsFolder = gui.addFolder("Visuals");

    let showInvertSelect = visualsFolder.add({showInvert: drawParams.showInvert}, "showInvert");
    showInvertSelect.onChange((e)=>{
        drawParams.showInvert = e;
    });

    let showMonoSelect = visualsFolder.add({showMono: drawParams.showMono}, "showMono");
    showMonoSelect.onChange((e)=>{
        drawParams.showMono = e;
    });

    let showGradientSelect = visualsFolder.add({showGradient: drawParams.showGradient}, "showGradient");
    showGradientSelect.onChange((e)=>{
        drawParams.showGradient = e;
    });
    let gradientColorSelect = visualsFolder.addColor({gradientColor: drawParams.gradientColor},"gradientColor");
    gradientColorSelect.onChange((e)=>{
        drawParams.gradientColor = e;
    });

    
    //Playback elements
    playButton.onclick = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

        if(audio.audioCtx.state == "suspended"){
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        if(e.target.dataset.playing == "no"){
            audio.playCurrentSound();
            e.target.dataset.playing = "yes";
        }else{
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";
        }
        
        progressBar.max = audio.getDuration();
        durationLabel.innerHTML = audio.getTimeAsString(audio.getDuration());
    };    

    volumeSlider.oninput = e =>{
        audio.setVolume(e.target.value);
        volumeLabel.innerHTML = Math.round((e.target.value/ 2 * 100));
    };

    volumeSlider.dispatchEvent(new Event("input"));

    progressBar = document.querySelector("#progressBar");
    progressBar.oninput = e =>{
        audio.setTime(e.target.value);
    };
    progressLabel = document.querySelector("#progressLabel");

    document.querySelector('#freqData').checked = drawParams.useFreqData;
    document.querySelector('#freqData').onchange = e => {
        drawParams.useFreqData = e.target.checked;
        drawParams.useWaveData = false;
    };
    document.querySelector('#waveData').checked = drawParams.useWaveData;
    document.querySelector('#waveData').onchange = e => {
        drawParams.useWaveData = e.target.checked;
        drawParams.useFreqData = false;
    };
	
} // end setupUI

function loop(){
    /* NOTE: This is temporary testing code that we will delete in Part II */
    requestAnimationFrame(loop);

    canvas.draw(drawParams);

    progressBar.value  = audio.getTime();
    progressLabel.innerHTML = audio.getTimeAsString(progressBar.value);

    // 1) create a byte array (values of 0-255) to hold the audio data
    // normally, we do this once when the program starts up, NOT every frame
    //let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
    //
    //// 2) populate the array of audio data *by reference* (i.e. by its address)
    //audio.analyserNode.getByteFrequencyData(audioData);
    //
    //// 3) log out the array and the average loudness (amplitude) of all of the frequency bins
    //console.log(audioData);
    //
    //console.log("-----Audio Stats-----");
    //let totalLoudness =  audioData.reduce((total,num) => total + num);
    //let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
    //let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
    //let maxLoudness =  Math.max(...audioData); // ditto!
    //// Now look at loudness in a specific bin
    //// 22050 kHz divided by 128 bins = 172.23 kHz per bin
    //// the 12th element in array represents loudness at 2.067 kHz
    //let loudnessAt2K = audioData[11]; 
    //console.log(`averageLoudness = ${averageLoudness}`);
    //console.log(`minLoudness = ${minLoudness}`);
    //console.log(`maxLoudness = ${maxLoudness}`);
    //console.log(`loudnessAt2K = ${loudnessAt2K}`);
    //console.log("---------------------");
}

export {init};