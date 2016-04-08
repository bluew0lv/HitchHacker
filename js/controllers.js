//Controllers
angularApp.controller("homeCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Home');
}]);

angularApp.controller("infoCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Info');
}]);

angularApp.controller("termsCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Terms');
}]);

angularApp.controller("testCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Test');
}]);

angularApp.controller("forumCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('forum');

    var authData = $rootScope.fb.getAuth();
    var userRef = $rootScope.fb.child("forum");

    $scope.newTrip = function () {
        userRef.push({
            original: {
                author: authData.uid,
                origin: $scope.origin,
                dest: $scope.dest,
                message: $scope.message
            }
        });
    }

    $scope.forumPosts = function () {
        userRef.on("child_added", function (snapshot, prevChildKey) {
                var post = snapshot.child("original").val();
                console.log("Author: " + post.author);
                console.log("Origin: " + post.origin);
                console.log("Destination: " + post.dest);
                console.log("Message: " + post.message);
            },
            function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
    }
}]);

angularApp.controller("profileCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Profile');

    var ref = $rootScope.fb;
    var authData = ref.getAuth();
    $scope.isLogin = function () {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            return true;
        } else {
            console.log("User is logged out");
            return false;
        }
    }

    $scope.changeEmail = function () {
        ref.changeEmail({
            oldEmail: $scope.oldEmail,
            newEmail: $scope.newEmail,
            password: $scope.emailPassword
        }, function (error) {
            if (error === null) {
                console.log("Email changed successfully");
            } else {
                console.log("Error changing email:", error);
            }
        });
    }

    $scope.changePassword = function () {
        ref.changePassword({
            email: $scope.passwordEmail,
            oldPassword: $scope.oldPassword,
            newPassword: $scope.newPassword
        }, function (error) {
            if (error === null) {
                console.log("Password changed successfully");
            } else {
                console.log("Error changing password:", error);
            }
        });
    }

    $scope.deleteAccount = function () {
        ref.removeUser({
            email: $scope.email,
            password: $scope.password
        }, function (error) {
            if (error === null) {
                console.log("User removed successfully");
            } else {
                console.log("Error removing user:", error);
            }
        });
    }
}]);

angularApp.controller("navCtrl", ["$scope", "$rootScope", function ($scope, $rootScope) {
    console.log('nav');

    var ref = $rootScope.fb;
    var authData = ref.getAuth();

    $scope.isLogin = function () {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            return true;
        } else {
            console.log("User is logged out");
            return false;
        }
    }

    $scope.logout = function () {
        ref.unauth();
        //Reloads the page to the home page
        window.location.href = '/';
    }
}]);

angularApp.controller("loginCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Login');
    var ref = $rootScope.fb;

    $scope.forgotPassword = false;

    $scope.message = function () {
        var shide = "Forgot Password";
        if ($scope.forgotPassword) {
            shide = "Cancel";
        }
        return shide;
    };

    $scope.resetPassword = function () {
        ref.resetPassword({
            email: $scope.email
        }, function (error) {
            if (error === null) {
                console.log("Password reset email sent successfully");
            } else {
                console.log("Error sending password reset email:", error);
            }
        });
    };

    $scope.loginUser = function () {
        ref.authWithPassword({
            email: $scope.email,
            password: $scope.password
        }, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                window.location.href = '/'
            }
        });
    };

    $scope.isVisible = function () {
        $scope.forgotPassword = $scope.forgotPassword ? false : true;
    }

}]);

angularApp.controller("registerCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Register');

    var ref = $rootScope.fb;

    $scope.createUser = function () {
        ref.createUser({
            email: $scope.email,
            password: $scope.password
        }, function (error, userData) {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
                ref.authWithPassword({
                    email: $scope.email,
                    password: $scope.password
                }, function (error, authData) {
                    if (error) {
                        console.log("Login Failed!", error);
                    } else {
                        console.log("Authenticated successfully with payload:", authData);
                        window.location.href = '/'
                    }
                });
            }
        });
    };
}]);

angularApp.controller("locationCtrl", ["$scope", "$rootScope", "currentAuth", "$document", function ($scope, $rootScope, currentAuth, $document, NgMap) {
    console.log('Location-Services');
    
    
    
     var lat = 0;
     var long = 0;
    
    
    
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
    var map;
    var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var geocoder = new google.maps.Geocoder(); //Used to deal with different types of addressing
    
    
    
    /*
     $scope.initialize = function() {
         var LatLng =  {lat: 41, lng: -85};
        var map = new google.maps.Map(document.getElementById('map'), {
            control: {},
            center: LatLng,
             zoom: 14,
             mapTypeId: google.maps.MapTypeId.ROADMAP
        });
         
         var marker = new google.maps.Marker({
          position: LatLng,
          map: map
        });
        }
        */
        
     
     
    $scope.directions = {
        origin: "",
        destination: "",
        show: false
        
    }
    

    

    

    
    //$scope.getDirections = function () {
    function initMap() {
        var directionRequest = {
            origin: $scope.directions.origin,
            destination: $scope.directions.destination,
             travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        
        var LatLng =  {lat: 41, lng: -85};
        map = new google.maps.Map(document.getElementById('map'), {
            control: {},
            center: LatLng,
             zoom: 14,
             mapTypeId: google.maps.MapTypeId.ROADMAP
        });
         
         var marker = new google.maps.Marker({
          position: LatLng,
          map: map
        });
        
        
        directionsService.route(directionRequest, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directionsList'));
          console.log('Going');
        $scope.directions.show  = true;
      } else {
        alert('Google route unsuccesfull!');
      }
    });
    }
    $scope.getDirections = initMap;
    
}]);