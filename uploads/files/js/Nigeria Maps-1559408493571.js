var icons = { parking: { icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' } };

var glatval;
var glngval;
$(document).ready(function() {
    geoLocationInit();
    //infoWindow = new google.maps.InfoWindow;
});

function geoLocationInit() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, fail);
    } else {
        alert("Browser not supported");
    }

}

function success(position) {
    var latval = position.coords.latitude;
    var lngval = position.coords.longitude;
    myLatLng = new google.maps.LatLng(latval, lngval);
    createMap(myLatLng);
    searchProvider(latval, lngval);
    nearByProviders(latval, lngval);
    console.log(position);
}

function fail() {
    var latval = 9.0612;
    var lngval = 7.4224;
    myLatLng = new google.maps.LatLng(latval, lngval);
    createMap(myLatLng);
    searchProvider(latval, lngval);
    nearByProviders(latval, lngval);
    alert("static location");
}
var hide = function() {
        $(".provider-availability-div").hide();
        $('.schedule-loader').hide();
    }
    //Create Map
function createMap(myLatLng) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 7,
        mapTypeId: "roadmap",
        mapTypeControl: true,
        styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#000fff" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#bee4e3" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#beb2b4" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#fefeee" }, { "visibility": "on" }] }]
            //mapTypeId: 'terrain'
    });
    map.setTilt(90);
    var marker = new google.maps.Marker({
        position: myLatLng,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        map: map
    });
    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h6 id="firstHeading" class="firstHeading">Welcome ' + name + ' </h6>' +
        '<div id="bodyContent">' +
        '<p><b>Medflit App </b>, this is your current location,' +
        'You can also locate doctors around you' +
        '.</p>' +
        '</div>' +
        '</div>';
    var infoWindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
    });
    google.maps.event.addListener(marker, 'click', function() {
        map.setCenter(marker.getPosition());
        infoWindow.open(map, marker);
    });
    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });

}

function createMarker(latlng, description, title, icons) {
    // markers.length= 0;
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: icons,
        title: title
    });
    // markers.push(marker);
    // var markerCluster = new MarkerClusterer(map, markers,
    //             {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

    var InfoWindows = new google.maps.InfoWindow({});

    marker.addListener('click', function() {
        InfoWindows.open(map, this);
        InfoWindows.setContent(description);
    });
}

function searchProvider(lat, lng) {
    $.ajax({
        url: MAPLOCATION,
        method: "GET",
        data: {
            '_token': TOKEN,
            'lat': lat,
            'lng': lng,
        },
        success: function(response) {
            console.log(response.dataset);

            response.dataset.forEach(function(airport) {
                var glatval = airport.position.lat;
                var glngval = airport.position.lng;
                var description = airport.content;
                var id = airport.id;
                var title = airport.title;
                var icon = icons[airport.icon].icon;
                var GLatLng = new google.maps.LatLng(glatval, glngval);
                createMarker(GLatLng, description, title, icon);

            });
        }
    });
}

function nearByProviders(lat, lng) {
    $.ajax({
        url: NEARBY,
        method: "GET",
        data: {
            '_token': TOKEN,
            'lat': lat,
            'lng': lng,
        },
        success: function(response) {
            console.log(response);
            if (response.type == "false") {
                toastr.error(response.msg);
            } else {
                $("#nearby").html("");
                $("#nearby").html(response);
                hide();
            }
        }
    });
}



function searchByGender(gender) {
    $.ajax({
        url: SEARCH,
        method: "GET",
        data: {
            '_token': TOKEN,
            'gender': gender
        },
        success: function(response) {
            console.log(response);
            if (response.type == "false") {
                toastr.error(response.msg);
            } else {
                $("#doctors_list").html("");
                $("#doctors_list").html(response);
                hide();
            }
        }
    });
}

function MapsearchByGender(service) {
    $.ajax({
        url: MapSearch,
        method: "GET",
        data: {
            '_token': TOKEN,
            'service': service
        },
        success: function(response) {
            console.log(response.dataset);
            response.dataset.forEach(function(airport) {
                var glatval = airport.position.lat;
                var glngval = airport.position.lng;
                var description = airport.content;
                var id = airport.id;
                var title = airport.title;
                var icon = icons[airport.icon].icon;
                var GLatLng = new google.maps.LatLng(glatval, glngval);
                createMarker(GLatLng, description, title, icon);

            });
        }
    });
}

function searchByService(service) {
    $.ajax({
        url: SEARCH,
        method: "GET",
        data: {
            '_token': TOKEN,
            'service': service
        },
        success: function(response) {
            console.log(response);
            if (response.type == "false") {
                toastr.error(response.msg);
            } else {
                $("#doctors_list").html("");
                $("#doctors_list").html(response);
                hide();
            }
        }
    });
}

function MapsearchByService(service) {
    $.ajax({
        url: MapSearch,
        method: "GET",
        data: {
            '_token': TOKEN,
            'service': service
        },
        success: function(response) {
            console.log(response.dataset);
            response.dataset.forEach(function(airport) {
                var glatval = airport.position.lat;
                var glngval = airport.position.lng;
                var description = airport.content;
                var id = airport.id;
                var title = airport.title;
                var icon = icons[airport.icon].icon;
                var GLatLng = new google.maps.LatLng(glatval, glngval);
                createMarker(GLatLng, description, title, icon);

            });
        }
    });
}

function searchByState(search) {
    $.ajax({
        url: SEARCH,
        method: "GET",
        data: {
            '_token': TOKEN,
            'search': search
        },
        success: function(response) {
            console.log(response);
            if (response.type == "false") {
                toastr.error(response.msg);
            } else {
                $("#doctors_list").html("");
                $("#doctors_list").html(response);
                hide();
            }

        }
    });
}

function searchByName(name) {
    $.ajax({
        url: SEARCH,
        method: "GET",
        data: {
            '_token': TOKEN,
            'name': name
        },
        success: function(response) {
            console.log(response);
            if (response.type == "false") {
                toastr.error(response.msg);
            } else {
                $("#doctors_list").html("");
                $("#doctors_list").html(response);
                hide();
            }

        }
    });
}

function MapsearchByName(name) {
    $.ajax({
        url: MapSearch,
        method: "GET",
        data: {
            '_token': TOKEN,
            'name': name
        },
        success: function(response) {
            console.log(response.dataset);
            response.dataset.forEach(function(airport) {
                var glatval = airport.position.lat;
                var glngval = airport.position.lng;
                var description = airport.content;
                var id = airport.id;
                var title = airport.title;
                var icon = icons[airport.icon].icon;
                var GLatLng = new google.maps.LatLng(glatval, glngval);
                createMarker(GLatLng, description, title, icon);

            });
        }
    });
}

function SearchPlan(search) {
    $.ajax({
        url: SEARCH,
        method: "GET",
        data: {
            '_token': TOKEN,
            'plan': search
        },
        success: function(response) {
            console.log(response);
            if (response.type == "false") {
                toastr.error(response.msg);
            } else {
                $("#doctors_list").html("");
                $("#doctors_list").html(response);
                hide();
            }

        }
    });
}

function MapsearchByPlan(search) {
    $.ajax({
        url: MapSearch,
        method: "GET",
        data: {
            '_token': TOKEN,
            'plan': search
        },
        success: function(response) {
            console.log(response.dataset);
            response.dataset.forEach(function(airport) {
                var glatval = airport.position.lat;
                var glngval = airport.position.lng;
                var description = airport.content;
                var id = airport.id;
                var title = airport.title;
                var icon = icons[airport.icon].icon;
                var GLatLng = new google.maps.LatLng(glatval, glngval);
                createMarker(GLatLng, description, title, icon);
            });
        }
    });
}

function SearchSpecialty(search) {
    $.ajax({
        url: SEARCH,
        method: "GET",
        data: {
            '_token': TOKEN,
            'specialty_id': search
        },
        success: function(response) {
            console.log(response);
            if (response.type == "false") {
                toastr.error(response.msg);
            } else {
                $("#doctors_list").html("");
                $("#doctors_list").html(response);
                hide();
            }

        }
    });
}

function MapsearchBySpecialty(search) {
    $.ajax({
        url: MapSearch,
        method: "GET",
        data: {
            '_token': TOKEN,
            'specialty_id': search
        },
        success: function(response) {
            console.log(response.dataset);
            response.dataset.forEach(function(airport) {
                var glatval = airport.position.lat;
                var glngval = airport.position.lng;
                var description = airport.content;
                var id = airport.id;
                var title = airport.title;
                var icon = icons[airport.icon].icon;
                var GLatLng = new google.maps.LatLng(glatval, glngval);
                createMarker(GLatLng, description, title, icon);
            });
        }
    });
}
$("#name").on('keyup', function() {
    var name = $("#name").val();
    if (name.length < 4) {
        if (name.length < 1) {
            searchByName(name);
            MapsearchByName(name);
        }
    } else {
        searchByName(name);
        MapsearchByName(name);
    }
});

$("#plan").on('change', function() {
    var plan = $("#plan").val();
    SearchPlan(plan);
    MapsearchByPlan(plan);
});

$("#specialty_id").on('change', function() {
    var specialty_id = $("#specialty_id").val();
    SearchSpecialty(specialty_id);
    MapsearchBySpecialty(specialty_id);
});

$('input[name="gender"]').change(function() {
    if ($(this).is(':checked')) {
        var gender = $('input[name="gender"]:checked').val();
        searchByGender(gender);
        MapsearchByGender(gender);
    }
});

$('input[name="service"]').change(function() {
    if ($(this).is(':checked')) {
        var service = $('input[name="service"]:checked').val();
        searchByService(service);
        MapsearchByService(service);
    }
});
