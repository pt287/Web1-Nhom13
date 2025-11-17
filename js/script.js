// --- BACK TO TOP & HOTLINE ---
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function toggleHotline() {
    const hotlineBox = document.querySelector('.hotline-container');
    if (hotlineBox) hotlineBox.classList.toggle('active');
    else alert('📞 Gọi ngay: 0909 109 343');
}

AOS.init();

// --- PRODUCT LISTING & PAGINATION ---
document.addEventListener("DOMContentLoaded", function () {
    const productListContainer = document.getElementById("product-list");
    if (!productListContainer) return;

    const sortSelect = document.getElementById("sort");
    const pagination = document.getElementById("pagination");
    const perPage = 8; // Số sản phẩm trên mỗi trang

    // Lấy TẤT CẢ sản phẩm tĩnh từ DOM (dựa trên class product-item)
    let allProducts = Array.from(productListContainer.querySelectorAll(".product-item"));
    
    // Tách các sản phẩm ra khỏi DOM để chuẩn bị cho việc render lại phân trang
    productListContainer.innerHTML = ''; 

    let filteredProducts = [...allProducts]; // Danh sách sản phẩm hiện tại sau khi lọc/tìm kiếm
    let currentPage = 1;

    // 🔹 Chuẩn hóa giá (lấy giá trị số từ data-price)
    const parsePrice = item => parseInt(item.dataset.price || 0, 10);
    
    // 🔹 Chuẩn hóa ngày (lấy giá trị số từ data-date)
    const parseDate = item => new Date(item.dataset.date || 0).getTime();

    // --- Sắp xếp ---
    function applySort() {
        const sortVal = sortSelect.value;
        
        if (sortVal === "default") {
            // Quay về thứ tự ban đầu trong HTML
            filteredProducts.sort((a, b) => 
                allProducts.indexOf(a) - allProducts.indexOf(b)
            );
        } else {
            filteredProducts.sort((a, b) => {
                const pa = parsePrice(a);
                const pb = parsePrice(b);
                const da = parseDate(a);
                const db = parseDate(b);
                
                if (sortVal === "asc") return pa - pb;    // Giá thấp → cao
                if (sortVal === "desc") return pb - pa;   // Giá cao → thấp
                if (sortVal === "new") return db - da;    // Mới nhất (dựa trên data-date)
                return 0;
            });
        }
        currentPage = 1;
        renderPage();
    }

    // --- Tìm kiếm & Lọc (trên HTML tĩnh) ---
    function applyFilters() {
        const name = document.getElementById("searchName").value.toLowerCase().trim();
        const minVal = document.getElementById("minPrice").value;
        const maxVal = document.getElementById("maxPrice").value;
        const min = minVal ? parseInt(minVal, 10) : 0;
        const max = maxVal ? parseInt(maxVal, 10) : Infinity;

        const catSelect = document.getElementById("searchCategory").value;

        // Lọc trên toàn bộ sản phẩm (allProducts)
        filteredProducts = allProducts.filter(item => {
            const title = item.querySelector(".card-title")?.textContent.toLowerCase() || "";
            const price = parsePrice(item);
            const cat = item.dataset.category || "other";

            const matchName = !name || title.includes(name);
            const matchPrice = price >= min && price <= max;
            const matchCat = (catSelect === "all" || catSelect === cat);

            return matchName && matchPrice && matchCat;
        });

        currentPage = 1;
        applySort(); // Áp dụng sắp xếp sau khi lọc
        
        // Cập nhật trạng thái active của nút filter chính
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        const activeBtn = document.querySelector(`.filter-btn[data-category='${catSelect}']`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    // --- Render lại danh sách và Phân trang ---
    function renderPage() {
        const total = filteredProducts.length;
        const totalPages = Math.ceil(total / perPage);
        
        productListContainer.innerHTML = ""; 

        if (total === 0) {
            productListContainer.innerHTML = `<p class="text-center text-muted py-5">Không tìm thấy sản phẩm nào 😢</p>`;
            pagination.innerHTML = "";
            return;
        }

        const start = (currentPage - 1) * perPage;
        const visibleItems = filteredProducts.slice(start, start + perPage);

        // Hiển thị các sản phẩm được phân trang
        visibleItems.forEach(item => {
            productListContainer.appendChild(item); 
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
                window.scrollTo({ top: productListContainer.offsetTop - 100, behavior: 'smooth' });
            });
            pagination.appendChild(li);
        }
    }

    // --- Gán sự kiện cho Lọc, Sắp xếp và Đặt lại ---

    // Nút Tìm kiếm
    document.getElementById("btnSearch").addEventListener("click", applyFilters);
    document.getElementById("searchName").addEventListener("keydown", e => {
        if (e.key === "Enter") applyFilters();
    });
    
    // Nút Đặt lại
    document.getElementById("btnReset").addEventListener("click", () => {
        // Đặt lại các trường filter về mặc định
        ["searchName", "minPrice", "maxPrice"].forEach(id => (document.getElementById(id).value = ""));
        document.getElementById("searchCategory").value = "all";
        sortSelect.value = "default";
        
        // Kích hoạt lại nút "Tất cả"
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        document.querySelector(".filter-btn[data-category='all']").classList.add("active");
        
        filteredProducts = [...allProducts]; 
        renderPage();
    });

    // Select Sắp xếp
    sortSelect.addEventListener("change", applySort);

    // Các nút Phân loại (Filter buttons)
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const category = e.currentTarget.dataset.category;
            
            // Cập nhật trạng thái active
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            
            // Đồng bộ sidebar filter và clear các trường khác
            document.getElementById("searchCategory").value = category; 
            document.getElementById("searchName").value = "";
            document.getElementById("minPrice").value = "";
            document.getElementById("maxPrice").value = "";
            sortSelect.value = "defaulSt";
            
            applyFilters();
        });
    });

    // --- Khởi tạo ban đầu ---
    // Gọi applySort() để sắp xếp mặc định và áp dụng phân trang
    applySort(); 
});

// --- AOS Init (Giữ lại để đảm bảo hoạt ảnh hoạt động) ---
AOS.init();
