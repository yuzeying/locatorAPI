mapboxgl.accessToken = 'pk.eyJ1IjoiemV5aW5nIiwiYSI6ImNrdHMyZW15djEwOGoyd2xhYnZzYWh0bHkifQ.J9dF1rIEKV378xIvaSHCTA';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
zoom: 9,
center: [-71.147895, 42.707741]
});

// Fetch stores from API
async function getStores(){
    const res = await fetch('/api/v1/stores');
    const data = await res.json();

    const stores = data.data.map(store => {
        return {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [store.location.coordinates[0], store.location.coordinates[1]]
            },
            properties:{
                storeId: store.storeId,
                icon: 'shop'
            }
        }
    });

    loadMap(stores);
}
// Load map with stores
function loadMap(stores){
    map.on('load', () => {
        // Add a data source containing one point feature.
        map.addSource('point', {
            'type': 'geojson',
            'data': {
            'type': 'FeatureCollection',
            features: stores
            }
        });
         
        // Add a layer to use the image to represent the data.
        map.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'point', // reference the data source
            'layout': {
                'icon-image': '{icon}-15', // reference the image
                'icon-size': 1.5,
                'text-field':'{storeId}',
                'text-font':['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset':[0, 0.9],
                'text-anchor': 'top'
            }
        });
        
    });
        
}

getStores();