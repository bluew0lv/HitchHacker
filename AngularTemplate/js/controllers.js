//Controllers

angularApp.controller("homeCtrl", ["$scope", "$rootScope", "currentAuth", function($scope, $rootScope, currentAuth) {
    console.log('Home');   
}]);

angularApp.controller("infoCtrl", ["$scope", "$rootScope", "currentAuth", function($scope, $rootScope, currentAuth) {
    console.log('Info');   
}]);

angularApp.controller("termsCtrl", ["$scope", "$rootScope", "currentAuth", function($scope, $rootScope, currentAuth) {
    console.log('Terms');   
}]);

angularApp.controller("testCtrl", ["$scope", "$rootScope", "currentAuth", function($scope, $rootScope, currentAuth) {  
   

    var url = "https://hitchhacker.firebaseio.com/";

var firebaseRef = new Firebase(url);

function funct1()
{
    var title = $('#p-title').text();
    
    var origin = $('#p-origin').text();
    
    var destination = $('#p-destination').text();
    
  var post = $('#p-post').text();

  var date = Date();

  firebaseRef.set({Title: title, Origin: origin, Destination: destination, Post: post, Date: date});
    
  evt.preventDefault();
}

var submit = document.getElementsByTagName('button')[0];

submit.onclick = funct1(evt);
    
    console.log('Test');    
}]);