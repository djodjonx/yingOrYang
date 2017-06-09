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
        $scope.labels = [$scope.user.statistique[0].categorie,$scope.user.statistique[1].categorie,$scope.user.statistique[2].categorie,$scope.user.statistique[3].categorie];
        $scope.data1 = [$scope.user.statistique[0].score,$scope.user.statistique[1].score,$scope.user.statistique[2].score,$scope.user.statistique[3].score];
        $scope.colors1 = ['#ffffff'];
        UserService.getAffinity($scope.user.score).then(function(res) {
          $scope.guests = res.data;
        });
      });

    }, 500);

    $scope.toGuest = function(guest) {
      $scope.guest = guest;
      console.log(guest);
      $scope.data2 = [$scope.guest.statistique[0].score,$scope.guest.statistique[1].score,$scope.guest.statistique[2].score,$scope.guest.statistique[3].score];
      $scope.colors2 = ['#080808'];
      let users = {
        user1: $scope.user._id,
        user2: guest._id
      };
      TchatService.read(users).then(function(res) {
        $scope.messages = res.data;
      });


    };

    $scope.send = function(message) {
      let mess = {
        send: $scope.user._id,
        read: $scope.guest._id,
        message: message
      };
      TchatService.write(mess).then(function(res) {
        $scope.messages = res.data;
        $scope.message = "";
      });
    };



  });
