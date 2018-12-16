/**
 * Main AngularJS Web Application
 */


paypal.Button.driver('angular', window.angular);

var app = angular.module('pizzaKrakowApp', ['ngRoute', 'paypal-button']);


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

        .when("/p/:id", {templateUrl: "partials/pizzeria.html", controller: "PizzeriaCtrl"})
        .when("/cart", {templateUrl: "/partials/cart.html", controller: "CartCtrl"})
        .when("/pizzeriaList", {templateUrl: "/partials/pizzeriaList.html", controller: "PizzeriaListCtrl"})
        .when("/order", {templateUrl: "/partials/order.html", controller: "OrderCtrl"})
        .when("/order/success", {templateUrl: "partials/orderInfo.html", controller: "OrderInfoCtrl"})
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
    var zipCode = '';
    return zipCode;
});
app.service('pizzeriaUrlService', function () {
    var pizzeriaUrl =  '';
    return pizzeriaUrl;
});
app.service('cartService', function () {
    return {cart: []};
});

app.service('orderTotalPriceService', function () {
    var total = 0;
    return total;
});


app.constant("zipPattern", {
    zip: /30-\d{3}/,
    zipNotInKrakow: /\d{2}-\d{3}/
});

app.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
        '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
        '\u2605' +
        '</li>' +
        '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue - 0.99
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    };
});


app.controller('ZipCodeController', ['$scope', '$location', 'zipCodeService', 'zipPattern', function ($scope, $location, zipCodeService, zipPattern) {
    $scope.text = '';
    $scope.message = 'Wyszukaj pizzerie w Twojej okolicy!';
    $scope.submit = function () {

        if ($scope.text.match(zipPattern.zip)) {
            zipCodeService.zipCode = this.text;
            $scope.text = '';
            $location.path('/pizzeriaList');
        }
        if ($scope.text.match(zipPattern.zipNotInKrakow)) {
            $scope.message = "Niestety, obsługujemy tylko Kraków.";
        }
        else{
            $scope.message = "Wpisz poprawny kod pocztowy!";
        }
    }

}]);

app.controller('PizzeriaListCtrl', ['$scope', '$location', 'zipCodeService', 'pizzeriaUrlService', function ($scope, $location, zipCodeService, pizzeriaUrlService) {
    $scope.zipCode = zipCodeService.zipCode;
    $scope.items = [
        {
            id: 1,
            image: './resources/templatePizzeriaIcon.png',
            kod: '30-069',
            name: 'PizzaChatka',
            rating: '3.99',
            description: 'Amerykańska'
        },
        {
            id: 2,
            image: './resources/templatePizzeriaIcon.png',
            kod: '30-420',
            name: 'UpalonaPizza',
            rating: '4.0',
            description: 'Jamajska'
        },
        {
            id: 3,
            image: './resources/templatePizzeriaIcon.png',
            kod: '30-069',
            name: 'SpalonaPizzaDotCom',
            rating: '2.47',
            description: 'Polska'
        }
    ];
    $scope.redirect = function (id) {
        pizzeriaUrlService.pizzeriaUrl = id;
        $location.path('/p/' + id);
    }

}]);

app.controller('PizzeriaCtrl', ['$scope', '$http', 'cartService', 'pizzeriaUrlService', function ($scope, $http, cartService, pizzeriaUrlService) {
    $scope.url = pizzeriaUrlService.pizzeriaUrl;

    $scope.items = [
        {id: 1, name: 'Pizza Margherita', data: 'mozarella, sos pomidorowy', price: 18.00, quantity: 1, button: {disabled: false, text: 'Dodaj do koszyka'}},
        {id: 2, name: 'Pizza Pepperoni', data: 'mozarella, sos pomidorowy, pepperoni', price: 27.00, quantity: 1,  button: {disabled: false, text: 'Dodaj do koszyka'}},
        {id: 3, name: 'Pizza Caprriciossa', data: 'mozarella, sos pomidorowy, szynka', price: 25.00, quantity: 1,  button: {disabled: false, text: 'Dodaj do koszyka'}}
    ];


    $scope.setup = {
        min: 1,
        max: 10
    };


    $scope.increase = function (item) {
        if (item.quantity < $scope.setup.max)
            item.quantity++;
    };

    $scope.decrease = function (item) {
        if (item.quantity > $scope.setup.min)
            item.quantity--;
    };

    $scope.removeFromCart = function (item) {
        item.button.disabled = false;
        item.button.text = 'Dodaj do koszyka!';
        var index = cartService.cart.indexOf(item);
        cartService.cart.splice(index, 1);
    };

    $scope.addToCart = function (item) {
        item.button.disabled = true;
        item.button.text = 'Dodano do koszyka!';
        cartService.cart.push(item);
    };


}]);


app.controller('CartCtrl', ['$scope', '$location', 'cartService', 'pizzeriaUrlService', 'orderTotalPriceService', function ($scope, $location, cartService, pizzeriaUrlService, orderTotalPriceService) {
    $scope.cart = cartService.cart;
    $scope.url = pizzeriaUrlService.pizzeriaUrl;
    $scope.setup = {
        min: 0,
        max: 10
    };

    $scope.getCost = function (item) {
        return item.quantity * item.price;
    };

    $scope.getTotal = function () {
        var total = _.reduce($scope.cart, function (sum, item) {
            return sum + $scope.getCost(item);
        }, 0);
        return total;
    };

    $scope.increase = function (item) {
        if (item.quantity < $scope.setup.max)
            item.quantity++;
    };

    $scope.decrease = function (item) {
        if (item.quantity > $scope.setup.min)
            item.quantity--;
    };

    $scope.removeFromCart = function (item) {
        var index = $scope.cart.indexOf(item);
        $scope.cart.splice(index, 1);
    };

    $scope.clearCart = function () {
        $scope.cart.length = 0;
    };

    $scope.backToPizzeriaPage = function () {
        pizzeriaUrlService.pizzeriaUrl = $scope.url;
        cartService.cart = $scope.cart;
        $location.path('/p/' + $scope.url);
    };

    $scope.sendOrder = function () {
        cartService.cart = $scope.cart;
        orderTotalPriceService.total = $scope.getTotal();
        $location.path('/order');
    };
}]);

app.controller('OrderCtrl', ['$scope', '$location', 'cartService', 'pizzeriaUrlService', 'orderTotalPriceService', function ($scope, $location, cartService, pizzeriaUrlService, orderTotalPriceService) {
    $scope.url = pizzeriaUrlService.url;
    $scope.formSubmitted = false;
    $scope.submitButtonVisible = true;
    $scope.opts = {
        env: 'sandbox',
        client: {
            sandbox: 'AcC_M-9lCUofkzdLyffgu-dboRIKk97zEf4_jflXTthNf6KWPXxJmtT3f3J1ZUMoKfCzerA8F2ms3Jy3',
            production: '<insert production client id>'
        },
        payment: function () {
            var env = $scope.opts.env;
            var client = $scope.opts.client;
            return paypal.rest.payment.create(env, client, {
                transactions: [
                    {
                        amount: {total: orderTotalPriceService.total, currency: 'PLN'}
                    }
                ]
            });
        },
        commit: true, // Optional: show a 'Pay Now' button in the checkout flow
        onAuthorize: function (data, actions) {
            $scope.formSubmitted = false;
            $location.path('/order/success');
            //POST user
            return actions.payment.execute().then(function () {
            });
        }
    };

    $scope.submit = function (){
        $scope.formSubmitted = true;
        $scope.submitButtonVisible = false;
    };

    $scope.edit = function() {
        $scope.formSubmitted = false;
        $scope.submitButtonVisible = true;
    };
    $scope.backToCart = function () {
        pizzeriaUrlService.pizzeriaUrl = $scope.url;
        $location.path('/cart');

    }
}]);

app.controller('OrderInfoCtrl', ['$scope', function ($scope) {
    $scope.info = "Twoje zamówienie zostało złożone.";
    $scope.status = "delivered"; // http get to get order status
    $scope.opinion = false;
    $scope.rating = 1;
    $scope.comment = '';



    if($scope.status == "submitted")
        $scope.info = "Twoje zamówienie zostało złożone.";
    if($scope.status == "accepted")
        $scope.info = "Twoje zamówienie zostało zaakceptowane.";
    if($scope.status == "delivery")
        $scope.info = "Twoje zamówienie jest w trakcie dostawy.";
    if($scope.status == "delivered") {
        $scope.info = "Twoje zamówienie zostało dostarczone! Podziel sie swoją opinią poniżej.";
        $scope.opinion = true;
    }

    $scope.submit = function(){
        $scope.status = this.text;
        $scope.$apply
        console.log($scope.status);
        if($scope.status == 'submitted')
            $scope.info = "Twoje zamówienie zostało złożone.";
        if($scope.status == "accepted")
            $scope.info = "Twoje zamówienie zostało zaakceptowane.";
        if($scope.status == 'delivery')
            $scope.info = "Twoje zamówienie jest w trakcie dostawy.";
        if($scope.status == 'delivered') {
            $scope.info = "Twoje zamówienie zostało dostarczone! Podziel sie swoją opinią poniżej.";
            $scope.opinion = true;
        }
    };

    $scope.getSelectedRating = function (rating) {
        $scope.rating = rating;
    };

    $scope.submitOpinion = function(){
        console.log("POST TO BACKEND rating:" + $scope.rating + " comment: " + $scope.comment);
    };


}]);

