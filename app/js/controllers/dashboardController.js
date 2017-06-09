angular.module('app')
  .controller('DashboardController', function($scope, CurrentUser, UserService, QuestionService, $state) {
    var userId = CurrentUser.user()._id;
    resultat = 0;
    questions = {};
    index = 0;
    questionsIndex = 0;
    statistique = [];
    score = 0;


    $scope.question = "";

    function showQuestion(n, i) {
      $scope.question = questions[n].question[i];
      return;
    }

    function arrayObjectIndexOf(myArray, searchTerm) {
      for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i].categorie === searchTerm) {
          return i;
        }
      }
      return -1;
    }

    function state(value, donnee) {
      if (donnee.length === 0) {
        donnee.push({
          categorie: questions[questionsIndex].categorie,
          score: value
        });
      } else {
        var i = arrayObjectIndexOf(donnee, questions[questionsIndex].categorie);
        if (i !== -1) {
          donnee[i].score += value;
        } else {
          donnee.push({
            categorie: questions[questionsIndex].categorie,
            score: value
          });
        }
      }
      return;
    }

    function end() {
      UserService.updateDonnee(userId, {
        score: score,
        statistique: statistique
      }).then(function(res) {
        console.log(res.data);
      });

      $scope.score = score;

      if ($scope.score > 50) {
        swal({
          title: "Bravo !",
          text: "Vous appartenez au Yin ! Nous allons pouvoir vous matcher !",
          imageUrl: "../img/yinyang.png",
          customClass: "changeBgModal",
          confirmButtonText: "Tacitement, GO !",
          confirmButtonColor: "white"
        }, function(isConfirm) {
          if (isConfirm) {
            $state.go('user.home');
          }
        });
      }
      if ($scope.score < 50) {
        swal({
          title: "Bravo !",
          text: "Vous appartenez au Yang, nous allons pouvoir vous matcher !",
          imageUrl: "../img/yinyang.png",
          confirmButtonText: "Tacitement, GO !",
          confirmButtonColor: "white"
        }, function(isConfirm) {
          if (isConfirm) {
            $state.go('user.home');
          }
        });
      }
      if ($scope.score == 50) {
        swal({
          title: "Incroyable !",
          text: "Vous êtes à l'équilibre du Yin et du Yang, nous allons pouvoir vous matcher !",
          imageUrl: "../img/yinyang.png",
          customClass: "gradientModal",
          confirmButtonText: "Tacitement, GO !",
          confirmButtonColor: "white"
        }, function(isConfirm) {
          if (isConfirm) {
            $state.go('user.home');
          }
        });
      }
    }

    $scope.ok = function() {
      if (index === 0) {
        score += 2;
      }
      score += 1;
      state(1, statistique);
      if (questionsIndex < questions.length - 1) {
        if (index < questions[questionsIndex].question.length - 1) {
          index++;
        } else {
          questionsIndex++;
          index = 0;
        }
        showQuestion(questionsIndex, index);
      } else {
        end();
      }

    };
    $scope.nop = function(question) {
      score += 0;
      state(0, statistique);
      if (questionsIndex < questions.length - 1) {
        if (index < questions[questionsIndex].question.length - 1 && index !== 0) {
          index++;
        } else {
          questionsIndex++;
          index = 0;
        }
        showQuestion(questionsIndex, index);
      } else {
        end();
      }
    };

    QuestionService.getAll().then(function(res) {
      questions = res.data;
      showQuestion(questionsIndex, index);
    });
  });
