angular.module('app')
    .controller('MainController', function($scope,UserService,CurrentUser) {
      $scope.user = CurrentUser.user();
      $scope.guests ={};
      userId = CurrentUser.user()._id;
      userScore = CurrentUser.user().score;

      UserService.getAffinity(userScore).then(function(res){
          $scope.guests = res.data;
      });



    });
