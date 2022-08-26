document.addEventListener('alpine:init', () => {

    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {

            pizzas: [],
            username: '',
            cartId: '',
            cart: { total: 0.00 },
            paymentMessege: '',
            payNow: false,
            paymentAmount: 0,
            message: '',

            init() {
                axios.get('https://pizza-cart-api.herokuapp.com/api/pizzas', {
                    params: {
                        limit: 50
                    }
                })
                    .then((result) => {
                        const list = result.data.pizzas;

                        // this.pizzas is declared on you AlpineJS Widget.
                        this.pizzas = list;
                    })
                    .then(() => {
                        return this.createCart();

                    })
                    .then((result) => {
                        this.cartId = result.data.cart_code;

                    })
            },
            createCart() {
                return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
            },
            createImg(pizza) {
                return `./images/${pizza.size}.png`;
            },

            showCart() {
                const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

                axios.get(url)
                    .then((result) => {
                        this.cart = result.data;
                    });
            },

            add(pizza) {
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }
                axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                    .then(() => {
                        this.message = "pizza added to the cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));
            },



            remove(pizza) {

                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }

                axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                    .then(() => {
                        this.message = "pizza removed to the cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));

            },


            
            pay() {
                const params = {
                    cart_code: this.cartId,
                }

                axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
                    .then(() => {
                        if (!this.paymentAmount) {
                            this.paymentMessege = 'No amount entered!'
                        }
                        else if (this.paymentAmount >= this.cart.total.toFixed(2)) {
                            this.paymentMessege = 'payment Accepted';
                            this.message = this.username + " paid!";

                            setTimeout(() => {
                                this.cart.total = 0;
                                this.paymentMessege = '';
                                this.paymentAmount = 0;
                                this.message = '';
                                window.location.reload()
                            }, 3000);


                        } else if (this.paymentAmount < this.cart.total) {
                            this.paymentMessege = 'Enter a sufficient amountt'

                        }

                    })
                    .catch(err => alert(err));
            }
        }
    });
})