class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.shippingCharge = 100; // Fixed shipping charge in BDT
        this.init();
    }

    init() {
        this.updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
            this.setupCartPageListeners();
        }
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.showNotification('Product added to cart!');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCartPage();
        this.showNotification('Product removed from cart!');
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            const quantity = parseInt(newQuantity);
            if (quantity > 0) {
                item.quantity = quantity;
                this.saveCart();
                this.renderCartPage();
            } else {
                this.removeItem(productId);
            }
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        let countBadge = document.querySelector('.cart-count');

        if (totalItems > 0) {
            if (!countBadge) {
                countBadge = document.createElement('span');
                countBadge.className = 'cart-count';
                const cartIcon = document.querySelector('.fa-shopping-bag');
                if (cartIcon) {
                    cartIcon.parentElement.appendChild(countBadge);
                }
            }
            countBadge.textContent = totalItems;
        } else if (countBadge) {
            countBadge.remove();
        }
    }

    calculateSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    }

    applyCoupon() {
        const couponInput = document.querySelector('#coupon input');
        const couponCode = couponInput ? couponInput.value.toUpperCase() : '';
        let discount = 0;

        switch (couponCode) {
            case 'SAVE10':
                discount = 0.1;
                break;
            case 'SAVE20':
                discount = 0.2;
                break;
            default:
                this.showNotification('Invalid coupon code!', 'error');
                return 0;
        }

        this.showNotification('Coupon applied successfully!');
        return discount;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 100);
    }

    setupCartPageListeners() {
        const couponButton = document.querySelector('#coupon button');
        if (couponButton) {
            couponButton.addEventListener('click', () => {
                const discount = this.applyCoupon();
                this.renderCartPage(discount);
            });
        }
    }

    renderCartPage(discount = 0) {
        const cartTable = document.querySelector('#cart tbody');
        if (!cartTable) return;

        // Clear existing content
        cartTable.innerHTML = '';

        // Add items to cart table
        this.items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><a href="#" onclick="cart.removeItem('${item.id}'); return false;">
                    <i class="fa-solid fa-circle-xmark removeCart"></i>
                </a></td>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>৳${item.price}</td>
                <td>
                    <input type="number" value="${item.quantity || 1}" min="1" 
                        onchange="cart.updateQuantity('${item.id}', this.value)">
                </td>
                <td>৳${item.price * (item.quantity || 1)}</td>
            `;
            cartTable.appendChild(tr);
        });

        // Update totals
        const subtotal = this.calculateSubtotal();
        const shipping = this.items.length > 0 ? this.shippingCharge : 0;
        const discountAmount = subtotal * discount;
        const total = subtotal - discountAmount + shipping;

        const totalsSection = document.querySelector('#subtotal');
        if (totalsSection) {
            totalsSection.innerHTML = `
                <h3>Cart Totals</h3>
                <table>
                    <tr>
                        <td>Cart Subtotal</td>
                        <td>৳${subtotal}</td>
                    </tr>
                    <tr>
                        <td>Shipping</td>
                        <td>৳${shipping}</td>
                    </tr>
                    ${discount > 0 ? `
                    <tr>
                        <td>Discount (${discount * 100}%)</td>
                        <td>-৳${discountAmount}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>৳${Math.round(total)}</strong></td>
                    </tr>
                </table>
                <button class="normal" onclick="cart.proceedToCheckout()">Proceed to checkout</button>
            `;
        }
    }

    proceedToCheckout() {
        console.log('Thank You For Shopping with us!');
        this.showNotification('Order placed successfully!');
        // Clear cart after checkout
        this.items = [];
        this.saveCart();
        this.renderCartPage();
    }
}

// Initialize cart
const cart = new ShoppingCart();