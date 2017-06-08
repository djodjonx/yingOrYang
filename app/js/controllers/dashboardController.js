angular.module('app')
  .controller('DashboardController', function($scope, CurrentUser, UserService, QuestionService) {
    var userId = CurrentUser.user()._id;
    var resultat = 0;
    var questions;
    index = 0;
    questionsIndex = 0;
    statistique = [];
    score = 0;
    // question = {
    //   question: ["ici", "la", "la"],
    //   categorie: "film"
    // };

    $scope.question = "";


    function showQuestion(n, i) {


      $scope.question = questions[n].question[i];
      return;
    }

    function arrayObjectIndexOf(myArray, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i].categorie === searchTerm) return i;
    }
    return -1;
}

    function state(value,donnee,compteur){
      compteur += value;
      if (donnee.length === 0) {
        donnee.push({
          categorie: questions[questionsIndex].categorie,
          score: value
        });
      } else {
        var i = arrayObjectIndexOf(donnee, questions[questionsIndex].categorie);
        if (i !== -1){
          donnee[i].score += value;
        }else{
          donnee.push({
                categorie: questions[questionsIndex].categorie,
                score: value
              });
        }

      }
      return;
    }

    $scope.ok = function() {
      state(1,statistique,score);
      if (questionsIndex < questions.length-1) {
        if (index < questions[questionsIndex].question.length - 1) {
          index++;
        } else {
          questionsIndex++;
          index = 0;
        }
        showQuestion(questionsIndex, index);
      } else {
        UserService.update(userId,{score:score, statistique: statistique}).then(function(res){
          console.log(res.data);
        });
        $scope.question = 'fini';
      }

    };
    $scope.nop = function(question) {
      state(0,statistique,score);
      if (questionsIndex < questions.length - 1) {
        if (index < questions[questionsIndex].question.length - 1 && index !== 0) {
          index++;
        } else {
          questionsIndex++;
          index = 0;
        }
        showQuestion(questionsIndex, index);
      } else {
        UserService.update(userId,{score:score, statistique: statistique}).then(function(res){
          console.log(res.data);
        });

        $scope.question = 'fini';
      }
    };
    // QuestionService.create(question).then(function(res) {
    //   console.log(res.data);
    // });
    QuestionService.getAll().then(function(res) {
      questions = res.data;
      showQuestion(questionsIndex, index);
    });
  });
