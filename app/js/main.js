/**
 * Main AngularJS Web Application
 */
var app = angular.module('pizzaPortalApp', ['ngRoute']);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    // Home
        .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
        // Pages
        .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
        .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
        .when("/pizzeriaList", {templateUrl: "partials/pizzeriaList.html", controller: "PageCtr"})
        .when("/p/:id", {templateUrl: "partials/pizzeria.html", controller: "PizzeriaCtrl"})
        .when("/p/:id/:pid", {templateUrl: "partials/addPizza.html", controller: "PageCtrl"})
        .when("/cart", {templateUrl: "/partials/cart.html", controller: "CartCtrl"})
        .when("/pizzeriaList", {templateUrl: "/partials/pizzeriaList.html", controller: "PizzeriaListCtrl"})
        .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});

}]);


/**
 * Controls all other Pages
 */
app.controller('PageCtrl', function (/* $scope, $location, $http */) {
    console.log("Page Controller reporting for duty.");
    // Activates Tooltips for Social Links
    $('.tooltip-social').tooltip({
        selector: "a[data-toggle=tooltip]"
    })
});

app.service('zipCodeService', function () {
    zipCode = '';
    return {zipCode};
});
app.service('pizzeriaUrlService', function () {
    pizzeriaUrl = '';
    return {pizzeriaName: pizzeriaUrl};
});
app.service('cartService', function () {
    return {cart: []};
});

app.controller('zipCodeController', ['$scope', '$location', 'zipCodeService', function ($scope, $location, zipCodeService) {
    $scope.text = '';
    $scope.submit = function () {

        if ($scope.text) {
            zipCodeService.zipCode = this.text;
            $scope.text = '';
        }
        $location.path('/pizzeriaList');
    }

}]);

app.controller('PizzeriaListCtrl', ['$scope', '$location', 'zipCodeService', 'pizzeriaUrlService', function ($scope, $location, zipCodeService, pizzeriaUrlService) {
    $scope.zipCode = zipCodeService.zipCode;
    $scope.items = [
        {
            image: 'https://cdn0.iconfinder.com/data/icons/restaurant-53/64/Food-junk-pizza-fast_food-512.png',
            kod: '30-069',
            title: 'PizzaChatka',
            score: '4.0',
            description: 'Amerykańska',
            url: 'pizzachatka'
        },
        {
            image: 'https://image.flaticon.com/icons/svg/99/99954.svg',
            kod: '30-420',
            title: 'UpalonaPizza',
            score: '4.0',
            desc: 'Jamajska',
            url: 'upalonapizza'
        },
        {
            image: 'https://cdn1.iconfinder.com/data/icons/universal-mobile-line-icons-vol-9/48/432-512.png',
            kod: '30-069',
            title: 'SpalonaPizzaDotCom',
            score: '4.0',
            description: 'Polska',
            url: 'spalonapizzzadotcom'
        }
    ];
    $scope.redirect = function (url) {
        pizzeriaUrlService.pizzeriaUrl = url;
        $location.path('/p/' + url);
    }

}]);

app.controller('PizzeriaCtrl', ['$scope', 'cartService', 'pizzeriaUrlService', function ($scope, cartService, pizzeriaUrlService) {
    $scope.name = pizzeriaUrlService.pizzeriaUrl;
    $scope.items = [
        {id: 1, name: 'Pizza Margherita', data: 'mozarella, sos pomidorowy', price: 18.00},
        {id: 2, name: 'Pizza Pepperoni', data: 'mozarella, sos pomidorowy, pepperoni', price: 27.00},
        {id: 3, name: 'Pizza Caprriciossa', data: 'mozarella, sos pomidorowy, szynka', price: 25.00},
    ];
    $scope.addToCart = function(id) {
        cartService.cart.push(id);
    }

}]);

app.controller('CartCtrl', ['$scope', 'cartService', function ($scope, cartService) {
    $scope.cart = cartService.cart;


}]);










