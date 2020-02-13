mapboxgl.accessToken = 'pk.eyJ1IjoiYm5ociIsImEiOiJjazZqbDQ5YzYwYWN4M21wNTZuZGJjNWs5In0.flQNWk-3lIVVEYLTYf3msA'

document.getElementById('status').onchange = function() {updateMap()};
document.getElementById('gender').onchange = function() {updateMap()};
document.getElementById('age').onchange = function() {updateMap()};

$('#search-btn').click(function(){
    $('#filter-ctrl').toggle();
});

function updateMap() {
    map.fire('closepopup')
    map.setPaintProperty('status',
        'fill-color',
            styleField(),
     );

};

function styleField() {
    var status = document.getElementById('status').value
    var gender = document.getElementById('gender').value
    var age = document.getElementById('age').value
    var field = status + ' - ' + gender + ' - ' + age
    var field_perc = field + ' - Perc'

    if (age == 'Total') {
        return [
            'step',
            ['get', field_perc],
                '#ffffff', 0,
                '#ffdee3', 1.0,
                '#ffbbc1', 2.5,
                '#ff6f77', 5.0,
                '#ff3334', 10.0,
                '#c00000', 100.0,
                ['rgba', 255, 255, 255, 0]
        ]
    }

    else {
        if (status != 'Single'){
            return [
                'step',
                ['get', field],
                    '#ffffff', 0,
                    '#ffdee3', 1000,
                    '#ffbbc1', 50000,
                    '#ff6f77', 100000,
                    '#ff3334', 250000,
                    '#c00000', 999999999,
                    ['rgba', 255, 255, 255, 0]
            ]
        }
        else {
            return [
                'step',
                ['get', field],
                    '#ffffff', 0,
                    '#ffdee3', 25000,
                    '#ffbbc1', 100000,
                    '#ff6f77', 500000,
                    '#ff3334', 1000000,
                    '#c00000', 999999999,
                    ['rgba', 255, 255, 255, 0]
            ]
        }
    }

    // else {
    //     if (status != 'Single'){
    //         return [
    //             'step',
    //             ['get', field],
    //                 '#ffffff', 0,
    //                 '#ffdee3', 0.05,
    //                 '#ffbbc1', 0.10,
    //                 '#ff6f77', 0.25,
    //                 '#ff3334', 0.50,
    //                 '#c00000', 100.0,
    //                 ['rgba', 255, 255, 255, 0]
    //         ]
    //     }
    //     else {
    //         return [
    //             'step',
    //             ['get', field],
    //                 '#ffffff', 0,
    //                 '#ffdee3', 1.0,
    //                 '#ffbbc1', 5.0,
    //                 '#ff6f77', 10.0,
    //                 '#ff3334', 15.0,
    //                 '#c00000', 100.0,
    //                 ['rgba', 255, 255, 255, 0]
    //         ]
    //     }
    // }
}

var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    // style: 'http://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: [121.8733, 13.5221],
    zoom: 5,
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');

map.on('load', function(){
    map.addSource(
        'status', {
            type: 'geojson',
            data: 'data/marital-status-regions.geojson'
    });

    map.addLayer({
        'id': 'status',
        'type': 'fill',
        'source': 'status',
        'layout': {},
        'paint': {
            'fill-color': styleField(),
            'fill-opacity': 0.9,
            'fill-outline-color': '#ff8896',
            // 'fill-outline-color': '#f3f3f3',
        },
    });

});

map.resize();

map.on('click', 'status', function (e) {
    var status = document.getElementById('status').value
    var gender = document.getElementById('gender').value
    var age = document.getElementById('age')
    var age_v = age.value
    var age_t = age.options[age.selectedIndex].text
    var field = status + ' - ' + gender + ' - ' + age_v
    var field_perc = status + ' - ' + gender + ' - ' + age_v + ' - Perc'
    var coordinates = e.lngLat;
    var region = e.features[0].properties['REGION'];
    var number = e.features[0].properties[field];
    var perc = e.features[0].properties[field_perc];

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    var s = ''

    var s2 = ''

    if (gender != 'Both Sexes') {
        s2 = gender.toUpperCase();
    }


    if (age_v == 'Total') {
        s = '<h4 class="text-center mb-0 mt-1 pb-1"><b>' + perc.toLocaleString() + ' %</b></h4>' +
        '<p class="mb-0 mt-1 pb-1 text-secondary text-center" style="line-height:1.2"><b>OF ALL ' + status + ', ' + gender + '</b>, <b>Age: ' + age_t + '</b> in the <b>Philippines</b></p>'
    }

    else {
        s = '<h4 class="text-center mb-0 mt-1 pb-1"><b>' + perc.toLocaleString() + ' %</b></h4>' +
        '<p class="mb-0 mt-1 pb-1 text-secondary text-center" style="line-height:1.2"><b>OF THE ENTIRE ' + s2 + ' POPULATION</b> of <b>' + region + '</b></p>'
    }

    var popup_html = '<h6 class=" text-center c0">' + region + '</h6><hr class="mt-0 pt-0 mb-1 pb-1">' +
                     '<h4 class="text-center mb-0 mt-1 pb-1"><b>' + number.toLocaleString() + '</b></h4>' +
                     '<p class="mb-0 mt-1 pb-1 text-secondary text-center" style="line-height:1.2"><b>' + status + ', ' + gender + '</b>, <b>Age: ' + age_t + '</b></p>' +
                     s


    var popup = new mapboxgl.Popup({closeButton:''})
    .setLngLat(coordinates)
    .setHTML(popup_html)
    .addTo(map);

    map.on('closepopup', () => {
        popup.remove();
    });
});
