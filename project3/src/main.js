import * as map from "./map.js"
import * as ajax from "./ajax.js";

let poi;

function init() {
    map.initMap();
    setupUI();
    map.loadMarkers();
    // add markers to map
    map.addMarkersToMap();
}

function setupUI(){
    // it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
    const lnglatRIT = [-77.67454147338866, 43.08484339838443];
    const lnglatIGM = [-77.67990589141846, 43.08447511795301];

    btn1.onclick = () => {
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(0,0);
        map.flyTo(lnglatRIT);
    };

    btn2.onclick = () => {
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(45,0);
        map.flyTo(lnglatRIT);
    };

    btn3.onclick = () => {
        map.setZoomLevel();
        map.setPitchAndBearing(0,0);
        map.flyTo();
    };

    btn4.onclick = () => {
        map.setZoomLevel(18);
        map.setPitchAndBearing(0,0);
        map.flyTo(lnglatIGM);
    };

    btn5.onclick = () =>{
        if(!poi){
            loadPOI();
        }
    }
}

function loadPOI(){
    const url = "https://igm.rit.edu/~acjvks/courses/shared/330/maps/igm-points-of-interest.php";

    function poiLoaded(jsonString){
        poi = JSON.parse(jsonString);
        console.log(poi);

        for (const p of poi) {
            map.addMarker(p.coordinates, p.title, "A POI!", "marker poi");
        }
    }

    ajax.downloadFile(url, poiLoaded);
}

export { init };