// URL API untuk mendapatkan data produk dari DummyJSON
const API_URL = "https://dummyjson.com/products";

// Variabel untuk menyimpan jumlah item per halaman
let itemsPerPage = 3;

// Fungsi untuk mengambil produk dari API dengan error handling
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data.products; // Mengambil array produk dari response
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Event listener untuk dropdown filter kategori
document
  .getElementById("filter-category")
  .addEventListener("change", function () {
    const selectedCategory = this.value;
    displayProductsFromAPI(1, selectedCategory); // Tampilkan produk sesuai kategori
  });

// Kategori filter: Groceries, Furniture, dan Fragrances
const categories = ["groceries", "furniture", "fragrances"];

// Display dropdown untuk kategori baru
const filterCategoryDropdown = document.getElementById("filter-category");
filterCategoryDropdown.innerHTML = `
  <option value="">All</option>
  <option value="groceries">Groceries</option>
  <option value="furniture">Furniture</option>
  <option value="fragrances">Fragrances</option>
`;

// Fungsi untuk menampilkan produk berdasarkan kategori dan halaman
async function displayProductsFromAPI(page = 1, category = "") {
  let products = await fetchProducts();
  if (!products) return; // Jika gagal mengambil data, hentikan eksekusi

  // Filter produk berdasarkan kategori (groceries, furniture, fragrances)
  const filteredProducts = category
    ? products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      )
    : products;

  // Paginasi: hitung start dan end berdasarkan halaman dan item per halaman
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(start, end);

  const menuContainer = document.querySelector(".menu-container");
  menuContainer.innerHTML = ""; // Kosongkan kontainer sebelum menampilkan produk

  // Loop untuk menampilkan produk
  paginatedProducts.forEach((product) => {
    const productElement = `
      <div class="menu-item">
        <img src="${product.thumbnail}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>IDR ${product.price}K</p>
        <button onclick="addToCart('${product.title}', ${product.price})">Add to Cart</button>
      </div>
    `;
    menuContainer.innerHTML += productElement;
  });

  // Hitung total halaman untuk navigasi
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  displayPaginationControls(totalPages, page, category);
}

// Fungsi untuk menampilkan kontrol navigasi halaman (paginasi)
function displayPaginationControls(totalPages, currentPage, category) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ""; // Kosongkan kontainer sebelum menambahkan tombol

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = `<button class="${
      i === currentPage ? "active" : ""
    }" onclick="displayProductsFromAPI(${i}, '${category}')">${i}</button>`;
    paginationContainer.innerHTML += pageButton;
  }
}

// Event listener untuk mengubah jumlah item per halaman
document
  .getElementById("items-per-page")
  .addEventListener("change", function () {
    itemsPerPage = parseInt(this.value);
    displayProductsFromAPI(); // Panggil ulang fungsi untuk menampilkan produk dengan jumlah item yang baru
  });

// Fungsi untuk menambah produk ke keranjang
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => item.name === name);

  if (product) {
    product.quantity += 1; // Jika produk sudah ada di keranjang, tambahkan jumlahnya
  } else {
    cart.push({ name, price, quantity: 1 }); // Jika produk belum ada di keranjang, tambahkan produk baru
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // Simpan keranjang di Local Storage
  alert(`${name} has been added to your cart!`);
  displayCart(); // Tampilkan ulang keranjang setelah penambahan produk
}

// Fungsi untuk menampilkan item di keranjang
function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItems = document.getElementById("cart-items");
  const totalItems = document.getElementById("total-items");
  const totalPrice = document.getElementById("total-price");

  cartItems.innerHTML = ""; // Kosongkan keranjang sebelum menampilkan item
  let totalQuantity = 0;
  let totalCost = 0;

  cart.forEach((item) => {
    const cartElement = `
      <div class="cart-item">
        <h3>${item.name}</h3>
        <p>IDR ${item.price}K</p>
        <p>Quantity: ${item.quantity}</p>
        <button onclick="increaseQuantity('${item.name}')">+</button>
        <button onclick="decreaseQuantity('${item.name}')">-</button>
        <button onclick="removeFromCart('${item.name}')">Remove</button>
      </div>
    `;
    cartItems.innerHTML += cartElement;
    totalQuantity += item.quantity;
    totalCost += item.price * item.quantity;
  });

  totalItems.textContent = totalQuantity;
  totalPrice.textContent = totalCost + "K";
}

// Fungsi untuk menambah jumlah item di keranjang
function increaseQuantity(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => item.name === name);

  if (product) {
    product.quantity += 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Fungsi untuk mengurangi jumlah item di keranjang
function decreaseQuantity(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => item.name === name);

  if (product && product.quantity > 1) {
    product.quantity -= 1;
  } else {
    cart = cart.filter((item) => item.name !== name); // Jika jumlah item 1, hapus produk dari keranjang
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Fungsi checkout untuk mengosongkan keranjang
document.getElementById("checkout").addEventListener("click", function () {
  localStorage.removeItem("cart");
  alert("Checkout successful!");
  displayCart(); // Tampilkan ulang keranjang setelah checkout
});

// Tampilkan keranjang saat halaman dimuat
displayCart();

// Tampilkan produk pertama kali
displayProductsFromAPI();
