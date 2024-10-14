// URL API untuk mendapatkan data produk dari DummyJSON
const API_URL = "https://dummyjson.com/products";

// Mendapatkan ID produk dari URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

// Fungsi untuk mengambil detail produk
async function fetchProductDetails() {
    try {
        const response = await fetch(`${API_URL}/${productId}`);
        if (!response.ok) {
            throw new Error("Gagal mengambil detail produk");
        }
        const product = await response.json();
        displayProductDetails(product);
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Fungsi untuk menampilkan detail produk di HTML
function displayProductDetails(product) {
    document.getElementById("product-title").textContent = product.title;
    document.getElementById("product-image").src = product.images[0]; // Gambar produk
    document.getElementById("product-price").textContent = `IDR ${product.price}`;
    document.getElementById("product-description").textContent = product.description;

    // Menampilkan ulasan
    const reviewsContainer = document.getElementById("product-reviews");
    reviewsContainer.innerHTML = ''; // Kosongkan ulasan sebelumnya
    product.reviews.forEach(review => {
        const reviewElement = document.createElement("div");
        reviewElement.classList.add("review");
        reviewElement.innerHTML = `
            <p><strong>${review.reviewerName}</strong> (Rating: ${review.rating})</p>
            <p>${review.comment}</p>
            <p><em>${new Date(review.date).toLocaleDateString()}</em></p>
        `;
        reviewsContainer.appendChild(reviewElement);
    });
}

// Event listener untuk tombol kembali
document.getElementById("back-button").addEventListener("click", function() {
    window.history.back(); // Kembali ke halaman sebelumnya
});

// Mem-fetch dan menampilkan detail produk saat halaman dimuat
fetchProductDetails();
