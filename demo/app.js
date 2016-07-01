var app = angular.module("TrackerApp", ["ngGeolocation", "ngRoute", "firebase"])

app.config(function($routeProvider) {
  $routeProvider.when("/", {
    templateUrl: "template/login.html"
  })
  $routeProvider.when("/sign", {
    templateUrl: "template/signUp.html"
  })
  $routeProvider.when("/track", {
    templateUrl: "template/track.html" 
  })
});

app.controller('LoginController', function($scope, $http, $firebaseObject){
  $scope.input3 = $scope.input4 = "";

  $scope.checkInputs = function () {
    var email_format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if ($scope.input3.match(email_format) && $scope.input4.length>=6) {
      console.log("ok");
      $scope.checkInputs = false;
    }
    else {
      console.log("not ok");
      if ($scope.input3.match(email_format) === null) {
        $scope.error3 = "Type a valid email address";
      }
      if ($scope.input4.length < 6) {
        $scope.error4 = "Your password should be greater than 6 characters";
      }
    }
  }

  firebase.auth().signInWithEmailAndPassword($scope.input3, $scope.input4).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
})

  // $scope.authObj.$signInWithEmailAndPassword("my@email.com", "password").then(function(firebaseUser) {
  //   console.log("Signed in as:", firebaseUser.uid);
  // }).catch(function(error) {
  //   console.error("Authentication failed:", error);
  // });

});

app.controller('SignController', function($scope, $http, $firebaseObject){

  $scope.input3 = $scope.input4 = "";

  $scope.checkInputs = function () {
    var email_format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if ($scope.input3.match(email_format) && $scope.input4.length>=6) {
      console.log("ok");
      firebase.auth().createUserWithEmailAndPassword($scope.input3, $scope.input4).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(error);
  // ...
});
      // $scope.checkInputs = false;
      $location.path("/track");
    }
    else {
      console.log("not ok");
      if ($scope.input3.match(email_format) === null) {
        $scope.error3 = "Type a valid email address";
      }
      if ($scope.input4.length < 6) {   
        $scope.error4 = "Your password should be greater than 6 characters";
      }
    }
  }


});



app.controller('AppController', function($scope, $geolocation, $http, $firebaseObject){
  var ref = firebase.database().ref().child("location");
  // var syncObject = $firebaseObject(ref);
  // syncObject.$bindTo($scope, "location");

  // var latitudeRef = firebase.database().ref().child("location1");
  // // var longitudeRef = firebase.database().ref().child("location2");
  // // $scope.location1 = $firebaseArray(latitudeRef);
  // // $scope.location2 = $firebaseArray(longitudeRef);
  // var syncObject = $firebaseObject(latitudeRef);
  // syncObject.$bindTo($scope, "location1");

  $scope.$geolocation = $geolocation

    // basic usage
    $geolocation.getCurrentPosition().then(function(location) {
      $scope.location = location;
      var locObj = $firebaseObject(ref);
      locObj.lat = location.coords.latitude;
      locObj.lon = location.coords.longitude;
      locObj.$save();

    });

    // regular updates
    $geolocation.watchPosition({
      timeout: 60000,
      maximumAge: 2,
      enableHighAccuracy: true
    });
    console.log($geolocation);
    $scope.coords = $geolocation.position.coords; // this is regularly updated
    $scope.error = $geolocation.position.error; // this becomes truthy, and has 'code' and 'message' if an error occurs
  });