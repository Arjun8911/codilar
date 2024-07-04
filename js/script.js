let products = "";

// remove space and special carector from string
function cleanString(str) {
  return str.replace(/[^a-zA-Z0-9]/g, "");
}

function getProducts() {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      console.log("response", data);
      products = data;
      showProducts(data);
      showCategory(data);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}
// show product list
function showProducts(item) {
  const productList = document.getElementById("list");
  productList.innerHTML = "";
  item.forEach((product) => {
    const productHTML = `
            <div class="list-item">
                <div class="card">
                  <div class="card-img">
                    <img src=${product.image} class="img" alt="" />
                  </div>
                  <div class="card-body">
                    <h4 class="card-title">${product.title}</h4>
                    <span class="card-price">$${product.price}</span>
                    <div class="card-wishlist">
                        <i class="bi bi-suit-heart"></i>
                    </div>
                  </div>
                </div>
              </div>
        `;
    productList.innerHTML += productHTML;
  });
}

// show product category
function showCategory(item) {
  const productCategory = document.getElementById("productCategory");
  productCategory.innerHTML = "";
  const uniqueCategories = new Set();
  item.forEach((product) => {
    const cleanedCategory = cleanString(product.category);
    if (!uniqueCategories.has(cleanedCategory)) {
      uniqueCategories.add(cleanedCategory);
      const categoryHTML = `<button type="button" class="c-btn" onclick="filterByCategory('${product.category.replace(
        /'/g,
        "\\'"
      )}', this)">${product.category}</button>`;
      productCategory.innerHTML += categoryHTML;
    }
  });
}

// filter by category functionality
function filterByCategory(category, btn) {
  const cleanedCategory = cleanString(category);
  const filteredProducts = products.filter(
    (product) => cleanString(product.category) === cleanedCategory
  );
  showProducts(filteredProducts);
  highlightSelectedCategory(btn);
}

// active selected category

function highlightSelectedCategory(selectedBtn) {
  const buttons = document.querySelectorAll(".c-btn");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
  selectedBtn.classList.add("active");
}

// search products
function searchProducts() {
  const searchQuery = document.getElementById("searchBox").value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery)
  );
  showProducts(filteredProducts);
}

// short products
function handleSortChange(event) {
  const order = event.target.value;
  sortProducts(order);
}

function sortProducts(order) {
  const productList = document.getElementById("list");
  const productElements = Array.from(
    productList.getElementsByClassName("list-item")
  );
  const sortedProducts = productElements.sort((a, b) => {
    const priceA = parseFloat(
      a.querySelector(".card-price").textContent.replace("$", "")
    );
    const priceB = parseFloat(
      b.querySelector(".card-price").textContent.replace("$", "")
    );
    return order === "lowToHigh" ? priceA - priceB : priceB - priceA;
  });
  productList.innerHTML = "";
  sortedProducts.forEach((product) => productList.appendChild(product));
}

getProducts();
