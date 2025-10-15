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
  if (!productList) return;

  const sortSelect = document.getElementById("sort");
  const pagination = document.getElementById("pagination");
  const perPage = 5;

  let items = [];
  let filtered = [];
  let originalOrder = [];
  let allProducts = []; // chứa toàn bộ sản phẩm từ mọi danh mục
  let currentPage = 1;
  let currentCategory = "all";
  const basePath = "cakes";
  const categories = ["bonglan", "cookies", "donut", "macaron", "tiramisu"];

  // 🔹 Chuẩn hóa giá (bỏ ký tự không phải số)
  const parsePrice = val => parseInt((val || "").replace(/[^\d]/g, ""), 10) || 0;

  // --- Load toàn bộ sản phẩm 1 lần (cache) ---
  async function loadAllProducts() {
    if (allProducts.length > 0) return allProducts;
    const loaded = [];
    for (const cat of categories) {
      try {
        const res = await fetch(`${basePath}/${cat}.html`);
        if (res.ok) {
          const html = await res.text();
          const div = document.createElement("div");
          div.innerHTML = html;
          const catItems = Array.from(div.querySelectorAll(".product-item"));
          catItems.forEach(i => i.dataset.category = cat);
          loaded.push(...catItems);
        }
      } catch (e) {
        console.warn("Không tải được:", cat);
      }
    }
    allProducts = loaded;
    return loaded;
  }

  // --- Load danh mục cụ thể ---
  async function loadCategory(category = "all") {
    currentCategory = category;
    productList.innerHTML = `<p class="text-center text-muted py-5">Đang tải sản phẩm...</p>`;
    sortSelect.value = "default";

    try {
      const res = await fetch(`${basePath}/${category}.html`);
      if (!res.ok) throw new Error("Không tìm thấy file sản phẩm");
      const html = await res.text();
      productList.innerHTML = html;

      items = Array.from(productList.querySelectorAll(".product-item"));
      originalOrder = [...items];
      filtered = [...items];
      currentPage = 1;

      applySort();
    } catch {
      productList.innerHTML = `<p class="text-center text-muted py-5">Không có sản phẩm nào 😢</p>`;
    }
  }

  // --- Tìm kiếm nâng cao toàn cục ---
  async function applyFilters() {
    const name = document.getElementById("searchName").value.toLowerCase().trim();
    const min = parsePrice(document.getElementById("minPrice").value);
    const maxRaw = document.getElementById("maxPrice").value;
    const max = maxRaw ? parsePrice(maxRaw) : Infinity;
    const catSelect = document.getElementById("searchCategory").value;

    const all = await loadAllProducts();

    filtered = all.filter(item => {
      const title = item.querySelector(".card-title")?.textContent.toLowerCase() || "";
      const price = parsePrice(item.dataset.price);
      const cat = item.dataset.category || "";

      const matchName = !name || title.includes(name);
      const matchPrice = price >= min && price <= max;
      const matchCat = (catSelect === "all" || catSelect === cat);

      return matchName && matchPrice && matchCat;
    });

    items = [...filtered];
    currentPage = 1;
    applySort();
  }

  // --- Sắp xếp ---
  function applySort() {
    const sortVal = sortSelect.value;

    if (sortVal === "default") {
      filtered = [...items];
    } else {
      filtered.sort((a, b) => {
        const pa = parsePrice(a.dataset.price);
        const pb = parsePrice(b.dataset.price);
        const da = new Date(a.dataset.date || 0);
        const db = new Date(b.dataset.date || 0);

        if (sortVal === "asc") return pa - pb;     // Giá thấp → cao
        if (sortVal === "desc") return pb - pa;    // Giá cao → thấp
        if (sortVal === "new") return db - da;     // Mới nhất
        return 0;
      });
    }

    renderPage();
  }

  // --- Render lại danh sách ---
  function renderPage() {
    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage);
    if (total === 0) {
      productList.innerHTML = `<p class="text-center text-muted py-5">Không tìm thấy sản phẩm nào 😢</p>`;
      pagination.innerHTML = "";
      return;
    }

    const start = (currentPage - 1) * perPage;
    const visibleItems = filtered.slice(start, start + perPage);

    productList.innerHTML = "";
    visibleItems.forEach(item => {
      item.classList.add("fade-in");
      productList.appendChild(item);
      setTimeout(() => item.classList.remove("fade-in"), 400);
    });

    renderPagination(totalPages);
  }

  // --- Phân trang ---
  function renderPagination(totalPages) {
    pagination.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? 'active' : ''}`;
      li.innerHTML = `<button class="page-link">${i}</button>`;
      li.querySelector("button").addEventListener("click", () => {
        currentPage = i;
        renderPage();
      });
      pagination.appendChild(li);
    }
  }

  // --- Gán sự kiện ---
  document.getElementById("btnSearch").addEventListener("click", applyFilters);
  document.getElementById("searchName").addEventListener("keydown", e => {
    if (e.key === "Enter") applyFilters();
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    ["searchName", "minPrice", "maxPrice"].forEach(id => (document.getElementById(id).value = ""));
    document.getElementById("searchCategory").value = "all";
    sortSelect.value = "default";
    loadCategory(currentCategory);
  });

  sortSelect.addEventListener("change", applySort);

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      loadCategory(e.target.dataset.category);
    });
  });

  // --- Load mặc định ---
  loadCategory("all");
});
