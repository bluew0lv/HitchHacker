var angularApp = angular.module('angularApp', ['google-maps', 'ngMap']);

var firebaseRef = new Firebase("https://malik-testing.firebaseio.com/");


angularApp.controller("homeCtrl", ["$scope", "$rootScope", "$document", function($scope, $rootScope, $document, NgMap) {
        var lat = 0;
        var long = 0;
    
    
      //This is the what will show as a map on the screen
  //$scope.initialize = NgMap.getMap().then(function(map) {
    
    $scope.initialize = function() {
        var Map = new google.maps.Map(document.getElementById("googleMap"), {
            control: {},
         // center:new google.maps.LatLng(lat: 41,lng: -85),
            center: {lat: 41, lng: -85},
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        })
        };
       // var mapPlace=new google.maps.Map(document.getElementById("googleMap"), Map);
    
    
  
    /*
    var map = new google.maps.Map(document.getElementById('map'),{
    control: {},
    center: {
        latitude: 41.812150,
        longitude: -84.971008
    },
    zoom: 14
  });
    */g
        
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var geocoder = new google.maps.Geocoder(); //Used to deal with different types of addressing
    
    $scope.directions = {
        origin: "46803",
        destination: "32002",
        show: false
        
    }
    
    function setMarker(map, position, title, content)
    {
        var marker;
    }
    $scope.getDirections = function() {
        var directionRequest = {
            origin: $scope.directions.origin,
            destination: $scope.directions.destination,
             travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(directionRequest, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directionsList'));
        $scope.directions.show  = true;
      } else {
        alert('Google route unsuccesfull!');
      }
    });
    }
    
                                
      /*
    center: {
        latitude: 41.0770741,
        longitude: -85.1173086
    },
    zoom: 14
  };
  
  //This will be the exact position where the marker will be located on the map
  $scope.marker = {
    center: {
        latitude: 41.08,
        longitude: -85.11
    }
  }
   */ 
   //temporary closing
  
    //google.maps.event.addDomListener(window, 'load', initialize); //Possible use top lead map
 //Variables used for direction
    
  
    
    
   //get directions using google maps api
    /*
  $scope.getDirections = function () {
    var request = {
      origin: $scope.directions.origin,
      destination: $scope.directions.destination,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap($scope.map.control.getGMap());
        directionsDisplay.setPanel(document.getElementById('directionsList'));
        $scope.directions.showList = true;
      } else {
        alert('Google route unsuccesfull!');
      }
    });
  }
    */
  
  //This obtains the user's position and tests it against another position to obrtain distance
    $scope.refreshPosition = function($scope) {

        if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      //return {lat:data.coords.latitude, long:data.coords.longitude};
        lat = position.coords.latitude;
        long = position.coords.longitude;
        console.log(lat);
        console.log(long);
        var local = [lat, long];
        var local2 = [10.3, -55.3];
    
    
        var distance = GeoFire.distance(local, local2);
        console.log(distance);
        console.log(local);
        console.log(local2);
        
    });
    }
    
}


    
}]);

/*
User is going to search for applicable person within  radius
Clicking search will obtain user location and match it against other locations in database
to determine any applicable and list said matches.
*/