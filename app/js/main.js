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
        .when("/order/success", {templateUrl: "partials/authorized.html", controller: "authorizedCtrl"})
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
            name: 'PizzaChatka',
            rating: '4.0',
            description: 'Amerykańska',
            url: 'pizzachatka'
        },
        {
            image: 'https://image.flaticon.com/icons/svg/99/99954.svg',
            kod: '30-420',
            name: 'UpalonaPizza',
            rating: '4.0',
            desc: 'Jamajska',
            url: 'upalonapizza'
        },
        {
            image: 'https://cdn1.iconfinder.com/data/icons/universal-mobile-line-icons-vol-9/48/432-512.png',
            kod: '30-069',
            name: 'SpalonaPizzaDotCom',
            rating: '4.0',
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
        item.button.text = 'Dodano!';
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
        console.log('total: ' + total);
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
        console.log($scope.cart);
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
    $scope.paypalButtonVisible = true;
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
            $scope.paypalButtonVisible = false;
            $location.path('/order/success');
            return actions.payment.execute().then(function () {

            });
        }
    };

    $scope.backToCart = function () {
        pizzeriaUrlService.pizzeriaUrl = $scope.url;
        $location.path('/cart');

    }
}]);



