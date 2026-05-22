let allFetchedProducts = []; 
function fetchCosmeticsFromAPI() {
    const apiUrl = "https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline";

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            return data.filter(item => item.image_link && item.price && item.product_type).slice(0, 24);
        });
}

function displayProducts(productsList) {
    const gridContainer = document.getElementById("products-grid");
    gridContainer.innerHTML = ""; // Container saaf karein

    if(productsList.length === 0) {
        gridContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted fs-5">No products found in this category.</p>
            </div>
        `;
        return;
    }

    productsList.forEach(product => {
        const finalPrice = product.price.startsWith('$') ? product.price : `$${product.price}`;
        
        const cardHtml = `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card glass-product-card p-3 shadow-sm d-flex flex-column justify-between">
                    <div>
                        <div class="card-img-container mb-3">
                            <img src="${product.image_link}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300'">
                        </div>
                        <span class="badge bg-secondary-subtle text-dark text-capitalize mb-2">${product.product_type}</span>
                        <h5 class="card-title text-dark text-truncate mb-1" title="${product.name}">${product.name}</h5>
                        <p class="card-text text-muted small text-truncate-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 40px;">
                            ${product.description ? product.description : 'Premium quality formulation to enhance your daily beautiful glow up look.'}
                        </p>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                        <span class="fs-5 fw-bold text-dark">${finalPrice}</span>
                        <button onclick="showAlert('Added to Bag!', '${product.name.replace(/'/g, "\\'")} has been added successfully.', 'success')" class="btn btn-add-bag btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-plus-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        gridContainer.insertAdjacentHTML("beforeend", cardHtml);
    });
}

// 3. SMART FILTER LOGIC (As requested from SmartMart website style)
function filterProducts(category, buttonElement) {
    // Buttons ki active classes manage karna
    const allButtons = document.querySelectorAll(".filter-btn");
    allButtons.forEach(btn => {
        btn.classList.remove("active-filter");
        btn.classList.add("bg-white");
    });
    buttonElement.classList.add("active-filter");
    buttonElement.classList.remove("bg-white");

    // Live array filter logic
    if (category === "all") {
        displayProducts(allFetchedProducts);
    } else {
        const filtered = allFetchedProducts.filter(item => item.product_type.toLowerCase() === category.toLowerCase());
        displayProducts(filtered);
    }
}

// 4. SweetAlert Helper function
function showAlert(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonColor: '#db2777',
        background: 'rgba(255, 255, 255, 0.95)'
    });
}

// 5. WINDOW LOAD PAR PROMISE RUN KARNA
document.addEventListener("DOMContentLoaded", () => {
    // Calling the function that handles fetch Promise
    fetchCosmeticsFromAPI()
        .then((data) => {
            allFetchedProducts = data; // Data ko globally save kiya
            
            // Loading spinner hide karein aur grid show karein
            document.getElementById("loading").classList.add("d-none");
            const grid = document.getElementById("products-grid");
            grid.classList.remove("d-none");
            
            // All products display karein
            displayProducts(data);
        })
        .catch((error) => {
            console.error("Promise rejected:", error);
            document.getElementById("loading").innerHTML = `
                <div class="alert alert-danger d-inline-block mx-auto" role="alert">
                    ⚠️ <strong>Promise Rejected:</strong> Failed to fetch live data from Makeup API.
                </div>
            `;
        });
});

    function handleContactSubmit(event) {
            event.preventDefault(); // Page reload hone se rokna
            
            // Input values ko target karna
            const name = document.getElementById('userName').value;

            // Premium SweetAlert Trigger
            Swal.fire({
                title: `Thank You, ${name}!`,
                text: 'Your message has been successfully transmitted.',
                icon: 'success',
                confirmButtonColor: '#db2777',
                background: 'rgba(255, 255, 255, 0.95)'
            }).then(() => {
                // Form ko clear karna notification ke baad
                document.getElementById('cosmeticContactForm').reset();
            });
        }