//Controllers
angularApp.controller("homeCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Home');
}]);

angularApp.controller("infoCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Info');

    var authData = $rootScope.fb.getAuth();
    $scope.todos = [];
    $scope.blocked = [];

    $scope.pullBlocked = function () {
        $scope.blocked = [];
        $rootScope.fb.child("users").child(authData.uid).child("blocked").on("child_added", function (snapshot, prevChildKey) {
            var snap = snapshot.val();
            if ($scope.blocked.length > 0) {
                angular.forEach($scope.blocked, function (blckd) {
                    if (!(blckd.uid == snap.user)) {
                        $scope.blocked.push({
                            uid: snap.user
                        });
                        console.log("Block list updated!" + snap.user);
                        console.log($scope.blocked.length);
                    }
                })
            } else {
                $scope.blocked.push({
                    uid: snap.user
                });
                console.log("Block list updated!" + snap.user);
                console.log($scope.blocked.length);
            }
        });
    };

    $scope.pullUsers = function () {
        $scope.todos = [];
        $scope.pullBlocked();
        $rootScope.fb.child("users").on("child_added", function (snapshot, prevChildKey) {
            var newPost = snapshot.val();
            console.log(snapshot.key());
            console.log("Name:" + newPost.fname + ' ' + newPost.lname);
            if (!(authData.uid == snapshot.key())) {
                var isBlocked = $scope.blocked.some(function (blckd) {
                    return snapshot.key() == blckd.uid
                })
                var alreadyShown = $scope.todos.some(function (todo) {
                    return snapshot.key() == todo.uid
                })
                if (!isBlocked) {
                    if (!alreadyShown) {
                        $scope.todos.push({
                            uid: snapshot.key(),
                            name: newPost.fname + ' ' + newPost.lname
                        })
                    }
                } else {
                    console.log("User is blocked list");
                }
            }
        })
    };

    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.todos, function (todo) {
            count += todo.blocked ? 0 : 1;
        });
        return count;
    };

    $scope.archive = function () {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function (todo) {
            if (todo.blocked) {
                var ref = $rootScope.fb.child("users").child(authData.uid).child("blocked");
                var newRef = ref.push();
                newRef.set({
                    user: todo.uid
                });
            }
        });
        $scope.pullUsers();
    };
}]);

angularApp.controller("profileUCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Test');
}]);

angularApp.controller("forumCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('forum');

    var authData = $rootScope.fb.getAuth();
    var userRef = $rootScope.fb.child("forum");


    $scope.getUsers = function () {
        $scope.pullBlocked();
        $rootScope.fb.child("users").on("child_added", function (snapshot, prevChildKey) {
            var snap = snapshot.val();
            angular.forEach($scope.blocked, function (todo) {
                if (!(todo.uid == snapshot.key()) && !(authData.uid == snapshot.key())) {
                    $scope.todos.push({
                        uid: snapshot.key(),
                        name: snap.fname + " " + snap.lname,
                        blocked: false
                    })
                }
            });
        })
    };

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
    };
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
        var day = $scope.dob.split('/')[1];
        var month = $scope.dob.split('/')[0];
        var year = $scope.dob.split('/')[2];
        var age = 18;
        var mydate = new Date();
        mydate.setFullYear(year, month - 1, day);

        var currdate = new Date();
        var setDate = new Date();
        setDate.setFullYear(mydate.getFullYear() + age, month - 1, day);

        if ($scope.password == $scope.cpassword) {
            if ((currdate - setDate) > 0) {
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

                        ref.child("users").child(userData.uid).set({
                            email: $scope.email,
                            fname: $scope.fname,
                            lname: $scope.lname,
                            dob: $scope.dob
                        });
                    }
                });
            } else {
                alert("under 18");
                window.location.href = '/';
            }
        } else {
            alert("Passwords do not Match");
        }
    };
}]);

angularApp.controller("termsCtrl", ["$scope", "$rootScope", "currentAuth", function ($scope, $rootScope, currentAuth) {
    console.log('Terms');
}]);