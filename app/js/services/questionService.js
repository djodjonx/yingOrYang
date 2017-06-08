angular.module('app')
    .service('QuestionService', function($http) {
        return {
            create: function(question) {
                return $http.post('/questions',question);
            },
            getAll: function() {
                return $http.get('/questions');
            },
            getOne: function(id) {
                return $http.get('/questions/' + id);
            },
            update: function(id, user) {
                return $http.put('/questions/' + id, user);
            },
            delete: function(id) {
                return $http.delete('/questions/' + id);
            }
        };
    });
