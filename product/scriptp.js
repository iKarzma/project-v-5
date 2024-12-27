// Product Database
const productsDB = {
  products: [
    {
      id: 1,
      name: "HD Security Camera Pro",
      category: "cameras",
      price: 299.99,
      image: "../img/genie_cctv_camera_zw49ir-500x500.jpg",
      description: "Professional HD security camera with advanced night vision",
      stock: 10,
      features: [
        "4K Ultra HD Resolution",
        "Advanced Night Vision",
        "Motion Detection",
        "Weather Resistant",
        "Smart AI Detection"
      ]
    },
    {
      id: 2,
      name: "Smart Home Security System",
      category: "alarms",
      price: 499.99,
      image: "../img/How-to-Set-Up-a-Night-Hawk-Wireless-Outdoor-Camera.jpg",
      description: "Complete smart home security system with mobile integration",
      stock: 5,
      features: [
        "Mobile App Control",
        "24/7 Monitoring",
        "Wireless Setup",
        "Smart Home Integration",
        "Emergency Response"
      ]
    },
    {
      id: 3,
      name: "Motion Sensor Elite",
      category: "sensors",
      price: 79.99,
      image: "../img/OIP.jpeg",
      description: "High-precision motion detection sensor with pet immunity",
      stock: 15,
      features: [
        "Pet Immune Technology",
        "Wide Detection Range",
        "False Alarm Prevention",
        "Battery Life: 2 Years",
        "Wireless Connection"
      ]
    },
    {
      id: 4,
      name: "Smart Doorbell Camera",
      category: "smart",
      price: 199.99,
      image: "../img/download (1).jpeg",
      description: "HD video doorbell with two-way audio and motion detection",
      stock: 8,
      features: [
        "1080p HD Video",
        "Two-way Audio",
        "Night Vision",
        "Mobile Notifications",
        "Cloud Storage"
      ]
    }
  ],

  // Get product by ID
  getProduct(id) {
    return this.products.find(p => p.id === id);
  },

  // Filter products
  filterProducts(category, priceRange, sortBy) {
    let filtered = [...this.products];

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Apply price filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(val => val === '+' ? Infinity : Number(val));
      filtered = filtered.filter(p => p.price >= min && (max ? p.price <= max : true));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }
};

// UI Controller
const UIController = {
  DOMstrings: {
    productsGrid: '#productsGrid',
    loadingSpinner: '#loadingSpinner',
    noResults: '#noResults',
    categoryFilter: '#categoryFilter',
    priceFilter: '#priceFilter',
    sortSelect: '#sortProducts',
    productModal: '#productModal'
  },

  // Show loading spinner
  showLoading() {
    document.querySelector(this.DOMstrings.loadingSpinner).classList.remove('d-none');
    document.querySelector(this.DOMstrings.productsGrid).classList.add('d-none');
  },

  // Hide loading spinner
  hideLoading() {
    document.querySelector(this.DOMstrings.loadingSpinner).classList.add('d-none');
    document.querySelector(this.DOMstrings.productsGrid).classList.remove('d-none');
  },

  // Render products to grid
  renderProducts(products) {
    const grid = document.querySelector(this.DOMstrings.productsGrid);
    grid.innerHTML = '';

    if (products.length === 0) {
      document.querySelector(this.DOMstrings.noResults).classList.remove('d-none');
      return;
    }

    document.querySelector(this.DOMstrings.noResults).classList.add('d-none');

    products.forEach(product => {
      const productHTML = `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="card product-card h-100">
                        <span class="badge bg-primary product-badge">${product.category}</span>
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="product-price">$${product.price.toFixed(2)}</p>
                            <p class="card-text">${product.description}</p>
                            <div class="mt-auto">
                                <button class="btn btn-primary me-2" onclick="app.showProductDetails(${product.id})">
                                    View Details
                                </button>
                                <button class="btn btn-success" onclick="app.addToCart(${product.id})">
                                    <i class="fas fa-cart-plus"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      grid.insertAdjacentHTML('beforeend', productHTML);
    });
  },

  // Show product details in modal
  showProductModal(product) {
    const modal = new bootstrap.Modal(document.querySelector(this.DOMstrings.productModal));
    const modalBody = document.querySelector(`${this.DOMstrings.productModal} .modal-body`);

    modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${product.image}" class="img-fluid modal-img" alt="${product.name}">
                </div>
                <div class="col-md-6">
                    <h4>${product.name}</h4>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p>${product.description}</p>
                    <p class="text-muted">Stock: ${product.stock} units</p>
                    <h5>Key Features:</h5>
                    <ul class="product-features">
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div class="mt-3">
                        <div class="input-group mb-3" style="width: 150px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="app.updateQuantity(${product.id}, 'decrease')">-</button>
                            <input type="number" class="form-control text-center" id="quantityInput-${product.id}" value="1" min="1" max="${product.stock}">
                            <button class="btn btn-outline-secondary" type="button" onclick="app.updateQuantity(${product.id}, 'increase')">+</button>
                        </div>
                        <button class="btn btn-success" onclick="app.addToCart(${product.id}, document.getElementById('quantityInput-${product.id}').value)">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

    modal.show();
  },

  // Show notification
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
};

// Main App Controller
const app = {
  init() {
    this.loadProducts();
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.querySelector(UIController.DOMstrings.categoryFilter)
      .addEventListener('change', () => this.loadProducts());
    document.querySelector(UIController.DOMstrings.priceFilter)
      .addEventListener('change', () => this.loadProducts());
    document.querySelector(UIController.DOMstrings.sortSelect)
      .addEventListener('change', () => this.loadProducts());
  },

  loadProducts() {
    UIController.showLoading();

    setTimeout(() => {
      const category = document.querySelector(UIController.DOMstrings.categoryFilter).value;
      const priceRange = document.querySelector(UIController.DOMstrings.priceFilter).value;
      const sortBy = document.querySelector(UIController.DOMstrings.sortSelect).value;

      const filteredProducts = productsDB.filterProducts(category, priceRange, sortBy);
      UIController.hideLoading();
      UIController.renderProducts(filteredProducts);
    }, 500);
  },

  showProductDetails(productId) {
    const product = productsDB.getProduct(productId);
    if (product) {
      UIController.showProductModal(product);
    }
  },

  addToCart(productId, quantity = 1) {
    const product = productsDB.getProduct(productId);
    if (product) {
      quantity = parseInt(quantity);
      if (quantity > 0 && quantity <= product.stock) {
        cartController.addItem(product, quantity);
        UIController.showNotification(`Added ${quantity} ${product.name} to cart!`);

        // Close modal if open
        const modal = bootstrap.Modal.getInstance(document.querySelector(UIController.DOMstrings.productModal));
        if (modal) {
          modal.hide();
        }
      } else {
        UIController.showNotification('Invalid quantity selected', 'danger');
      }
    }
  },

  updateQuantity(productId, action) {
    const input = document.getElementById(`quantityInput-${productId}`);
    let value = parseInt(input.value);
    const product = productsDB.getProduct(productId);

    if (action === 'increase' && value < product.stock) {
      input.value = value + 1;
    } else if (action === 'decrease' && value > 1) {
      input.value = value - 1;
    }
  }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => app.init());

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

        .product-card {
            transition: transform 0.3s ease;
        }

        .product-card:hover {
            transform: translateY(-5px);
        }

        .modal-img {
            max-height: 300px;
            object-fit: contain;
        }
    </style>
`);
