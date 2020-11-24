let geojson = {
    type: 'FeatureCollection',
    features: []
};
let map;

function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWMzMzQzIiwiYSI6ImNraGY3OGZmazBtZGsydHMxeXVuY2lyMnMifQ.PdF8dR2iIZO5B5K-x--a2g';

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-95.712891,37.090240,],
        zoom: 3
    });

    // The 'building' layer in the mapbox-streets vector source contains building-height
    // data from OpenStreetMap.
    map.on('load', function () {
        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers;

        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
                labelLayerId = layers[i].id;
                break;
            }
        }

        map.addLayer(
            {
                'id': '3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': '#aaa',

                    // use an 'interpolate' expression to add a smooth transition effect to the
                    // buildings as the user zooms in
                    'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height']
                    ],
                    'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height']
                    ],
                    'fill-extrusion-opacity': 0.6
                }
            },
            labelLayerId
        );
    });
}

function addMarkersToMap() {
    // add markers to map
    for (let marker of geojson.features) {

        addMarker(marker.geometry.coordinates,marker.properties.title,marker.properties.description, 'marker');
    };
}

function loadMarkers() {
    const coffeeShops = [
        {
            latitude: 43.084156,
            longitude: -77.67514,
            title: "Artesano Bakery & Cafe"
        },

        {
            latitude: 43.083866,
            longitude: -77.66901,
            title: "Beanz"
        },

        {
            latitude: 43.082520,
            longitude: -77.67980,
            title: "Starbucks"
        },

        {
            latitude: 43.086678,
            longitude: -77.669014,
            title: "The College Grind"
        },

        {
            latitude: 43.082634,
            longitude: -77.68004,
            title: "The Cafe & Market at Crossroads"
        },

        {
            latitude: 43.08382,
            longitude: -77.674805,
            title: "RITZ Sports Zone"
        },

        {
            latitude: 43.086502,
            longitude: -77.66912,
            title: "The Commons"
        },

        {
            latitude: 43.08324,
            longitude: -77.68105,
            title: "The Market at Global Village"
        },

        {
            latitude: 43.08384,
            longitude: -77.67457,
            title: "Brick City Cafe"
        },

        {
            latitude: 43.084904,
            longitude: -77.6676,
            title: "Corner Store"
        },

        {
            latitude: 43.08464,
            longitude: -77.680145,
            title: "CTRL ALT DELi"
        },

        {
            latitude: 43.08359,
            longitude: -77.66921,
            title: "Gracie's"
        }
    ];

    for (let shop of coffeeShops) {
        const newFeature = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: []
            },
            properties: {
                title: "",
                description: 'A place to get coffee!'
            }
        };

        newFeature.geometry.coordinates[0] = shop.longitude;
        newFeature.geometry.coordinates[1] = shop.latitude;
        newFeature.properties.title = shop.title;

        geojson.features.push(newFeature);
    }
    // now convert this data to GeoJSON
}

function flyTo(center = [0, 0]) {
    map.flyTo({ center: center });
}

function setZoomLevel(value = 0) {
    map.setZoom(value);
}

function setPitchAndBearing(pitch = 0, bearing = 0) {
    map.setPitch(pitch);
    map.setBearing(bearing);
}

function addMarker(coordinates, title, description, className){
     // create a HTML element for each feature
     let el = document.createElement('div');
     el.className = className;

     // make a marker for each feature and add to the map
     new mapboxgl.Marker(el)
         .setLngLat(coordinates)
         .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
             .setHTML('<h3>' + title + '</h3><p>' + description + '</p>'))
         .addTo(map);
}
export { initMap, addMarkersToMap, loadMarkers, flyTo, setZoomLevel, setPitchAndBearing, addMarker }