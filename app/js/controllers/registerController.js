angular.module('app')
    .controller('RegisterController', function($scope, $state, Auth) {
        $scope.register = function() {
          console.log($scope.user);
            Auth.register($scope.user).then(function() {
                $state.go('anon.home');
            });
        };
    });
