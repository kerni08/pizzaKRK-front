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
        .when("/p/:id", {templateUrl: "partials/pizzeria.html", controller: "PageCtrl"})
        .when("/p/:id/:pid", {templateUrl: "partials/addPizza.html", controller: "PageCtrl"})
        .when("/cart", {templateUrl: "/partials/cart.html", controller: "PageCtrl"})
        .when("/?text=:zipCode", {templateUrl: "/partials/pizzeriaList.html", controller: "PizzeriaListCtrl"})
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

app.controller('zipCodeController', ['$scope', $location, function($scope, $location) {
    $scope.zipCode = '';
    $scope.text = 'Wpisz adres pocztowy np. 30-069';
    $scope.submit = function () {
        if ($scope.text) {
            $scope.zipCode.push(this.text);
            $scope.text = '';
        }
        $location.path('/cart');
    }

}]);

app.controller('PizzeriaListCtrl', function($scope){
    $scope.zipCode = $routeProvider.zipCode;
})

// The controller

function InstantSearchController($scope) {

    // TO DO AJAX jak dostane bazy
    $scope.items = [
        {image: 'https://cdn0.iconfinder.com/data/icons/restaurant-53/64/Food-junk-pizza-fast_food-512.png', kod: '30-069', title: 'PizzaChatka', score: '4.0', description: 'Amerykańska', url: '#/p/pizzachatka'},
        {image: 'https://image.flaticon.com/icons/svg/99/99954.svg', kod: '30-420', title: 'UpalonaPizza', score: '4.0', desc: 'Jamajska', url: '#/p/upalonapizza'},
        {image: 'https://cdn1.iconfinder.com/data/icons/universal-mobile-line-icons-vol-9/48/432-512.png', kod: '30-069', title: 'SpalonaPizzaDotCom', score: '4.0', description: 'Polska', url: '#/p/spalonapizzzadotcom'}
    ];

}
function InstantCartController($scope) {

    // TO DO AJAX jak dostane bazy
    $scope.items = [
        {id: 1, name: 'Pizza Margherita', data: 'mozarella, sos pomidorowy', price: 18.00},
        {id: 2, name: 'Pizza Pepperoni', data: 'mozarella, sos pomidorowy, pepperoni', price: 27.00},
        {id: 3, name: 'Pizza Caprriciossa', data: 'mozarella, sos pomidorowy, szynka', price: 25.00},
    ];

}








