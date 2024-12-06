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

    if (window.location.pathname.endsWith("cart.html")) {
        disableCheckoutIfCartEmpty();
    }

    // Check if on checkout page and initialize payment methods
    if (window.location.pathname.endsWith("checkout.html")) {
        initializePaymentMethods();
    }

    // Call admin dashboard rendering if on admin page
    if (window.location.pathname.endsWith("admin.html")) {
        showAdminDashboard();
        loadAllUserOrders();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId'); // Get the product ID from the query string

    if (productId !== null) {
        const product = products[parseInt(productId)];

        // Pre-fill the form with the existing product data
        document.getElementById("edit-product-name").value = product.name;
        document.getElementById("edit-product-price").value = product.price;
        document.getElementById("edit-product-popularity").value = product.popularity;
        document.getElementById("edit-product-image").value = product.image;
        document.getElementById("edit-product-category").value = product.category;
    }

    if (window.location.pathname.endsWith("sales-dashboard.html")) {
        loadSalesMetrics();
        loadProductPerformance();
        loadCustomerInsights();
    }

    if (window.location.pathname.endsWith("account.html")) {
        updateWishlist();
        updateOrderHistory();
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
        .map((product, index) => `
            <li class="list-group-item d-flex align-items-center">
                <span>${product.name} - $${product.price.toFixed(2)}</span>
                <button class="btn btn-warning btn-sm ms-auto me-2" onclick="editProduct(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Delete</button>
            </li>
        `)
        .join("");

    // Render orders by users
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
    { id: 1, name: "Meta Virtual Reality Glasses",  popularity: 4.4, price: 299.00, image: "https://t3.ftcdn.net/jpg/01/39/05/54/360_F_139055472_IOLmdHf01FG3udivfRybELaHoIuCUbtc.jpg",     category: "Gadgets" },
    { id: 2, name: "Facial Recognition Home Hub",   popularity: 4.5, price: 149.00, image: "https://media.istockphoto.com/id/1298335510/photo/home-automation-hub-with-facial-recognition.jpg?s=170667a&w=0&k=20&c=4cpP7G98QKUzIgBsPCOfa7ZnePkOo0m8XxpoYi3_H9Y=",       category: "Smart Home" },
    { id: 3, name: "3D Printing Pen",               popularity: 3.9, price: 45.00, image: "	https://www.mynt3d.com/cdn/shop/products/IMG_3048_1600x.JPG?v=1497479774",    category: "Gadgets" },
    { id: 4, name: "5JS Drone",                     popularity: 4.8, price: 199.00, image: "https://help.dronedeploy.com/hc/article_attachments/10011857118231",          category: "Gadgets" },
    { id: 5, name: "Apple Watch",                   popularity: 4.0, price: 200.00, image: "https://cdn.mos.cms.futurecdn.net/cdwkgynYqc7sKh6EW3M3Sn-1200-80.jpg",    category: "Gadgets" },
    { id: 6, name: "iPad",                          popularity: 4.2, price: 259.00, image: "https://images-cdn.ubuy.co.in/633fa3c99aa04d711f361507-for-apple-ipad-pro-12-9-apple.jpg",           category: "Gadgets" },
    { id: 7, name: "Gaming Mouse",                  popularity: 4.5, price: 59.00, image: "https://media.cnn.com/api/v1/images/stellar/prod/underscored-best-tested-products-gaming-mouse-corsair-dark-core-rgb-pro-wireless-gaming-mouse.jpeg?q=w_960,h_540,x_0,y_0,c_crop/h_720,w_1280",           category: "Accessories" },
    { id: 8, name: "Office Headset",                popularity: 3.6, price: 25.99, image: "https://cdn.sandberg.world/products/images/lg/126-12_lg.jpg",         category: "Accessories" },
    { id: 9, name: "Gaming Keyboard",               popularity: 4.6, price: 99.00, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfKoGx7okz6IJBdBhyDpCOVsCo9ftyfj42Dg&s",        category: "Accessories" },
    { id: 10, name: "Smart Home Security Camera",   popularity: 2.7, price: 89.99, image: "https://mfs.ezvizlife.com/4a62834c0533684e0a3b61111e7d335d.jpg?ver=7980814117", category: "Smart Home" },
    { id: 11, name: "Wireless Charging Pad",        popularity: 3.9, price: 29.99, image: "https://media.istockphoto.com/id/1215029140/photo/modern-smart-phone-wireless-charging-on-carbon-fibre-surface.jpg?s=612x612&w=0&k=20&c=g1qNU25cqtglFwekHyu1QCs0-TwiZQcTiVp-B-Ex6mo=",    category: "Accessories" },
    { id: 12, name: "Bluetooth Speaker",            popularity: 2.7, price: 49.99, image: "https://media.istockphoto.com/id/1059154330/photo/boombox.jpg?s=612x612&w=0&k=20&c=AYwVrPpREeFXXP0j8rC8R3eF_9WUVghBXPndGqZYSJw=", category: "Accessories" },
    { id: 13, name: "Portable Power Bank 10000mAh", popularity: 3.7, price: 39.99, image: "https://anker.ph/cdn/shop/products/a1247h11_anker_powercore_iii_10k_hero1_1200x1200px.jpg?v=1681783546",      category: "Accessories" },
    { id: 14, name: "LED Light Bulbs (4-Pack)",     popularity: 3.0, price: 59.99, image: "https://m.media-amazon.com/images/I/718IEMuV6UL._AC_UF1000,1000_QL80_.jpg",       category: "Smart Home" },
    { id: 15, name: "Noise-Cancelling Earbuds",     popularity: 4.5, price: 129.99, image: "https://ecommerce.datablitz.com.ph/cdn/shop/files/eng_pl_Ugreen-HiTune-X6-Wireless-Headphones-TWS-Bluetooth-5-0-ANC-Grey-WS118-119160_8.jpg?v=1689131691",        category: "Accessories" },
    { id: 16, name: "Fitness Tracker Bracelet",     popularity: 3.3, price: 69.99, image: "https://istarmax.com/wp-content/uploads/2022/01/s5-pink-1024x1024.jpg", category: "Gadgets" },
    { id: 17, name: "4K Action Camera",             popularity: 3.9, price: 149.99, image: "https://www.dronesdirect.co.uk/Images/eiQ-4KSCPRO_1_11952032_Supersize.jpg?v=48",  category: "Gadgets" },
    { id: 18, name: "Smart Thermostat",             popularity: 4.0, price: 199.99, image: "https://www.hutchbiz.com/wp-content/uploads/2021/06/hutchinson-smart-thermostat.jpg", category: "Smart Home" },
    { id: 19, name: "Wireless Earphones",           popularity: 4.1, price: 89.99, image: "https://media.istockphoto.com/id/1412240771/photo/headphones-on-white-background.jpg?s=612x612&w=0&k=20&c=DwpnlOcMzclX8zJDKOMSqcXdc1E7gyGYgfX5Xr753aQ=", category: "Accessories" },
    { id: 20, name: "Gaming Console Controller",    popularity: 4.3, price: 59.99, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Nintendo-Switch-Pro-Controller-FL.jpg/1200px-Nintendo-Switch-Pro-Controller-FL.jpg",      category: "Accessories" },
    { id: 21, name: "Virtual Assistant Speaker",    popularity: 5.0, price: 99.99, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWJaxPJIheOok0wqLc-DXukVSQbWn1NmpBZA&s", category: "Smart Home" },
    { id: 22, name: "Smart Door Lock",              popularity: 4.3, price: 179.99, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHYlGHH8cQF5xTQgQH6h_U0Mr6K0B8rMrcYQ&s",      category: "Smart Home" },
    { id: 23, name: "HD Web Camera",                popularity: 3.9, price: 49.99, image: "https://down-ph.img.susercontent.com/file/1067324eaadb18cb06d4683f09db40dd",      category: "Accessories" },
    { id: 24, name: "Multiple Port USB Hub",        popularity: 4.2, price: 39.99, image: "https://www.digitek.net.in/cdn/shop/files/digitek-duh-008-usb-c-type-hub-8-in-1-adapter-aluminium-multi-port-dongle-type-c-to-ethernetusb-3-0-4k-hdmi-pd-3-0-charging-port-sdtf-reader-for-macbook-dell-hp-other-type-c-phones-and-devices-digitek-33952226083049.jpg?v=1695023951&width=2400",       category: "Accessories" },
    { id: 25, name: "Electric Scooter",             popularity: 4.9, price: 299.99, image: "https://atlas-content-cdn.pixelsquid.com/stock-images/electric-scooter-kick-koZo1JF-600.jpg", category: "Gadgets" },
    { id: 26, name: "Smart Light Strip",            popularity: 3.6, price: 24.99, image: "https://cdn.thewirecutter.com/wp-content/media/2024/09/LEDstriplights-2048px-4244.jpg?auto=webp&quality=75&width=1024",     category: "Smart Home" },
    { id: 27, name: "Portable Bluetooth Keyboard",  popularity: 4.7, price: 34.99, image: "https://cdn.thewirecutter.com/wp-content/media/2023/10/bluetooth-keyboard-2048px-0891.jpg?auto=webp&quality=75&width=1024", category: "Gadgets" },
    { id: 28, name: "Smart Plug Outlet",            popularity: 2.9, price: 19.99, image: "https://media.istockphoto.com/id/1349059174/photo/saving-energy-concept-a-person-pressing-a-switch-button.jpg?s=612x612&w=0&k=20&c=VmasAY5A_QkWFZVln1et9-puxIH3S9RGhbF2UH1QeEI=",      category: "Smart Home" },
    { id: 29, name: "Drone with Camera",            popularity: 3.7, price: 249.99, image: "https://st2.depositphotos.com/4995823/11017/i/450/depositphotos_110178992-stock-photo-drone-with-high-resolution-digital.jpg",   category: "Gadgets" },
    { id: 30, name: "Gaming Headset with Mic",      popularity: 3.9, price: 79.99, image: "https://eboutique.ph/cdn/shop/products/H656D_01-largex750.jpg?v=1628065378",  category: "Accessories" }
];


// Function to display products in the admin dashboard
function displayAdminProducts() {
    const productContainer = document.getElementById("admin-product-list");
    if (!productContainer) return;

    productContainer.innerHTML = ""; // Clear existing products

    products.forEach(product => {
        productContainer.innerHTML += `
            <div class="col">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">
                            Price: $${product.price.toFixed(2)}<br>
                            Popularity: ${product.popularity.toFixed(1)} ★
                        </p>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-primary btn-sm" onclick="editProduct(${product.id})">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function editProduct(index) {
    // Redirect to the edit product page with the product ID
    window.location.href = `edit-product.html?productId=${index}`;
}

function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        const productIndex = products.findIndex(product => product.id === productId);
        if (productIndex > -1) {
            products.splice(productIndex, 1); // Remove the product
            alert("Product deleted successfully.");
            displayAdminProducts(); // Refresh the list
        }
    }
}

// Call this function when the admin page loads
if (window.location.pathname.endsWith("admin.html")) {
    displayAdminProducts();
}

function addProduct(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const name = document.getElementById("product-name").value.trim();
    const price = parseFloat(document.getElementById("product-price").value);
    const popularity = parseFloat(document.getElementById("product-popularity").value);
    const image = document.getElementById("product-image").value.trim();
    const category = document.getElementById("product-category").value;

    if (name && !isNaN(price) && !isNaN(popularity) && image && category) {
        products.push({
            id: products.length + 1, // Generate a new ID
            name,
            price,
            popularity,
            image,
            category
        });

        saveProductsToStorage(); // Persist changes to localStorage

        alert("Product added successfully!");
        document.getElementById("add-product-form").reset(); // Clear the form
        showAdminDashboard(); // Refresh the dashboard
    } else {
        alert("Invalid input. Please fill all fields correctly.");
    }
}



// Save the products array to localStorage whenever it changes
function saveProductsToStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

function updateProduct(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId'); // Get the product ID from the query string

    if (productId !== null) {
        const product = products[parseInt(productId)];

        // Get updated values from the form
        const updatedName = document.getElementById("edit-product-name").value.trim();
        const updatedPrice = parseFloat(document.getElementById("edit-product-price").value);
        const updatedPopularity = parseFloat(document.getElementById("edit-product-popularity").value);
        const updatedImage = document.getElementById("edit-product-image").value.trim();
        const updatedCategory = document.getElementById("edit-product-category").value;

        if (updatedName && !isNaN(updatedPrice) && !isNaN(updatedPopularity) && updatedImage && updatedCategory) {
            // Update the product details
            product.name = updatedName;
            product.price = updatedPrice;
            product.popularity = updatedPopularity;
            product.image = updatedImage;
            product.category = updatedCategory;

            // Save updated products list to localStorage
            saveProductsToStorage();

            alert("Product updated successfully!");
            window.location.href = "admin.html"; // Redirect back to the admin dashboard
        } else {
            alert("Please fill in all fields correctly.");
        }
    }
}




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
                        <p class="card-text">$${product.price.toFixed(2)} <br>
                        Popularity: ${product.popularity.toFixed(1)} ★
                        </p>
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
        window.location.href = "account.html"; // Redirect to login page if not logged in
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserData = users.find(user => user.email === currentUser.email);

    if (!currentUserData) return;

    const cartContainer = document.getElementById("cart-items");
    const checkoutButton = document.getElementById("checkout-button");

    if (!cartContainer) return;

    const userCart = currentUserData.cart;

    cartContainer.innerHTML = ""; // Clear existing cart items

    if (userCart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        checkoutButton.disabled = true; // Disable checkout button if cart is empty
        document.getElementById("cart-total").textContent = "0.00";
        return;
    }

    // Populate the cart
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

// Function to disable checkout if cart is empty
function disableCheckoutIfCartEmpty() {
    const checkoutButton = document.getElementById("checkout-button");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserData = users.find(user => user.email === currentUser.email);

    if (!currentUserData) return;

    const userCart = currentUserData.cart;

    // If cart is empty, disable checkout button
    if (userCart.length === 0) {
        checkoutButton.disabled = true;
    } else {
        checkoutButton.disabled = false;
    }
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
                    <span class="nav-link"><strong>Welcome, ${currentUser.firstName} |  </strong></span>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="admin.html"><i class="fas fa-tools"></i> Admin Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="sales-dashboard.html"><i class="fas fa-poll"></i> Sales Dashboard</a>
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
    // Retrieve input values from the signup form
    const firstName = document.getElementById("signup-firstname").value.trim();
    const lastName = document.getElementById("signup-lastname").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    // Check if all required fields are filled
    if (!firstName || !lastName || !email || !password) {
        alert("All fields are required!");
        return;
    }

    // Retrieve the current list of users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the email already exists in the users list
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        alert("An account with this email already exists!");
        return;
    }

    // Create a new user object
    const newUser = {
        firstName,
        lastName,
        email,
        password,
        isAdmin: false, // Default to regular user
        cart: [],       // Initialize with an empty cart
        wishlist: [],   // Initialize with an empty wishlist
        orderHistory: [] // Initialize with an empty order history
    };

    // Add the new user to the list of users and save it to localStorage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Notify the user and redirect to the login form
    alert("Account created successfully! Please log in.");
    showLoginForm(); // Show the login form after signup
}

function initializeAdminAccount() {
    const adminUser = {
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: "admin123",
        isAdmin: true,
        cart: [],
        wishlist: [],
        orderHistory: []
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (!users.some(user => user.email === adminUser.email)) {
        users.push(adminUser);
        localStorage.setItem("users", JSON.stringify(users));
    }
}

// Call the initialization function at the start of the script
initializeAdminAccount();


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
    const accountDetails = document.getElementById("account-details");
    const loginForm = document.getElementById("login-form");
    const orderHistory = document.getElementById("order-history");

    if (currentUser) {
        // User is logged in
        loginForm.classList.add("d-none");
        accountDetails.classList.remove("d-none");
        document.getElementById("user-name").textContent = currentUser.firstName;

        // Populate order history
        if (currentUser.orderHistory && currentUser.orderHistory.length > 0) {
            orderHistory.innerHTML = currentUser.orderHistory.map(order =>
                `<li class="list-group-item">Order ID: ${order.id}, Total: $${order.total.toFixed(2)}</li>`
            ).join('');
        } else {
            orderHistory.innerHTML = "<li class='list-group-item'>No orders found.</li>";
        }
    } else {
        // User is not logged in
        loginForm.classList.remove("d-none");
        accountDetails.classList.add("d-none");
        alert("Please log in to view your account.");
    }
}

document.addEventListener("DOMContentLoaded", showAccountDetails);


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

function loadOrderHistory() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const orderHistoryEl = document.getElementById("order-history");

    if (currentUser && currentUser.orderHistory) {
        orderHistoryEl.innerHTML = currentUser.orderHistory.map(order => `
            <li class="list-group-item">
                <strong>Order ID:</strong> ${order.id}<br>
                <strong>Date:</strong> ${order.date}<br>
                <strong>Total:</strong> $${order.total.toFixed(2)}<br>
                <strong>Items:</strong>
                <ul>
                    ${order.items.map(item => `<li>${item.name} (x${item.quantity || 1})</li>`).join('')}
                </ul>
            </li>
        `).join('');
    } else {
        orderHistoryEl.innerHTML = '<li class="list-group-item">No orders found.</li>';
    }
}



function loadAllUserOrders() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const orderListContainer = document.getElementById("order-list");

    if (!orderListContainer) return;

    orderListContainer.innerHTML = ""; // Clear existing orders

    let hasOrders = false;

    users.forEach(user => {
        if (user.orderHistory && user.orderHistory.length > 0) {
            hasOrders = true;
            user.orderHistory.forEach(order => {
                const orderElement = `
                    <li class="list-group-item">
                        <strong>User:</strong> ${user.email}<br>
                        <strong>Order ID:</strong> ${order.id}<br>
                        <strong>Date:</strong> ${order.date}<br>
                        <strong>Total:</strong> $${order.total.toFixed(2)}<br>
                        <strong>Items:</strong>
                        <ul>
                            ${order.items.map(item => `<li>${item.name} (x${item.quantity || 1})</li>`).join('')}
                        </ul>
                    </li>
                `;
                orderListContainer.innerHTML += orderElement;
            });
        }
    });

    if (!hasOrders) {
        orderListContainer.innerHTML = "<p>No orders available.</p>";
    }
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
function completePurchase(event) {
    event.preventDefault(); // Prevent form submission reload

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
        id: new Date().getTime(), // Unique order ID
        items: [...userCart], // Copy the cart items
        total: userCart.reduce((total, item) => total + item.price * (item.quantity || 1), 0),
        date: new Date().toLocaleString() // Record the order date
    };

    // Update product unitsSold
    userCart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.unitsSold = (product.unitsSold || 0) + (cartItem.quantity || 1);
        }
    });

    // Ensure orderHistory is initialized
    users[userIndex].orderHistory = users[userIndex].orderHistory || [];
    users[userIndex].orderHistory.push(order);

    // Clear the user's cart
    users[userIndex].cart = [];
    localStorage.setItem("users", JSON.stringify(users));

    alert("Purchase completed successfully!");

    // Store the order ID for confirmation page
    localStorage.setItem("orderId", order.id);

    window.location.href = "confirmation.html"; // Redirect to confirmation page
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


//SalesMetrics
function loadSalesMetrics() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    let totalSales = 0;
    let totalOrders = 0;

    users.forEach(user => {
        if (user.orderHistory) {
            user.orderHistory.forEach(order => {
                totalSales += order.total;
                totalOrders += 1;
            });
        }
    });

    const averageOrderValue = totalOrders ? (totalSales / totalOrders).toFixed(2) : 0;

    document.getElementById("total-sales").textContent = `$${totalSales.toFixed(2)}`;
    document.getElementById("total-orders").textContent = totalOrders;
    document.getElementById("average-order-value").textContent = `$${averageOrderValue}`;

    renderRevenueChart();
}

function renderRevenueChart() {
    const ctx = document.getElementById("revenue-chart").getContext("2d");
    const revenueData = products.map(product => product.price * (product.unitsSold || 0));
    const labels = products.map(product => product.name);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Revenue by Product",
                data: revenueData,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        }
    });
}

function loadProductPerformance() {
    const tbody = document.getElementById("product-performance-data");
    tbody.innerHTML = ""; // Clear existing rows to avoid duplication

    products.forEach(product => {
        const row = `
            <tr>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.unitsSold || 0}</td>
                <td>$${(product.price * (product.unitsSold || 0)).toFixed(2)}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}



function loadCustomerInsights() {
    // Retrieve orders and users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    let repeatPurchaseCount = 0;
    let totalSpending = 0;
    let customerCount = 0;

    // Loop through each user and their orders
    users.forEach(user => {
        if (!user.isAdmin && user.orderHistory && user.orderHistory.length > 0) {
            const orderCount = user.orderHistory.length;
            totalSpending += user.orderHistory.reduce((sum, order) => sum + order.total, 0);
            if (orderCount > 1) repeatPurchaseCount++;
            customerCount++;
        }
    });

    // Calculate average spending
    const averageSpending = customerCount > 0 ? (totalSpending / customerCount).toFixed(2) : 0;

    // Update the UI
    document.getElementById("repeat-purchases").textContent = repeatPurchaseCount;
    document.getElementById("average-customer-spending").textContent = `$${averageSpending}`;
}