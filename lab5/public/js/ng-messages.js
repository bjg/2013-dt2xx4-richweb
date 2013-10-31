angular.module("Messages", [])
  .controller("MessageCtrl", ["$scope", "$http", function($scope, $http) {
    $scope.title = "Send Messages";

    $scope.counter = function() {
      return 140 - ($scope.inputText || "").length;
    };
    $scope.update = function() {
      if (!$scope.targetId) {
        $http.post('/collections/messages', {text: $scope.inputText})
          .success(function(data, status, headers, config) {
            $scope.messages.unshift(data);
            $scope.inputText = "";
          });
      } else {
        $http.put('/collections/messages/' + $scope.targetId, {text: $scope.inputText})
          .success(function(data, status, headers, config) {
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
      };
    };
    $scope.edit = function(index) {
      var message = $scope.messages[index];
      $scope.inputText = message.text;
      $scope.targetId = message._id;
    };
    $scope.remove = function(index) {
      $http.delete('/collections/messages/' + $scope.messages[index]._id)
        .success(function(data, status, headers, config) {
          $scope.messages.splice(index, 1);
        })
    };

    // Do the initial page load
    $http.get('/collections/messages')
      .success(function(data, status, headers, config) {
        $scope.messages = data;
      })
  }])