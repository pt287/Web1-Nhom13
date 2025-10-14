// admin-script.js
document.addEventListener('DOMContentLoaded', () => {
  // Sidebar toggle (work on all pages)
  const toggleBtn = document.querySelectorAll('#sidebarToggle');
  toggleBtn.forEach(b => b.addEventListener('click', () => {
    document.getElementById('sidebar-wrapper').classList.toggle('collapsed');
  }));

  // Products page logic: render products, add/edit/delete in local state
  if(document.getElementById('productTableBody')){
    let products = window.demoProducts || [];
    const tbody = document.getElementById('productTableBody');
    const renderProducts = (list) => {
      tbody.innerHTML = '';
      list.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.code}</td>
          <td><img src="${p.image}" alt="${p.name}"></td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${p.price.toLocaleString('vi-VN')} ₫</td>
          <td>${p.qty}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary btn-edit">Sửa</button>
            <button class="btn btn-sm btn-outline-danger btn-del">Xóa</button>
          </td>
        `;
        // edit & delete handlers
        tr.querySelector('.btn-edit').addEventListener('click', ()=> openEditModal(p));
        tr.querySelector('.btn-del').addEventListener('click', ()=> {
          if(confirm('Xác nhận xóa sản phẩm '+p.name+' ?')) {
            products = products.filter(x=>x.code !== p.code);
            renderProducts(products);
            alert('Đã xóa (demo).');
          }
        });
        tbody.appendChild(tr);
      });
    };
    renderProducts(products);

    // Open Add modal
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    document.getElementById('openAddModal').addEventListener('click', ()=>{
      document.getElementById('productModalTitle').textContent = 'Thêm sản phẩm';
      document.getElementById('productForm').reset();
      document.getElementById('p_code').disabled = false;
      productModal.show();
    });

    // Save product
    document.getElementById('saveProduct').addEventListener('click', ()=>{
      const code = document.getElementById('p_code').value.trim();
      const name = document.getElementById('p_name').value.trim();
      if(!code || !name){ alert('Mã và tên không được để trống'); return; }
      const obj = {
        code,
        name,
        category: document.getElementById('p_category').value,
        cost: Number(document.getElementById('p_cost').value)||0,
        price: Number(document.getElementById('p_price').value)||0,
        qty: Number(document.getElementById('p_qty').value)||0,
        image: document.getElementById('p_image').value || '../assets/images/default.jpg',
      };
      const exists = products.find(x=>x.code === code);
      if(exists){
        // update
        products = products.map(x=> x.code===code ? {...x, ...obj} : x);
        alert('Cập nhật sản phẩm (demo).');
      } else {
        products.unshift(obj);
        alert('Thêm sản phẩm (demo).');
      }
      productModal.hide();
      renderProducts(products);
    });

    // quick add from dashboard
    const saveQuick = document.getElementById('saveQuickProduct');
    if(saveQuick){
      saveQuick.addEventListener('click', ()=>{
        const qname = document.getElementById('p_name_quick').value.trim();
        const qcat = document.getElementById('p_category_quick').value;
        if(!qname){ alert('Nhập tên sản phẩm'); return; }
        const newCode = 'P' + String(Math.floor(Math.random()*900)+100);
        products.unshift({code:newCode, name:qname, category:qcat, cost:Number(document.getElementById('p_cost_quick').value)||0, price: Math.round((Number(document.getElementById('p_cost_quick').value)||0)*2), qty: Number(document.getElementById('p_qty_quick').value)||1, image:'../assets/images/default.jpg'});
        renderProducts(products);
        bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
        alert('Đã thêm (demo).');
      });
    }

    // edit helper
    function openEditModal(p){
      document.getElementById('productModalTitle').textContent = 'Sửa sản phẩm';
      document.getElementById('p_code').value = p.code;
      document.getElementById('p_code').disabled = true;
      document.getElementById('p_name').value = p.name;
      document.getElementById('p_category').value = p.category;
      document.getElementById('p_cost').value = p.cost;
      document.getElementById('p_price').value = p.price;
      document.getElementById('p_qty').value = p.qty;
      document.getElementById('p_image').value = p.image;
      document.getElementById('p_desc').value = p.desc || '';
      productModal.show();
    }

    // search & filter
    document.getElementById('searchProduct').addEventListener('input', (e)=>{
      const q = e.target.value.toLowerCase();
      const cat = document.getElementById('filterCategory').value;
      const filtered = products.filter(p => (p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) && (cat? p.category===cat : true));
      renderProducts(filtered);
    });
    document.getElementById('filterCategory').addEventListener('change', ()=>{
      document.getElementById('searchProduct').dispatchEvent(new Event('input'));
    });
    document.getElementById('refreshProducts').addEventListener('click', ()=> renderProducts(products));
  }

  // Users page logic
  if(document.getElementById('userTableBody')){
    let users = window.demoUsers || [];
    const tbody = document.getElementById('userTableBody');
    function renderUsers(){
      tbody.innerHTML = '';
      users.forEach(u=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td>${u.phone}</td><td>${u.locked?'<span class="badge bg-danger">Đã khoá</span>':'<span class="badge bg-success">Hoạt động</span>'}</td><td>
          <button class="btn btn-sm btn-outline-warning btn-reset">Reset PW</button>
          <button class="btn btn-sm btn-outline-primary btn-toggle">${u.locked?'Mở khoá':'Khoá'}</button>
        </td>`;
        tr.querySelector('.btn-reset').addEventListener('click', ()=> {
          if(confirm('Reset mật khẩu cho '+u.name+' ?')) alert('Mật khẩu tạm thời: 123456 (demo).');
        });
        tr.querySelector('.btn-toggle').addEventListener('click', ()=> {
          u.locked = !u.locked;
          renderUsers();
        });
        tbody.appendChild(tr);
      });
    }
    renderUsers();
    // add user (demo)
    document.getElementById('addUserBtn')?.addEventListener('click', ()=>{
      const id = 'KH' + String(Math.floor(Math.random()*900)+100);
      users.push({id, name:'Khách mới '+id, email:'new@demo.com', phone:'0900000000', locked:false});
      renderUsers();
      alert('Đã tạo khách (demo).');
    });
  }
});
