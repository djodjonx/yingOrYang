angular.module('app')
    .controller('MainController', function($scope,UserService,CurrentUser,$timeout, TchatService) {
      $scope.user = {};
      $scope.guests ={};
      $scope.guest= undefined;
      $scope.messages={};
      var userId = CurrentUser.user()._id;


      var timer = $timeout(function() {
        UserService.getOne(userId).then(function(res){
          $scope.user = res.data;

          UserService.getAffinity($scope.user.score).then(function(res){
            console.log(res.data);
            $scope.guests = res.data;
          });
        });

    }, 500);

    $scope.toGuest= function(guest){
      $scope.guest=guest;
      console.log(guest);
      // TchatService.read($scope.user._id,guest._id).then(function(res){
      //   console.log(res.data);
      //   $scope.messages = res.data;
      // });

    };

    $scope.send = function(message){
      TchatService.write($scope.user._id,$scope.guest._id,message).then(function(res){
        console.log(res.data);
        $scope.messages = res.data;
      });
    };



    });
