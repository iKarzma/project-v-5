// Cart Controller
class CartController {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.total = 0;
    this.init();
  }

  init() {
    this.updateCartCount();
    this.calculateTotal();
    this.setupCartIcon();
  }

  setupCartIcon() {
    // Add cart icon to navbar if it doesn't exist
    if (!document.querySelector('.cart-icon')) {
      const navbarNav = document.querySelector('.navbar-nav');
      if (navbarNav) {
        const cartIconHTML = `
                    <li class="nav-item">
                        <button class="btn btn-link nav-link position-relative cart-icon" onclick="cartController.showCart()">
                            <i class="fas fa-shopping-cart"></i>
                            <span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                0
                            </span>
                        </button>
                    </li>
                `;
        navbarNav.insertAdjacentHTML('beforeend', cartIconHTML);
      }
    }
  }

  addItem(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: parseInt(quantity)
      });
    }

    this.updateCart();
    this.showNotification(`Added ${quantity} ${product.name} to cart`);
  }

  removeItem(productId) {
    const itemIndex = this.cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      const removedItem = this.cart[itemIndex];
      this.cart.splice(itemIndex, 1);
      this.updateCart();
      this.showNotification(`Removed ${removedItem.name} from cart`);
    }
  }

  updateQuantity(productId, newQuantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      const quantity = parseInt(newQuantity);
      if (quantity > 0) {
        item.quantity = quantity;
        this.updateCart();
      } else {
        this.removeItem(productId);
      }
    }
  }

  calculateTotal() {
    this.total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return this.total;
  }

  updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
  }

  updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.calculateTotal();
    this.updateCartCount();

    // Update cart modal if open
    const cartModal = document.getElementById('cartModal');
    if (cartModal && cartModal.classList.contains('show')) {
      this.showCart();
    }
  }

  showCart() {
    let cartModal = document.getElementById('cartModal');

    if (!cartModal) {
      // Create modal if it doesn't exist
      const modalHTML = `
                <div class="modal fade" id="cartModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Shopping Cart</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                ${this.renderCartItems()}
                            </div>
                            <div class="modal-footer justify-content-between">
                                <h5>Total: $${this.total.toFixed(2)}</h5>
                                <div>
                                    <button class="btn btn-secondary" data-bs-dismiss="modal">
                                        Continue Shopping
                                    </button>
                                    ${this.cart.length > 0 ? `
                                        <button class="btn btn-primary" onclick="cartController.checkout()">
                                            Checkout
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      cartModal = document.getElementById('cartModal');
    } else {
      // Update existing modal
      cartModal.querySelector('.modal-body').innerHTML = this.renderCartItems();
      cartModal.querySelector('.modal-footer').innerHTML = `
                <h5>Total: $${this.total.toFixed(2)}</h5>
                <div>
                    <button class="btn btn-secondary" data-bs-dismiss="modal">
                        Continue Shopping
                    </button>
                    ${this.cart.length > 0 ? `
                        <button class="btn btn-primary" onclick="cartController.checkout()">
                            Checkout
                        </button>
                    ` : ''}
                </div>
            `;
    }

    const modal = new bootstrap.Modal(cartModal);
    modal.show();
  }

  renderCartItems() {
    if (this.cart.length === 0) {
      return `
                <div class="text-center py-5">
                    <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                    <h4>Your cart is empty</h4>
                    <p>Add some products to your cart</p>
                </div>
            `;
    }

    return `
            <div class="table-responsive">
                <table class="table align-middle">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.cart.map(item => `
                            <tr>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <img src="${item.image}" alt="${item.name}"
                                            class="me-2" style="width: 50px; height: 50px; object-fit: cover;">
                                        <span>${item.name}</span>
                                    </div>
                                </td>
                                <td>$${item.price.toFixed(2)}</td>
                                <td>
                                    <div class="input-group input-group-sm" style="width: 120px">
                                        <button class="btn btn-outline-secondary" type="button"
                                            onclick="cartController.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                        <input type="number" class="form-control text-center" value="${item.quantity}"
                                            onchange="cartController.updateQuantity(${item.id}, this.value)">
                                        <button class="btn btn-outline-secondary" type="button"
                                            onclick="cartController.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                                    </div>
                                </td>
                                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button class="btn btn-sm btn-danger"
                                        onclick="cartController.removeItem(${item.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  checkout() {
    if (this.cart.length === 0) {
      this.showNotification('Your cart is empty!', 'warning');
      return;
    }

    // إنشاء نافذة الدفع
    let checkoutModal = document.getElementById('checkoutModal');
    if (!checkoutModal) {
      const modalHTML = `
        <div class="modal fade" id="checkoutModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Checkout</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form id="checkoutForm" onsubmit="cartController.processCheckout(event)">
                  <!-- Customer Information -->
                  <div class="mb-4">
                    <h6>Customer Information</h6>
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label class="form-label">First Name</label>
                        <input type="text" class="form-control" required>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Last Name</label>
                        <input type="text" class="form-control" required>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" required>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Phone</label>
                        <input type="tel" class="form-control" required>
                      </div>
                    </div>
                  </div>

                  <!-- Shipping Address -->
                  <div class="mb-4">
                    <h6>Shipping Address</h6>
                    <div class="row">
                      <div class="col-12 mb-3">
                        <label class="form-label">Address</label>
                        <input type="text" class="form-control" required>
                      </div>
                      <div class="col-md-4 mb-3">
                        <label class="form-label">City</label>
                        <input type="text" class="form-control" required>
                      </div>
                      <div class="col-md-4 mb-3">
                        <label class="form-label">State</label>
                        <input type="text" class="form-control" required>
                      </div>
                      <div class="col-md-4 mb-3">
                        <label class="form-label">ZIP Code</label>
                        <input type="text" class="form-control" required>
                      </div>
                    </div>
                  </div>

                  <!-- Payment Information -->
                  <div class="mb-4">
                    <h6>Payment Information</h6>
                    <div class="row">
                      <div class="col-12 mb-3">
                        <label class="form-label">Card Number</label>
                        <input type="text" class="form-control" required pattern="[0-9]{16}" placeholder="1234 5678 9012 3456">
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Expiry Date</label>
                        <input type="text" class="form-control" required pattern="(0[1-9]|1[0-2])\/[0-9]{2}" placeholder="MM/YY">
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">CVV</label>
                        <input type="text" class="form-control" required pattern="[0-9]{3,4}" placeholder="123">
                      </div>
                    </div>
                  </div>

                  <!-- Order Summary -->
                  <div class="mb-4">
                    <h6>Order Summary</h6>
                    <div class="table-responsive">
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>Subtotal:</td>
                            <td class="text-end">$${this.total.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td>Shipping:</td>
                            <td class="text-end">$${(this.total > 100 ? 0 : 10).toFixed(2)}</td>
                          </tr>
                          <tr>
                            <td><strong>Total:</strong></td>
                            <td class="text-end"><strong>$${(this.total + (this.total > 100 ? 0 : 10)).toFixed(2)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <button type="submit" class="btn btn-primary w-100">Place Order</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      checkoutModal = document.getElementById('checkoutModal');
    }

    // إخفاء نافذة السلة وإظهار نافذة الدفع
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (cartModal) {
      cartModal.hide();
    }
    const modal = new bootstrap.Modal(checkoutModal);
    modal.show();
  }

  processCheckout(event) {
    event.preventDefault();

    // إظهار رسالة تحميل
    this.showNotification('Processing your order...', 'info');

    // محاكاة عملية الدفع
    setTimeout(() => {
      // إخفاء نافذة الدفع
      const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
      if (checkoutModal) {
        checkoutModal.hide();
      }

      // إظهار رسالة نجاح وإعادة توجيه
      this.showOrderConfirmation();

      // تفريغ السلة
      this.cart = [];
      this.updateCart();
    }, 2000);
  }

  showOrderConfirmation() {
    let confirmationModal = document.getElementById('orderConfirmationModal');
    if (!confirmationModal) {
      const modalHTML = `
        <div class="modal fade" id="orderConfirmationModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Order Confirmed!</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body text-center">
                <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
                <h4>Thank you for your order!</h4>
                <p>Your order has been successfully placed.</p>
                <p>Order number: #${Math.floor(Math.random() * 1000000)}</p>
                <p>We'll send you an email confirmation shortly.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Continue Shopping</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      confirmationModal = document.getElementById('orderConfirmationModal');
    }

    const modal = new bootstrap.Modal(confirmationModal);
    modal.show();
  }
}

// Initialize cart controller
const cartController = new CartController();

// Add styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .notification-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1051;
            min-width: 250px;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .cart-icon {
            cursor: pointer;
        }

        .cart-icon:hover {
            color: var(--bs-primary);
        }

        #cartCount {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
        }

        .modal-body {
            max-height: 60vh;
            overflow-y: auto;
        }
    </style>
`);
