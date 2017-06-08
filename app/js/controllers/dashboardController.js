angular.module('app')
  .controller('DashboardController', function($scope, CurrentUser, UserService, QuestionService) {
    var userId = CurrentUser.user()._id;
    resultat = 0;
    questions = {};
    index = 0;
    questionsIndex = 0;
    statistique = [];
    score = 0;
    // question = {
    //   question: ["Ceci est la question numéro 1", "2", "3"],
    //   categorie: "film"
    // };
    // QuestionService.create(question).then(function(res) {
    //   console.log(res.data);
    // });

    $scope.question = "";

    function showQuestion(n, i) {
      $scope.question = questions[n].question[i];
      return;
    }

    function arrayObjectIndexOf(myArray, searchTerm) {
      for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i].categorie === searchTerm) return i;
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

    function end (){
      UserService.updateDonnee(userId, {
        score: score,
        statistique: statistique
      }).then(function(res) {
        console.log(res.data);
      });

      $scope.question = 'fini';

    }

    $scope.ok = function() {
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
