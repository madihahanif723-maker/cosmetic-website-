// Wait until the HTML structure is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // Purana original API URL jo aapne pehli file mein use kiya tha
    const apiURL = "https://makeup-api.herokuapp.com/api/v1/products.json?product_type=perfume";

    // Purana fallback URL jo aapne pehli file mein backup ke taur par lagaya tha
    const fallbackURL = "https://makeup-api.herokuapp.com/api/v1/products.json?product_tags=Natural";

    const productsGrid = document.getElementById("products-grid");
    const loadingSpinner = document.getElementById("loading");
    const cartCountEl = document.querySelector(".cart-count");
    const cartIcon = document.querySelector(".cart-icon");

    let cartCount = 0;
    let cartItems = [];

    function updateCartBadge() {
        cartCountEl.textContent = cartCount;
    }

    function createCartModal() {
        const modal = document.createElement("div");
        modal.classList.add("cart-modal-overlay");
        modal.id = "cart-modal";
        modal.innerHTML = `
            <div class="cart-modal-window">
                <button class="cart-close-btn" aria-label="Close cart">&times;</button>
                <h2>Your Cart</h2>
                <div class="cart-modal-body"></div>
                <div class="cart-modal-footer">
                    <div class="cart-total"></div>
                    <button class="checkout-btn">Checkout</button>
                </div>
            </div>
        `;

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeCartModal();
            }
        });

        modal.querySelector(".cart-close-btn").addEventListener("click", closeCartModal);
        document.body.appendChild(modal);
        return modal;
    }

    function renderCartModal(cartModal) {
        const body = cartModal.querySelector(".cart-modal-body");
        const totalLabel = cartModal.querySelector(".cart-total");

        if (cartItems.length === 0) {
            body.innerHTML = `<p class="cart-empty-message">Your cart is empty. Add an item to see it here.</p>`;
            totalLabel.textContent = "Total: $0.00";
            return;
        }

        let totalAmount = 0;
        body.innerHTML = cartItems.map(item => {
            const price = parseFloat(item.price.replace(/[^0-9\.]/g, "")) || 0;
            totalAmount += price;
            return `
                <div class="cart-item">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                </div>
            `;
        }).join("");

        totalLabel.textContent = `Total: $${totalAmount.toFixed(2)}`;
    }

    function openCartModal(cartModal) {
        renderCartModal(cartModal);
        cartModal.classList.add("visible");
    }

    function closeCartModal() {
        const cartModal = document.getElementById("cart-modal");
        if (cartModal) {
            cartModal.classList.remove("visible");
        }
    }

    // 1. Fetch data using your original API links
    async function fetchCosmeticsData() {
        try {
            let response = await fetch(apiURL);
            let data = await response.json();

            // Agar pehla link empty data return kare, toh fallback url chalega (purani logic)
            if (data.length === 0) {
                response = await fetch(fallbackURL);
                data = await response.json();
            }

            // Hide loading spinner instantly
            loadingSpinner.style.display = "none";

            // Slicing first 100 products from the dataset
            renderCosmetics(data.slice(0, 100));

        } catch (error) {
            console.error("API Fetch Error:", error);
            loadingSpinner.innerHTML = "<p style='color: #d9534f;'>Unable to stream live beauty catalogue. Please reload the webpage.</p>";
        }
    }

    // 2. Map data stream into beautiful UI blocks matching the makeup theme
    function renderCosmetics(itemsList) {
        productsGrid.innerHTML = ""; // Clear grid completely

        itemsList.forEach(product => {
            // High-quality cosmetic fallback image if API object link is broken
            const fallbackImg = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=80";
            const currentImg = product.image_link ? product.image_link : fallbackImg;

            // Format prices cleanly ($), if free/null assign a baseline value
            const finalPrice = product.price && parseFloat(product.price) > 0
                ? `$${parseFloat(product.price).toFixed(2)}`
                : "$24.00";

            const productBrand = product.brand ? product.brand : "Glow Premium";

            // Create element node
            const cardNode = document.createElement("div");
            cardNode.classList.add("product-card");

            cardNode.innerHTML = `
                <div>
                    <div class="product-img-container">
                        <img src="${currentImg}" onerror="this.onerror=null; this.src='${fallbackImg}';" alt="${product.name}">
                    </div>
                    <div class="product-brand">${productBrand}</div>
                    <div class="product-title">${product.name}</div>
                </div>
                <div>
                    <div class="product-price">${finalPrice}</div>
                    <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                </div>
            `;

            // Setup click event for cart count handling
            const cartBtn = cardNode.querySelector(".add-to-cart-btn");
            cartBtn.addEventListener("click", () => {
                    cartCount++;
                cartItems.push({ name: product.name, price: finalPrice });
                updateCartBadge();

                // Cosmetics theme styling button feedback on click
                cartBtn.innerHTML = "<i class='fas fa-check'></i> Item Added";
                cartBtn.style.backgroundColor = "#e0a996";
                cartBtn.style.color = "white";
                cartBtn.style.borderColor = "#e0a996";

                setTimeout(() => {
                    cartBtn.innerHTML = "<i class='fas fa-shopping-cart'></i> Add to Cart";
                    cartBtn.style.backgroundColor = "transparent";
                    cartBtn.style.color = "#1e1e1e";
                    cartBtn.style.borderColor = "#1e1e1e";
                }, 1100);
            });

            // Push nodes layout onto live screen grid wrapper
            productsGrid.appendChild(cardNode);
        });
    }

    const cartModal = createCartModal();

    if (cartIcon) {
        cartIcon.addEventListener("click", (event) => {
            event.preventDefault();
            openCartModal(cartModal);
        });
    }

    // Initialize layout trigger
    fetchCosmeticsData();
});
// 3. Contact Form Submission Handling
const contactForm = document.getElementById("beautyForm");
if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Page refresh hone se rokega

        const nameInput = document.getElementById("userName").value;

        // Show alert feedback message
        Swal.fire({
            title: 'Message Sent!',
            text: `Thank you, ${nameInput}! Your message has been sent successfully to Glow & Co. Our beauty experts will contact you soon.`,
            icon: 'success',
            background: '#F7F0EB', // Isse light glass effect aayega
            backdrop: `
    rgba(0,0,123,0.4)
    blur(4px)
  `, // Background screen blur karne ke liye
            confirmButtonColor: '#f0d2bc'
        });
        contactForm.reset(); // Clear all form fields
    });
}