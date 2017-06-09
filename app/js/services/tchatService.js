angular.module('app')
    .service('TchatService', function($http) {
        return {

            write: function(messages) {
                return $http.put('/tchats/write', messages);
            },
            read: function(users) {
                return $http.put('/tchats/read' , users);
            }
        };
    });
