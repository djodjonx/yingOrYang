angular.module('app')
    .service('UserService', function($http) {
        return {
            getAll: function() {
                return $http.get('/users');
            },
            getOne: function(id) {
                return $http.get('/users/' + id);
            },
            updateDonnee: function(id, donnee) {
                return $http.put('/users/' + id, donnee);
            },
            delete: function(id) {
                return $http.delete('/users/' + id);
            }
        };
    });
