const products = [
    { id: 1, name: "Meta Virtual Reality Glasses", price: 299.00, image: "images/vr_glasses.jpg" },
    { id: 2, name: "Facial Recognition Home Hub", price: 149.00, image: "images/home_hub.jpg" },
    { id: 3, name: "3D Printing Pen", price: 45.00, image: "images/printing_pen.jpg" },
    { id: 4, name: "5JS Drone", price: 199.00, image: "images/drone.jpg" },
    { id: 5, name: "Apple Watch", price: 200.00, image: "images/apple_watch.jpg" },
    { id: 6, name: "iPad", price: 259.00, image: "images/ipad.jpg" },
    { id: 7, name: "Gaming Mouse", price: 59.00, image: "images/mouse.jpg" },
    { id: 8, name: "Office Headset", price: 25.99, image: "images/headset.jpg" },
    { id: 9, name: "Gaming Keyboard", price: 99.00, image: "images/keyboard.jpg" },
    { id: 10, name: "Smart Home Security Camera", price: 89.99, image: "images/security_camera.jpg" },
    { id: 11, name: "Wireless Charging Pad", price: 29.99, image: "images/charging_pad.jpg" },
    { id: 12, name: "Bluetooth Speaker", price: 49.99, image: "images/bluetooth_speaker.jpg" },
    { id: 13, name: "Portable Power Bank 10000mAh", price: 39.99, image: "images/power_bank.jpg" },
    { id: 14, name: "Smart LED Light Bulbs (4-Pack)", price: 59.99, image: "images/led_bulbs.jpg" },
    { id: 15, name: "Noise-Cancelling Earbuds", price: 129.99, image: "images/earbuds.jpg" },
    { id: 16, name: "Fitness Tracker Bracelet", price: 69.99, image: "images/fitness_tracker.jpg" },
    { id: 17, name: "4K Action Camera", price: 149.99, image: "images/action_camera.jpg" },
    { id: 18, name: "Smart Thermostat", price: 199.99, image: "images/smart_thermostat.jpg" },
    { id: 19, name: "Wireless Earphones", price: 89.99, image: "images/wireless_earphones.jpg" },
    { id: 20, name: "Gaming Console Controller", price: 59.99, image: "images/controller.jpg" },
    { id: 21, name: "Virtual Assistant Speaker", price: 99.99, image: "images/assistant_speaker.jpg" },
    { id: 22, name: "Smart Door Lock", price: 179.99, image: "images/door_lock.jpg" },
    { id: 23, name: "HD Web Camera", price: 49.99, image: "images/web_camera.jpg" },
    { id: 24, name: "Multiple Port USB Hub", price: 39.99, image: "images/usb_c_hub.jpg" },
    { id: 25, name: "Electric Scooter", price: 299.99, image: "images/electric_scooter.jpg" },
    { id: 26, name: "Smart Light Strip", price: 24.99, image: "images/light_strip.jpg" },
    { id: 27, name: "Portable Bluetooth Keyboard", price: 34.99, image: "images/bluetooth_keyboard.jpg" },
    { id: 28, name: "Smart Plug Outlet", price: 19.99, image: "images/smart_plug.jpg" },
    { id: 29, name: "Drone with Camera", price: 249.99, image: "images/drone_camera.jpg" },
    { id: 30, name: "Gaming Headset with Mic", price: 79.99, image: "images/gaming_headset.jpg" }
];

function displayProducts() {
    const productContainer = document.getElementById("product-list");
    products.forEach(product => {
        productContainer.innerHTML += `
            <div class="col">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">$${product.price.toFixed(2)}</p>
                        <button class="btn btn-warning" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.name} has been added to your cart!`);
}

function loadCart() {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = ""; // Clear any existing content

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    if (storedCart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    storedCart.forEach((item, index) => {
        cartContainer.innerHTML += `
            <div class="col-md-4">
                <div class="card mb-4">
                    <img src="${item.image}" class="cart-img card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">Price: $${item.price.toFixed(2)}</p>
                        <button class="btn btn-danger" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
            </div>
        `;
    });

    const totalPrice = storedCart.reduce((total, item) => total + item.price, 0);
    cartContainer.innerHTML += `
        <div class="col-12">
            <p class="text-end"><strong>Total: $${totalPrice.toFixed(2)}</strong></p>
        </div>
    `;
}


function removeFromCart(index) {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    storedCart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(storedCart));

    loadCart();
}

function proceedToCheckout() {
    alert("Proceeding to checkout...");
}

function proceedToCheckout() {
    window.location.href = "checkout.html";
}

function completePurchase(event) {
    event.preventDefault();
    alert("Purchase completed!");
    localStorage.removeItem("cart");
    window.location.href = "confirmation.html"; 
}

if (window.location.pathname.endsWith("product.html")) {
    displayProducts();
}

if (window.location.pathname.endsWith("cart.html")) {
    loadCart();
}