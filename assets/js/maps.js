
var mapStyles = [
        {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [
                {"visibility": "on"},
                {"hue": "10"},
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "all",
            "stylers": [
                {"visibility": "off"},
                {"color": ""}
            ]
        },
        {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
                {"hue": "0"},
                {"saturation": "-25"}
            ]
        },
        {
            featureType: 'transit.station',
            elementType: 'all',
            stylers: [{'visibility': 'off'}]
        },
        { featureType: 'poi.attraction', elementType: 'all', stylers: [{"visibility": "off"}] },
        { featureType: 'poi.government', elementType: 'all', stylers: [{"visibility": "off"}] },
        { featureType: 'poi.business', elementType: 'all', stylers: [{"visibility": "off"}] },
        { featureType: 'poi.medical', elementType: 'all', stylers: [{"visibility": "off"}] },
        { featureType: 'poi.place_of_worship', elementType: 'all', stylers: [{"visibility": "off"}] },
        { featureType: 'poi.school', elementType: 'all', stylers: [{"visibility": "off"}] },
        { featureType: 'poi.sports_complex', elementType: 'all', stylers: [{"visibility": "off"}] },
        {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
                {"lightness"  : 100},
            ]
        },
        {
            "featureType": "text",
            "elementType": "labels.text",
            "stylers": [
                {"visibility": "on"}
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {"lightness"  : 100},
                {"visibility" : "simplified"},
                {"color"      : "#ffffff"}
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {"visibility": "simplified"},
                {"lightness": 15}
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text",
            "stylers": [
                {"visibility": "off"}
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {"color": "#a2cbfd"}
            ]
        }
    ];

var maps = {
    sanclemente: [-34.91460557258716, -56.153771661376936],
    petra: [-34.914841763074776, -54.860843354492204],
    casaBanem: [-34.8895215,-56.0624686]
};

function newMap(map_element_id, location, zoom) {
    if(!zoom) zoom = 15;
    var styledMapType;
    var map;
    var locationObj = {lat: location[0], lng: location[1]}

    map = new google.maps.Map(document.getElementById(map_element_id), {
        center: locationObj,
        zoom: zoom,
        zoomControl: false,
        disableDoubleClickZoom: true,
        mapTypeControl: false,
        scaleControl: false,
        scrollwheel: false,
        panControl: false,
        streetViewControl: false,
        draggable : false   
    });

    var image = '/assets/images/map_point.png';
    var PinNegro = new google.maps.Marker({
        position: locationObj,
        map: map,
        icon: image
    });

    // var marker = new google.maps.Marker({
    //     position: locationObj,
    //     map: map
    // });

    styledMapType = new google.maps.StyledMapType(
        mapStyles,
        {name: 'Styled Map'});

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
    maps[map_element_id] = map;
}

function initMaps(){
	// newMap('CONTAINER ID', POSITION, ZOOM)
	trace('>>> INIT MAPS')
	newMap('map1', maps.sanclemente, 14);
	newMap('map2', maps.petra, 14);
    newMap('map3', maps.casaBanem, 14);
    resizeWindow();
    $('.map a').hide();
}

function mapsReady(){
    
    maps.ready = true;
	
}

function loadMapsApi(){
    // <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCzIv7Ehgj49Uw0zuk4iJKkSkw3DYud8uQ&callback=mapsReady" async defer></script>
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCzIv7Ehgj49Uw0zuk4iJKkSkw3DYud8uQ&callback=initMaps";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}