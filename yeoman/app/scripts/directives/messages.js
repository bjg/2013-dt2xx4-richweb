'use strict';

angular.module('yeomanApp')
    .directive('messageSender', function () {
        return {
            template: '<get-message></get-message><list-messages></list-messages>',
            restrict: 'EA',
            controller: function() {
                this.messages = [];

                this.create = function(message) {
                    this.messages.unshift(message);
                };
            }
        };
    })
    .directive('getMessage', function () {
        return {
            templateUrl: 'views/getMessage.html',
            restrict: 'EA',
            require: "^messageSender",
            link: function postLink(scope, element, attrs, messageSenderCtrl) {
                scope.save = function() {
                    messageSenderCtrl.create(scope.messageText);
                    scope.messageText = "";
                };
            }
        };
    })
    .directive('listMessages', function () {
        return {
            templateUrl: 'views/listMessages.html',
            restrict: 'EA',
            require: "^messageSender",
            link: function postLink(scope, element, attrs, messageSenderCtrl) {
                scope.messages = messageSenderCtrl.messages;
            }
        };
    })