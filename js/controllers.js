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

    var ref = new Firebase('https://danielstestdatabase.firebaseio.com/');

    $scope.newTrip = function () {
        var authData = ref.getAuth();
        var userRef = ref.child("forum");

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
        var authData = ref.getAuth();
        ref.child("forum").on("child_added", function (snapshot, prevChildKey) {
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

    $scope.isLogin = function () {
        var ref = new Firebase("https://danielstestdatabase.firebaseio.com");
        var authData = ref.getAuth();
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            return true;
        } else {
            console.log("User is logged out");
            return false;
        }
    }

    $scope.changeEmail = function () {
        var ref = new Firebase("https://danielstestdatabase.firebaseio.com");
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
        var ref = new Firebase("https://danielstestdatabase.firebaseio.com");
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
        var ref = new Firebase("https://danielstestdatabase.firebaseio.com");
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

    $scope.isLogin = function () {
        var ref = new Firebase("https://danielstestdatabase.firebaseio.com");
        var authData = ref.getAuth();
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            return true;
        } else {
            console.log("User is logged out");
            return false;
        }
    }

    $scope.logout = function () {
        var ref = new Firebase("https://danielstestdatabase.firebaseio.com");
        ref.unauth();
    }
}]);

angularApp.controller("loginCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Login');

    $scope.forgotPassword = false;

    $scope.message = function () {
        var shide = "Forgot Password";
        if ($scope.forgotPassword) {
            shide = "Cancel";
        }
        return shide;
    };

    $scope.resetPassword = function () {
        var ref = new Firebase("https://danielstestdatabase.firebaseio.com");
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
        var ref = new Firebase("https://danielstestdatabase.firebaseio.com");
        ref.authWithPassword({
            email: $scope.email,
            password: $scope.password
        }, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    };

    $scope.isVisible = function () {
        $scope.forgotPassword = $scope.forgotPassword ? false : true;
    }

}]);

angularApp.controller("registerCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Register');

    $scope.createUser = function () {
        var ref = new Firebase("https://danielstestdatabase.firebaseio.com");

        ref.createUser({
            email: $scope.email,
            password: $scope.password
        }, function (error, userData) {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
            }
        });
    };
}]);