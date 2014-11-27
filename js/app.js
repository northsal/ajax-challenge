"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

angular.module('ReviewApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'WEe7fntJiUlRZ7HIcZ1UipyTXOvFipWCmiqJiLGX';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'sZqaJADbizkzKlRE2GGxEHm3fhHLLxQYmqifb26y';
    })
    .controller('ReviewController', function($scope, $http) {
        var tasksUrl = 'https://api.parse.com/1/classes/comments';

        $scope.refreshComments = function () {
            $scope.loading = true;
            $http.get(tasksUrl + '?order=-votes')
                .success(function(responseData) {
                    $scope.comments = responseData.results;

                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }; //$scope.refreshComments()

        $scope.refreshComments();

        $scope.newComment = {score: 0};

        $scope.addComment = function(comment) {
            $scope.inserting = true;
            $http.post(tasksUrl, comment)
                .success(function(responseData) {
                    comment.objectId = responseData.objectId;
                    $scope.comments.push(comment);

                    $scope.newComment={score: 0};
                })
                .error(function(err){
                    console.log(err);
                })
                .finally(function() {

                    $scope.inserting = false;

                });

        };

        $scope.updateTask = function(comment) {
            $scope.updating = true;
            $http.put(tasksUrl + '/' + comment.objectId, comment)
                .success(function(responseData) {

                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });

        };

        $scope.removeComment = function(comment) {
            $http.delete(tasksUrl + '/' + comment.objectId)
                .success(function(responseData) {
                    //delete was successful
                })
                .error(function(err) {
                    //something went wrong
                })
                .finally(function() {
                    $scope.refreshComments();
                });
        };

        $scope.incrementVotes = function(comment, amount) {
            var postData = {
                votes: {
                    __op: "Increment",
                    amount: amount
                }
            };
            $scope.updating = true;
            $http.put(tasksUrl + '/' + comment.objectId, postData)
                .success(function(respData) {
                    comment.votes = respData.votes;
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });
        }
    });
