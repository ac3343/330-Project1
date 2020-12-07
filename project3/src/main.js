import * as map from "./map.js"
import * as ajax from "./ajax.js"
import * as resources from "./resources.js"
import * as storage from "./localstorage.js"
import * as classes from "./classes.js"
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
    const ROWS_PER_STATE = 100;
    const API_URL = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=hate-crime-per-state&q=&rows=${ROWS_PER_STATE}&facet=basename&facet=year&facet=bias_motivation`;
    const defaultCases = [{}];
    let markers = [];
    const YEAR_KEY = "yearRange";
    const BIAS_KEY = "selectedBiases";

    let appStats = new Vue({
        el: "#statistics",
        data: {
            bias: [],
            year: [],
            states: [],
            cases: [],
            currentBias: "totalCount"
        },
        methods: {
            sortCases(ascending=false){
                console.log("boo");
                this.cases = this.cases.sort((a, b) =>{
                    if(!a[this.currentBias]){
                        a[this.currentBias] = 0;
                    }
                    if(!b[this.currentBias]){
                        b[this.currentBias] = 0;
                    }
                    return ascending ? Number(a[this.currentBias]) - Number(b[this.currentBias]) : Number(b[this.currentBias]) - Number(a[this.currentBias]);
                });
            }
        }
    });

    let app = new Vue({
        el: '#controls',
        data: {
            year: [2002, 2005],
            cases: [],
            lnglatIGM: [-77.67990589141846, 43.08447511795301],
            lnglatRIT: [-77.67454147338866, 43.08484339838443],
            lnglatUSA: [-95.712891, 37.090240,],
            bias: resources.getBias(),
            allBias: resources.getBias(),
            progress: 49
        },
        methods: {
            updateYear() {
                if (this.year) {
                    this.year = grave.value;
                }
            },
            checkYear() {
                appStats.year = this.year;
                appStats.cases = [];
                appStats.bias = this.bias;
                this.progress = 0;
                this.clearMarkers();
                this.cases = [];
                let url = API_URL;
                for (let i = 1991; i <= 2014; i++) {
                    if (i < this.year[0] || i > this.year[1]) {
                        url += "&exclude.year=";
                        url += i;
                    }
                }

                for (const b of this.allBias) {
                    if (!this.bias.includes(b)) {
                        url += "&exclude.bias_motivation=";
                        url += b;
                    }
                }

                //Loop through states
                for (const s of resources.getStates()) {
                    let state = new classes.StateData(s);

                    let stateUrl = url + "&refine.basename=" + s;
                    ajax.downloadFile(stateUrl, (json) => {
                        let object = JSON.parse(json);

                        if (object.records.length > 0) {
                            let currentStateCoor = object.records[0].geometry.coordinates;
                            for (const c of object.records) {
                                state.totalCount += Number(c.fields.count);
                                if (state[c.fields.bias_motivation]) {
                                    state[c.fields.bias_motivation] += Number(c.fields.count);
                                }
                                else {
                                    state[c.fields.bias_motivation] = Number(c.fields.count);
                                }
                            }
                            appStats.cases.push(state);
                            markers.push(map.addMarker(currentStateCoor, s, state.totalCount, "marker poi"));
                            this.progress += 1;
                            appStats.sortCases();
                        }
                    });
                }

            },
            changeView(zoom = 0, location = [0, 0], pitch = 0, bearing = 0) {
                if (location == "USA") {
                    //location = this.lnglatUSA;
                }
                map.setZoomLevel(zoom);
                map.setPitchAndBearing(pitch, bearing);
                map.flyTo(location);
            },
            toggleMotivations() {
                biasButtons.hidden = !biasButtons.hidden;
            },
            storeUI() {
                storage.storeData(YEAR_KEY, this.year);
                storage.storeData(BIAS_KEY, this.bias);
            },
            loadUI() {
                let storedYear = storage.getStoredData(YEAR_KEY);
                let storedBias = storage.getStoredData(BIAS_KEY);
                if (storedYear) {
                    this.year = storedYear;
                }
                if (storedBias) {
                    this.bias = storedBias;
                }
            },
            resetControls() {
                storage.clearStorage();
                this.year = [2002, 2005];
                this.bias = this.allBias;
                this.clearMarkers();

            },
            clearMarkers() {
                for (let i = markers.length - 1; i >= 0; i--) {
                    markers.pop().remove();
                }
            }
        },
        created: function () {
            this.loadUI();
            this.checkYear();
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