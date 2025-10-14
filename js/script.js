// --- BACK TO TOP ---
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 200 ? 'block' : 'none';
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- HOTLINE ---
function toggleHotline() {
  document.querySelector('.hotline-container').classList.toggle('active');
}

// --- AOS ---
AOS.init();

// --- PRODUCT LISTING ---
const products = [];
const categories = ["bonglan","cookies","donut","macaron","tiramisu"];
for (let i = 1; i <= 40; i++) {
  const cat = categories[i % categories.length];
  products.push({
    id: i,
    name: `Bánh ${cat} số ${i}`,
    price: 15000 + (i * 1000),
    category: cat,
    img: `assets/images/${cat}.jpg`
  });
}

const perPage = 8;
let currentPage = 1;
let filtered = [...products];

function renderProducts() {
  const start = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  document.getElementById('product-list').innerHTML = pageItems.map(p => `
    <div class="col-6 col-md-4 col-lg-3" data-aos="fade-up">
      <div class="card product-card h-100 border-0 shadow-sm">
        <img src="${p.img}" class="card-img-top" alt="${p.name}">
        <div class="card-body text-center">
          <h6 class="fw-bold">${p.name}</h6>
          <p class="text-danger fw-bold mb-2">${p.price.toLocaleString()}đ</p>
          <a href="product-detail.html" class="btn btn-outline-danger btn-sm rounded-pill">Xem</a>
        </div>
      </div>
    </div>
  `).join('');
}

function renderPagination() {
  const totalPages = Math.ceil(filtered.length / perPage);
  const pag = document.getElementById('pagination');
  pag.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    pag.innerHTML += `
      <li class="page-item ${i===currentPage?'active':''}">
        <button class="page-link" onclick="goToPage(${i})">${i}</button>
      </li>`;
  }
}

function goToPage(page) {
  currentPage = page;
  renderProducts();
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- FILTER ---
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.category;
    filtered = cat === 'all' ? [...products] : products.filter(p => p.category === cat);
    currentPage = 1;
    renderProducts();
    renderPagination();
  });
});

// --- INIT ---
renderProducts();
renderPagination();

  function toggleHotline() {
    document.getElementById("hotlineContent").classList.toggle("show");
  }