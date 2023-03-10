var app = angular.module('app', []);


app.service('loginService', ['$http', function ($http) {

    this.isLoggedin = function (a, b) {
        var access_token = localStorage.getItem('access_token');
        return access_token && access_token.length > 0;
    }
    this.saveToken = function (token) {
        localStorage.setItem('access_token', token);
    }
    this.saveUser = function (user) {
        localStorage.setItem('user', JSON.stringify(user));
    }
    this.getLogin = function (user) {
        return JSON.parse(localStorage.getItem('user'));
    }
    this.logout = function (token) {
        localStorage.setItem('access_token', '');
    }
    this.login = function (data) {
        return $http.post('/auth/generateToken', data);
    }
    this.createLink = function (data) {
        var access_token = localStorage.getItem('access_token');
        var req = {
            method: 'POST',
            url: '/create',
            headers: {
                "Content-Type": "application/json",
                'authorization': access_token
            },
            data: data
        }
        return $http(req);
    }

}]);

app.controller('main-controller', ['$scope', 'loginService', function ($scope, loginService) {
    $scope.loginData = {};
    $scope.create = {};
    $scope.isLoading = false;
    $scope.errorMessage = '';
    $scope.isLoggedin = function () {
        return loginService.isLoggedin();
    }
    $scope.loggedInUser = loginService.getLogin();
    $scope.login = function () {
        $scope.errorMessage = '';
        $scope.isLoading = true;
        loginService.login($scope.loginData).then(function (res) {
            if (res.data.status == 'success') {
                loginService.saveToken(res.data.token);
                loginService.saveUser(res.data.user);
                $scope.loggedInUser = res.data.user;
            }
            else {
                $scope.errorMessage = 'Invalid Login';
            }
            $scope.isLoading = false;
        });
    }
    $scope.gotoUsers = function(){
        window.location.href = '/users.html';
    }
    $scope.logout = function () {
        loginService.logout();
    }
    $scope.createLink = function () {
        $scope.isLoading = true;
        loginService.createLink($scope.create).then(function (res) {
            debugger;
            $scope.shortUrl = res.data.url;           
            $scope.isLoading = false;
            navigator.clipboard.writeText(res.data.url);
        },function(){
            $scope.isLoading = false;
            loginService.logout();
        })
    }
}]);
