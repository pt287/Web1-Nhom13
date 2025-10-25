// --- BACK TO TOP ---
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.scrollY > 200 ? 'block' : 'none';
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- HOTLINE ---
function toggleHotline() {
  const hotlineBox = document.querySelector('.hotline-container');
  if (hotlineBox) hotlineBox.classList.toggle('active');
  else alert('📞 Gọi ngay: 0909 109 343');
}

// --- AOS ---
AOS.init();

// --- PRODUCT LISTING ---
document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("product-list");
  if (!productList) return; // chỉ chạy ở trang product.html

  const sortSelect = document.getElementById("sort");
  const pagination = document.getElementById("pagination");
  const perPage = 8;
  let items = [], filtered = [];
  let currentPage = 1, currentCategory = "all";
  const basePath = "cakes"; // 📁 thư mục chứa các file sản phẩm

  // --- Load danh mục sản phẩm ---
  function loadCategory(category = "all") {
    currentCategory = category;
    const file = `${basePath}/${category}.html`;
    productList.innerHTML = `<p class="text-center text-muted py-5">Đang tải sản phẩm...</p>`;

    fetch(file)
      .then(res => res.ok ? res.text() : Promise.reject())
      .then(html => {
        productList.innerHTML = html;
        items = Array.from(document.querySelectorAll(".product-item"));
        filtered = [...items];
        currentPage = 1;
        applySort();
      })
      .catch(() => {
        productList.innerHTML = `<p class="text-center text-muted py-5">Không có sản phẩm nào 😢</p>`;
      });
  }

  // --- Lọc & sắp xếp ---
  function applyFilters() {
    const name = document.getElementById("searchName").value.toLowerCase();
    const min = parseFloat(document.getElementById("minPrice").value) || 0;
    const max = parseFloat(document.getElementById("maxPrice").value) || Infinity;
    const catSelect = document.getElementById("searchCategory").value;

    filtered = items.filter(item => {
      const title = item.querySelector(".card-title").textContent.toLowerCase();
      const price = parseFloat(item.dataset.price);
      const cat = item.dataset.category;
      return title.includes(name) && price >= min && price <= max && (catSelect === "all" || cat === catSelect);
    });

    currentPage = 1;
    applySort();
  }

  function applySort() {
    const sortVal = sortSelect.value;
    filtered.sort((a, b) => {
      const pa = parseFloat(a.dataset.price), pb = parseFloat(b.dataset.price);
      const da = new Date(a.dataset.date), db = new Date(b.dataset.date);
      if (sortVal === "asc") return pa - pb;
      if (sortVal === "desc") return pb - pa;
      if (sortVal === "new") return db - da;
      return 0;
    });
    renderPage();
  }

  // --- Phân trang ---
  function renderPage() {
    items.forEach(i => i.style.display = "none");
    const start = (currentPage - 1) * perPage;
    filtered.slice(start, start + perPage).forEach(i => i.style.display = "block");
    renderPagination();
  }

  function renderPagination() {
    const totalPages = Math.ceil(filtered.length / perPage);
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
        <button class="page-link">${i}</button>
      </li>`;
    }
    pagination.querySelectorAll(".page-link").forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        currentPage = idx + 1;
        renderPage();
        window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ cuộn lên đầu mỗi khi đổi trang
      });
    });
  }

  // --- Gán sự kiện ---
  document.getElementById("btnSearch")?.addEventListener("click", applyFilters);
  document.getElementById("btnReset")?.addEventListener("click", () => {
    ["searchName", "minPrice", "maxPrice"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    const catSelect = document.getElementById("searchCategory");
    if (catSelect) catSelect.value = "all";
    sortSelect.value = "default";
    loadCategory("all");
  });
  sortSelect.addEventListener("change", applySort);

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      loadCategory(e.target.dataset.category);
    });
  });

  loadCategory("all");
});
