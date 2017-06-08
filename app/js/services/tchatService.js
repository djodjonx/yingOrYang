angular.module('app')
    .service('TchatService', function($http) {
        return {

            write: function(user,guest,message) {
                return $http.put('/tchats/', {users:[user,guest],message:message});
            },
            read: function(user,guest) {
              console.log(user,guest);
                return $http.get('/tchats/' +[user,guest]);
            }
        };
    });
