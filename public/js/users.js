var app = angular.module('app', []);


app.service('userService', ['$http', function ($http) {

    this.isLoggedin = function (a, b) {
        var access_token = localStorage.getItem('access_token');
        return access_token && access_token.length > 0;
    }
    this.saveToken = function (token) {
        localStorage.setItem('access_token', token);
    }
    this.logout = function (token) {
        localStorage.setItem('access_token', '');
    }
    this.login = function (data) {
        return $http.post('/auth/generateToken', data);
    }
    this.getAll = function () {
        var access_token = localStorage.getItem('access_token');
        var req = {
            method: 'get',
            url: '/users/getAll',
            headers: {
                "Content-Type": "application/json",
                'authorization': access_token
            }
        }
        return $http(req);
    }

    this.save = function (data) {
        var access_token = localStorage.getItem('access_token');
        var req = {
            method: 'POST',
            url: '/users/save',
            headers: {
                "Content-Type": "application/json",
                'authorization': access_token
            },
            data: data
        }
        return $http(req);
    }


}]);

app.controller('main-controller', ['$scope', 'userService', function ($scope, userService) {
    $scope.mode = 'view';
    $scope.loginData = {};
    $scope.create = {};
    $scope.isLoading = false;
    $scope.errorMessage = '';
    $scope.users = [];
    $scope.loginUser = JSON.parse(localStorage.getItem('user'));
    $scope.isAdminOptions = [{ 'name': 'Yes', 'value': true }, { 'name': 'No', 'value': false }]
    loadUsers = function () {
        $scope.isLoading = true;
        userService.getAll().then(function (res) {
            $scope.isLoading = false;
            $scope.users = res.data;
        }, function (err) {
            userService.logout();
        });
    }
    $scope.save = function () {
        if ($scope.item.isActive)
            $scope.isLoading = true;
        else
            $scope.isLoadingDelete = true;
        userService.save($scope.item).then(function (res) {
            var saveUser = res.data;
            var filter = $scope.users.filter(r => r.id == saveUser.id);
            if (filter.length > 0) {
                var index = $scope.users.indexOf(filter[0]);
                debugger;
                if (saveUser.isActive)
                    $scope.users[index] = angular.copy(saveUser);
                else
                    $scope.users.splice(index, 1);
            }
            else {
                $scope.users.push(angular.copy(saveUser));
            }
            $scope.mode = 'view';
            $scope.isLoading = false;
            $scope.isLoadingDelete = false;
        }, function (err) {
            $scope.isLoading = false;
            $scope.isLoadingDelete = false;
            $scope.logout();
        })
    }
    $scope.back = function () {
        $scope.mode = 'view';
    }
    $scope.isLoggedin = function () {
        return userService.isLoggedin();
    }
    $scope.login = function () {
        $scope.errorMessage = '';
        $scope.isLoading = true;
        userService.login($scope.loginData).then(function (res) {
            if (res.data.status == 'success') {
                userService.saveToken(res.data.token);
                loadUsers();
            }
            else {
                $scope.errorMessage = 'Invalid Login';
            }
            $scope.isLoading = false;
        });
    }

    $scope.logout = function () {
        userService.logout();
        window.location.href = '/admin.html';
    }
    $scope.open = function (user) {
        $scope.item = angular.copy(user);
        $scope.mode = 'edit';
    }
    $scope.add = function (user) {
        $scope.item = { 'isAdmin': false };
        $scope.mode = 'add';
    }
    $scope.delete = function () {
        if (confirm('Confirm Delete ?')) {
            $scope.item.isActive = false;
            $scope.save();
        }
    }
    $scope.gotoLinks = function(){
        window.location.href = '/admin.html';
    }
    if (userService.isLoggedin())
        loadUsers();
    else
        window.location.href = '/admin.html';
}]);
