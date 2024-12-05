document.addEventListener("DOMContentLoaded", () => {
    // Check if on product page and display products
    if (window.location.pathname.endsWith("product.html")) {
        displayProducts();
        setupFilters();
    }

    // Check if on cart page and load cart
    if (window.location.pathname.endsWith("cart.html")) {
        loadCart();
    }

    // Check if on checkout page and initialize payment methods
    if (window.location.pathname.endsWith("checkout.html")) {
        initializePaymentMethods();
    }

    // Call admin dashboard rendering if on admin page
    if (window.location.pathname.endsWith("admin.html")) {
        showAdminDashboard();
    }

    // Update header links dynamically based on login state
    updateHeader();
});


function showAdminDashboard() {
    if (!currentUser || !currentUser.isAdmin) {
        alert("Access denied!");
        window.location.href = "index.html";
        return;
    }

    const userListEl = document.getElementById("user-list");
    const productListEl = document.getElementById("product-list");
    const orderListEl = document.getElementById("order-list");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Render list of users
    userListEl.innerHTML = users
        .filter(user => !user.isAdmin)
        .map(user => `<li class="list-group-item">${user.firstName} ${user.lastName} (${user.email})</li>`)
        .join("");

    // Render list of products
    productListEl.innerHTML = products
        .map(product => `<li class="list-group-item">${product.name} - $${product.price.toFixed(2)}</li>`)
        .join("");

    // Render orders by user
    orderListEl.innerHTML = users
        .filter(user => !user.isAdmin)
        .flatMap(user => user.orderHistory.map(order => `
            <li class="list-group-item">
                <strong>${user.firstName} ${user.lastName}</strong> - Order ID: ${order.id}, Total: $${order.total.toFixed(2)}
            </li>
        `))
        .join("");
}


// Product Databse
const products = [
    { id: 1, name: "Meta Virtual Reality Glasses",  popularity: 4.4, price: 299.00, image: "images/vr_glasses.jpg",     category: "Gadgets" },
    { id: 2, name: "Facial Recognition Home Hub",   popularity: 4.5, price: 149.00, image: "images/home_hub.jpg",       category: "Smart Home" },
    { id: 3, name: "3D Printing Pen",               popularity: 3.9, price: 45.00, image: "images/printing_pen.jpg",    category: "Gadgets" },
    { id: 4, name: "5JS Drone",                     popularity: 4.8, price: 199.00, image: "images/drone.jpg",          category: "Gadgets" },
    { id: 5, name: "Apple Watch",                   popularity: 4.0, price: 200.00, image: "images/apple_watch.jpg",    category: "Gadgets" },
    { id: 6, name: "iPad",                          popularity: 4.2, price: 259.00, image: "images/ipad.jpg",           category: "Gadgets" },
    { id: 7, name: "Gaming Mouse",                  popularity: 4.5, price: 59.00, image: "images/mouse.jpg",           category: "Accessories" },
    { id: 8, name: "Office Headset",                popularity: 3.6, price: 25.99, image: "images/headset.jpg",         category: "Accessories" },
    { id: 9, name: "Gaming Keyboard",               popularity: 4.6, price: 99.00, image: "images/keyboard.jpg",        category: "Accessories" },
    { id: 10, name: "Smart Home Security Camera",   popularity: 2.7, price: 89.99, image: "images/security_camera.jpg", category: "Smart Home" },
    { id: 11, name: "Wireless Charging Pad",        popularity: 3.9, price: 29.99, image: "images/charging_pad.jpg",    category: "Accessories" },
    { id: 12, name: "Bluetooth Speaker",            popularity: 2.7, price: 49.99, image: "images/bluetooth_speaker.jpg", category: "Accessories" },
    { id: 13, name: "Portable Power Bank 10000mAh", popularity: 3.7, price: 39.99, image: "images/power_bank.jpg",      category: "Accessories" },
    { id: 14, name: "LED Light Bulbs (4-Pack)",     popularity: 3.0, price: 59.99, image: "images/led_bulbs.jpg",       category: "Smart Home" },
    { id: 15, name: "Noise-Cancelling Earbuds",     popularity: 4.5, price: 129.99, image: "images/earbuds.jpg",        category: "Accessories" },
    { id: 16, name: "Fitness Tracker Bracelet",     popularity: 3.3, price: 69.99, image: "images/fitness_tracker.jpg", category: "Gadgets" },
    { id: 17, name: "4K Action Camera",             popularity: 3.9, price: 149.99, image: "images/action_camera.jpg",  category: "Gadgets" },
    { id: 18, name: "Smart Thermostat",             popularity: 4.0, price: 199.99, image: "images/smart_thermostat.jpg", category: "Smart Home" },
    { id: 19, name: "Wireless Earphones",           popularity: 4.1, price: 89.99, image: "images/wireless_earphones.jpg", category: "Accessories" },
    { id: 20, name: "Gaming Console Controller",    popularity: 4.3, price: 59.99, image: "images/controller.jpg",      category: "Accessories" },
    { id: 21, name: "Virtual Assistant Speaker",    popularity: 5.0, price: 99.99, image: "images/assistant_speaker.jpg", category: "Smart Home" },
    { id: 22, name: "Smart Door Lock",              popularity: 4.3, price: 179.99, image: "images/door_lock.jpg",      category: "Smart Home" },
    { id: 23, name: "HD Web Camera",                popularity: 3.9, price: 49.99, image: "images/web_camera.jpg",      category: "Accessories" },
    { id: 24, name: "Multiple Port USB Hub",        popularity: 4.2, price: 39.99, image: "images/usb_c_hub.jpg",       category: "Accessories" },
    { id: 25, name: "Electric Scooter",             popularity: 4.9, price: 299.99, image: "images/electric_scooter.jpg", category: "Gadgets" },
    { id: 26, name: "Smart Light Strip",            popularity: 3.6, price: 24.99, image: "images/light_strip.jpg",     category: "Smart Home" },
    { id: 27, name: "Portable Bluetooth Keyboard",  popularity: 4.7, price: 34.99, image: "images/bluetooth_keyboard.jpg", category: "Gadgets" },
    { id: 28, name: "Smart Plug Outlet",            popularity: 2.9, price: 19.99, image: "images/smart_plug.jpg",      category: "Smart Home" },
    { id: 29, name: "Drone with Camera",            popularity: 3.7, price: 249.99, image: "images/drone_camera.jpg",   category: "Gadgets" },
    { id: 30, name: "Gaming Headset with Mic",      popularity: 3.9, price: 79.99, image: "images/gaming_headset.jpg",  category: "Accessories" }
];


// User and cart management
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Display products on the product page
function displayProducts(filteredProducts = products) {
    const productContainer = document.getElementById("product-list");
    if (!productContainer) return;

    productContainer.innerHTML = ""; // Clear existing products

    filteredProducts.forEach(product => {
        const isProductInCart = isProductAlreadyInCart(product.id);
        const isProductInWishlist = isProductAlreadyInWishlist(product.id);

        const cartButtonHTML = currentUser
            ? isProductInCart
                ? `<button class="btn btn-secondary" disabled>Already in Cart</button>`
                : `<button onclick="addToCart(${product.id})" class="btn btn-warning">Add to Cart</button>`
            : ''; // Hide "Add to Cart" button if not logged in

        const wishlistButtonHTML = currentUser
            ? isProductInWishlist
                ? `<button class="btn btn-secondary" disabled>In Wishlist</button>`
                : `<button onclick="addToWishlist(${product.id})" class="btn btn-info">Add to Wishlist</button>`
            : ''; // Hide "Add to Wishlist" button if not logged in

        productContainer.innerHTML += `
            <div class="col">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">$${product.price.toFixed(2)}</p>
                        <div class="d-flex justify-content-between">
                            ${cartButtonHTML}
                            ${wishlistButtonHTML}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}


// Filter and sort logic
function filterProducts() {
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();
    const selectedCategory = document.getElementById("category-filter").value;
    const maxPrice = parseFloat(document.getElementById("price-filter").value) || 500;
    const sortOption = document.getElementById("sort-filter").value;

    let filteredProducts = products.filter(product => {
        return (
            product.name.toLowerCase().includes(searchQuery) &&
            (!selectedCategory || product.category === selectedCategory) &&
            product.price <= maxPrice
        );
    });

    if (sortOption === "priceLowHigh") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighLow") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "popularity") {
        filteredProducts.sort((a, b) => b.popularity - a.popularity);
    } else if (sortOption === "nameAZ") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "nameZA") {
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    displayProducts(filteredProducts);
}

// Setup event listeners for filters
function setupFilters() {
    document.getElementById("search-bar").addEventListener("input", filterProducts);
    document.getElementById("category-filter").addEventListener("change", filterProducts);
    document.getElementById("price-filter").addEventListener("input", () => {
        document.getElementById("price-value").innerText = document.getElementById("price-filter").value;
        filterProducts();
    });
    document.getElementById("sort-filter").addEventListener("change", filterProducts);
}

// Add to cart function
function addToCart(productId) {
    if (!currentUser) {
        alert("You must be logged in to add items to the cart.");
        return;
    }

    const product = products.find(item => item.id === productId);
    if (!product) return;

    // Retrieve all users
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(user => user.email === currentUser.email);

    if (userIndex === -1) return;

    const userCart = users[userIndex].cart;

    // Check if the product is already in the user's cart
    if (userCart.some(item => item.id === productId)) {
        alert(`${product.name} is already in your cart.`);
        return;
    }

    // Add the product to the user's cart
    userCart.push(product);
    users[userIndex].cart = userCart;

    // Update localStorage and currentUser
    localStorage.setItem("users", JSON.stringify(users));
    currentUser = users[userIndex];
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert(`${product.name} has been added to your cart!`);

    // Update the product list to reflect the change
    displayProducts();
}

// Update the "Add to Cart" button state (disabled if already in cart)
function updateCartButtonState(productId) {
    const buttons = document.querySelectorAll(`button[data-product-id="${productId}"]`);
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const isProductInCart = cart.some(item => item.id === productId);
    
    buttons.forEach(button => {
        if (isProductInCart) {
            button.setAttribute("disabled", true);
            button.textContent = "Already in Cart";
        } else {
            button.removeAttribute("disabled");
            button.textContent = "Add to Cart";
        }
    });
}

// Check if the product is already in the cart
function isProductAlreadyInCart(productId) {
    if (!currentUser) return false;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === currentUser.email);

    if (!user || !user.cart) return false;

    // Check if the product ID exists in the user's cart
    return user.cart.some(item => item.id === productId);
}

function isProductAlreadyInWishlist(productId) {
    if (!currentUser) return false;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === currentUser.email);

    if (!user || !user.wishlist) return false;

    // Check if the product ID exists in the user's wishlist
    return user.wishlist.some(item => item.id === productId);
}


// Load cart items for the logged-in user
function loadCart() {
    if (!currentUser) {
        alert("You must be logged in to view your cart.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserData = users.find(user => user.email === currentUser.email);

    if (!currentUserData) return;

    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) return;

    const userCart = currentUserData.cart;

    cartContainer.innerHTML = ""; // Clear existing cart items

    if (userCart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("cart-total").textContent = "0.00";
        return;
    }

    userCart.forEach((item, index) => {
        cartContainer.innerHTML += `
            <div class="col-md-12 d-flex align-items-center mb-4">
                <img src="${item.image}" class="cart-img" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; margin-right: 10px;">
                <div>
                    <h5>${item.name}</h5>
                    <p>Price: $${item.price.toFixed(2)}</p>
                    <div class="d-flex align-items-center">
                        <label for="quantity-${index}" class="me-2">Quantity:</label>
                        <input type="number" id="quantity-${index}" class="form-control" value="${item.quantity || 1}" min="1" style="width: 60px;" onchange="updateQuantity(${index}, this.value)">
                    </div>
                </div>
                <button class="btn btn-danger ms-auto" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });

    updateCartTotal();
}

// Update the cart total
function updateCartTotal() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserData = users.find(user => user.email === currentUser.email);

    if (!currentUserData) return;

    const totalPrice = currentUserData.cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
    document.getElementById("cart-total").textContent = totalPrice.toFixed(2);
}

// Update the quantity of a product in the cart
function updateQuantity(index, newQuantity) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(user => user.email === currentUser.email);

    if (userIndex === -1) return;

    const userCart = users[userIndex].cart;

    // Update the quantity for the selected product
    userCart[index].quantity = parseInt(newQuantity, 10);

    // Update localStorage and refresh the UI
    users[userIndex].cart = userCart;
    localStorage.setItem("users", JSON.stringify(users));
    currentUser = users[userIndex];
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    updateCartTotal();
}


// Remove item from the user's cart
function removeFromCart(index) {
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(user => user.email === currentUser.email);

    if (userIndex === -1) return;

    const userCart = users[userIndex].cart;

    // Remove the item from the user's cart
    userCart.splice(index, 1);
    users[userIndex].cart = userCart;
    localStorage.setItem("users", JSON.stringify(users));

    // Reload the cart UI
    loadCart();
}

// Check if a user is logged in
function updateHeader() {
    const navLinks = document.getElementById("nav-links");
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get the currently logged-in user

    if (!navLinks) return;

    navLinks.innerHTML = ""; // Clear existing navigation links

    if (currentUser) {
        if (currentUser.isAdmin) {
            // Admin-specific navigation
            navLinks.innerHTML += `
                <li class="nav-item">
                    <span class="nav-link"><strong>Welcome, ${currentUser.firstName} (Admin)!</strong></span>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="admin.html"><i class="fas fa-tools"></i> Admin Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="index.html"><i class="fas fa-home"></i> Home</a>
                </li>
                <li class="nav-item">
                    <button class="btn btn-danger btn-sm" onclick="logout()">Logout</button>
                </li>
            `;
        } else {
            // Regular user navigation
            navLinks.innerHTML += `
                <li class="nav-item">
                    <span class="nav-link"><strong>Welcome, ${currentUser.firstName}!</strong></span>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="index.html"><i class="fas fa-home"></i> Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="product.html"><i class="fas fa-store"></i> Products</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="cart.html"><i class="fas fa-shopping-cart"></i> Cart</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="account.html"><i class="fas fa-user-circle"></i> View Account</a>
                </li>
                <li class="nav-item">
                    <button class="btn btn-danger btn-sm" onclick="logout()">Logout</button>
                </li>
            `;
        }
    } else {
        // Guest navigation
        navLinks.innerHTML += `
            <li class="nav-item">
                <span class="nav-link"><strong>Welcome, Guest!</strong></span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="index.html"><i class="fas fa-home"></i> Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="product.html"><i class="fas fa-store"></i> Products</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="account.html"><button class="btn btn-danger btn-sm">Log In</button></a>
            </li>
        `;
    }
}


// Call updateHeader when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", updateHeader);

// Signup Function
function signup() {
    const firstName = document.getElementById("signup-firstname").value.trim();
    const lastName = document.getElementById("signup-lastname").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    if (!firstName || !lastName || !email || !password) {
        alert("All fields are required!");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    if (users.some(user => user.email === email)) {
        alert("Email already exists!");
        return;
    }

    // Create new user object
    const newUser = {
        firstName,
        lastName,
        email,
        password,
        isadmin: false, // Default role is user; admins are set manually
        cart: [], // Initialize empty cart for this user
        wishlist: [], // Unique wishlist for this user
        orderHistory: [] // Unique order history for this user
    };

    const adminUser = {
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: "admin123",
        isadmin: true,
        cart: [],
        wishlist: [],
        orderHistory: []
    };

    // Save the new user
    users.push(adminUser);
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("users", JSON.stringify([adminUser]));


    alert("Account created successfully!");
    showLoginForm(); // Redirect to login form
}

// Login Function
function login() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        alert("Invalid email or password!");
        return;
    }

    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert("Login successful!");

    // Redirect admin users to admin dashboard
    if (currentUser.isAdmin) {
        window.location.href = "admin.html";
    } else {
        window.location.href = "index.html";
    }
}

// Logout user
function logout() {
    localStorage.removeItem("currentUser");
    alert("Logged out successfully!");
    window.location.href = "index.html";
}

// Account Details View
function showAccountDetails() {
    currentUser = JSON.parse(localStorage.getItem("currentUser")); // Fetch the updated current user

    if (!currentUser) {
        alert("Please log in to view your account.");
        window.location.href = "index.html"; // Redirect to the homepage if not logged in
        return;
    }

    document.getElementById("login-form").classList.add("d-none");
    document.getElementById("signup-form").classList.add("d-none");
    document.getElementById("account-details").classList.remove("d-none");

    document.getElementById("user-name").innerText = `${currentUser.firstName} ${currentUser.lastName}`;
    updateOrderHistory();
    updateWishlist(); // Call to update the wishlist UI
}


// Update order history
function updateOrderHistory() {
    const orderHistoryEl = document.getElementById("order-history");
    orderHistoryEl.innerHTML = "";
    currentUser.orders.forEach(order => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerText = `Order ID: ${order.id}, Total: $${order.total}`;
        orderHistoryEl.appendChild(li);
    });
}

// Update wishlist
function updateWishlist() {
    const wishlistEl = document.getElementById("wishlist");
    wishlistEl.innerHTML = ""; // Clear the existing wishlist

    if (!currentUser.wishlist || currentUser.wishlist.length === 0) {
        wishlistEl.innerHTML = "<li class='list-group-item'>Your wishlist is empty.</li>";
        return;
    }

    currentUser.wishlist.forEach(product => {
        wishlistEl.innerHTML += `
            <li class="list-group-item d-flex align-items-center">
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                <span>${product.name} - $${product.price.toFixed(2)}</span>
                <button class="btn btn-danger btn-sm ms-auto" onclick="removeFromWishlist(${product.id})">Remove</button>
            </li>
        `;
    });
}

// Add to wishlist
function addToWishlist(productId) {
    if (!currentUser) {
        alert("You must be logged in to add items to your wishlist.");
        return;
    }

    const product = products.find(item => item.id === productId);
    if (!product) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(user => user.email === currentUser.email);

    if (userIndex === -1) return;

    const userWishlist = users[userIndex].wishlist;

    // Check if the product is already in the wishlist
    if (userWishlist.some(item => item.id === productId)) {
        alert(`${product.name} is already in your wishlist.`);
        return;
    }

    // Add the product to the wishlist
    userWishlist.push(product);
    users[userIndex].wishlist = userWishlist;

    // Update the localStorage and the current user session
    localStorage.setItem("users", JSON.stringify(users));
    currentUser = users[userIndex]; // Sync currentUser with updated data
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert(`${product.name} has been added to your wishlist!`);
    displayProducts(); // Refresh the product list to update button states
}


// Remove from wishlist
function removeFromWishlist(productId) {
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(user => user.email === currentUser.email);

    if (userIndex === -1) return;

    const userWishlist = users[userIndex].wishlist;

    // Remove the product from the wishlist
    users[userIndex].wishlist = userWishlist.filter(item => item.id !== productId);
    localStorage.setItem("users", JSON.stringify(users));

    // Update current user data
    currentUser = users[userIndex];
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert("Product removed from your wishlist.");
    updateWishlist(); // Refresh the wishlist UI
}



// Show Signup Forms
function showSignupForm() {
    document.getElementById("signup-form").classList.remove("d-none");
    document.getElementById("login-form").classList.add("d-none");
}

// Show Login Form
function showLoginForm() {
    document.getElementById("signup-form").classList.add("d-none");
    document.getElementById("login-form").classList.remove("d-none");
}

// Initial View Setup
if (currentUser) {
    showAccountDetails();
} else {
    showLoginForm();
}

// Proceed to checkout
function proceedToCheckout() {
    window.location.href = "checkout.html";
}

// Add to order history function
function completePurchase() {
    if (!currentUser) {
        alert("You must be logged in to complete a purchase.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(user => user.email === currentUser.email);

    if (userIndex === -1) return;

    const userCart = users[userIndex].cart;

    if (userCart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const order = {
        id: new Date().getTime(), // Unique order ID based on timestamp
        items: [...userCart], // Copy the cart items into the order
        total: userCart.reduce((total, item) => total + item.price, 0), // Calculate the total
        date: new Date().toLocaleString() // Record the order date
    };

    // Add the order to the user's order history
    users[userIndex].orderHistory.push(order);

    // Clear the user's cart
    users[userIndex].cart = [];
    localStorage.setItem("users", JSON.stringify(users));
    alert("Purchase completed successfully!");

    window.location.href = "confirmation.html";
}



function initializePaymentMethods() {
    // Stripe Initialization
    const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY'); // Replace with your public key
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    // Handle Payment Form Submission
    document.getElementById('payment-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 5000, currency: 'usd' }),
        });

        const { clientSecret } = await response.json();

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement },
        });

        if (result.error) {
            alert(`Payment failed: ${result.error.message}`);
        } else if (result.paymentIntent.status === 'succeeded') {
            alert('Payment successful!');
            window.location.href = 'confirmation.html';
        }
    });

    // PayPal Initialization
    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [{ amount: { value: '50.00' } }],
            });
        },
        onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            alert('Payment successful!');
            window.location.href = 'confirmation.html';
        },
        onError: (err) => {
            console.error('PayPal error:', err);
            alert('Payment failed. Please try again.');
        },
    }).render('#paypal-button-container');
}


// Toggle between Stripe and PayPal dynamically
document.getElementById('payment-form').addEventListener('change', (event) => {
    const selectedMethod = event.target.value; // Assume a dropdown for selecting payment method
    if (selectedMethod === 'paypal') {
        document.getElementById('paypal-button-container').classList.remove('d-none');
        document.getElementById('card-element').classList.add('d-none');
    } else {
        document.getElementById('paypal-button-container').classList.add('d-none');
        document.getElementById('card-element').classList.remove('d-none');
    }
});
