angular.module('app')
  .controller('MainController', function($scope, UserService, CurrentUser, $timeout, TchatService) {
    $scope.user = {};
    $scope.guests = {};
    $scope.guest = undefined;
    $scope.messages = {};
    var userId = CurrentUser.user()._id;

    function compare(a, b) {
      return a - b;
    }

    var timer = $timeout(function() {
      UserService.getOne(userId).then(function(res) {
        $scope.user = res.data;

        UserService.getAffinity($scope.user.score).then(function(res) {
          $scope.guests = res.data;
        });
      });

    }, 500);

    $scope.toGuest = function(guest) {
      $scope.guest = guest;
      let users = {user1:$scope.user._id, user2:guest._id};
      TchatService.read(users).then(function(res) {
        $scope.messages = res.data;
      });

    };

    $scope.send = function(message) {
      let mess = {send:$scope.user._id,read:$scope.guest._id,message:message};
      TchatService.write(mess).then(function(res) {
        console.log(res.data);
        $scope.messages = res.data;
        $scope.message = "";
        // $scope.$apply();
      });

      var box = document.getElementById('box');
box.scrollTop = box.scrollHeight;
    };



  });
