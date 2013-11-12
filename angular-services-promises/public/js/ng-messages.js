angular.module("Messages", [])
    .factory('Message', ["$http", "$q", function($http, $q) {
        var base = '/collections/messages';

        return {
            index: function() {
                var deferred = $q.defer();
                $http.get(base)
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(reason) {
                        deferred.reject(reason);
                    })
                return deferred.promise;
            },

            create: function(text) {
                var deferred = $q.defer();
                $http.post(base, {text: text})
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(reason) {
                        deferred.reject(reason);
                    })
                return deferred.promise;
            },

            update: function(id, text) {
                var deferred = $q.defer();
                $http.put(base + "/" + id, {text: text})
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(reason) {
                        deferred.reject(reason);
                    })
                return deferred.promise;
            },

            remove: function(id) {
                var deferred = $q.defer();
                $http.delete(base + "/" + id)
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function(reason) {
                        deferred.reject(reason);
                    })
                return deferred.promise;
            }
        }
    }])
    .controller("MessageCtrl", ["$scope", "$http", "Message", function ($scope, $http, Message) {
        $scope.messages = [];
        $scope.title = "Send Messages";

        $scope.counter = function () {
            return 140 - ($scope.inputText || "").length;
        };
        $scope.update = function () {
            if (!$scope.targetId) {
                Message.create($scope.inputText)
                    .then(function(data) {
                        $scope.messages.unshift(data);
                        $scope.inputText = "";
                    });
            } else {
                Message.update($scope.targetId, $scope.inputText)
                    .then(function(data) {
                        var i;
                        for (i = 0; i < $scope.messages.length; i++) {
                            if ($scope.messages[i]._id === $scope.targetId) {
                                $scope.messages[i].text = $scope.inputText;
                                break
                            }
                        }
                        $scope.targetId = null;
                        $scope.inputText = "";
                    });
            }
            ;
        };
        $scope.edit = function (index) {
            var message = $scope.messages[index];
            $scope.inputText = message.text;
            $scope.targetId = message._id;
        };
        $scope.remove = function (index) {
            Message.remove($scope.messages[index]._id)
                .then(function (data) {
                    $scope.messages.splice(index, 1);
                })
        };

        // Do the initial page load. Note that although this returns a promise,
        // Angular will insert it into the template automatically when the promise
        // is resolved
        $scope.messages = Message.index()
    }])