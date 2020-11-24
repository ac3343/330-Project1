import * as map from "./map.js"
import * as ajax from "./ajax.js";

let poi;

function init() {
    map.initMap();
    setupUI();
    //map.loadMarkers();
    // add markers to map
    map.addMarkersToMap();
}

function setupUI() {
    // it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
    const ROWS = 20;
    const API_URL = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=hate-crime-per-state&q=&rows=${ROWS}&facet=basename&facet=year&facet=bias_motivation`;
    const defaultCases = [{}];

    let app = new Vue({
        el: '#controls',
        data: {
            year: [2002, 2005],
            cases: [],
            lnglatIGM: [-77.67990589141846, 43.08447511795301],
            lnglatRIT: [-77.67454147338866, 43.08484339838443],
            lnglatUSA: [-95.712891,37.090240,]
        },
        methods: {
            updateYear() {
                if (this.year) {
                    this.year = grave.value;
                }
            },
            checkYear() {
                this.cases = [];
                let url = API_URL;
                for (let i = 1991; i <= 2014; i++) {
                    if (i < this.year[0] || i > this.year[1]) {
                        url += "&exclude.year=";
                        url += i;
                    }
                }
                ajax.downloadFile(url, (json) => {
                    let object = JSON.parse(json);
                    this.cases = this.cases.concat(object.records);
                    for (const c of this.cases) {
                        map.addMarker(c.geometry.coordinates,c.fields.year, c.fields.bias_motivation, "marker poi");
                    }
                    console.log(this.cases);
                });
            },
            changeView(zoom=0, location=[0,0], pitch=0, bearing=0) {
                if(location == "USA"){
                    //location = this.lnglatUSA;
                }
                map.setZoomLevel(zoom);
                map.setPitchAndBearing(pitch, bearing);
                map.flyTo(location);
            }
        }
    });

}

function loadPOI() {
    const url = "https://igm.rit.edu/~acjvks/courses/shared/330/maps/igm-points-of-interest.php";

    function poiLoaded(jsonString) {
        poi = JSON.parse(jsonString);
        console.log(poi);

        for (const p of poi) {
            map.addMarker(p.coordinates, p.title, "A POI!", "marker poi");
        }
    }

    ajax.downloadFile(url, poiLoaded);
}

export { init };