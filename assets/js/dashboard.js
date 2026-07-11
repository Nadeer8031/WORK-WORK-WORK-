// ---------- ADMIN GUARD ----------
(function () {
    fetch('auth/check_admin.php')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (!data.success) {
                window.location.href = 'admin-login.html';
            }
        })
        .catch(function () {
            window.location.href = 'admin-login.html';
        });
})();

// ---------- ADMIN LOGOUT ----------
(function () {
    var logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            fetch('auth/logout.php').finally(function () {
                window.location.href = 'admin-login.html';
            });
        });
    }
})();

// ---------- REAL BACKEND (via auth/admin_users.php, auth/products.php & auth/bundles.php) ----------
let users = [];
let products = [];
let bundles = [];

// DOM refs
const usersTbody = document.getElementById('usersTableBody');
const productsTbody = document.getElementById('productsTableBody');
const bundlesTbody = document.getElementById('bundlesTableBody');
const totalUsersSpan = document.getElementById('totalUsersDisplay');

// Product/Bundle subtab refs
const subtabProducts = document.getElementById('subtabProducts');
const subtabBundles = document.getElementById('subtabBundles');
const productsTableWrapper = document.getElementById('productsTableWrapper');
const bundlesTableWrapper = document.getElementById('bundlesTableWrapper');
const addProductBtn = document.getElementById('addProductBtn');
const addBundleBtn = document.getElementById('addBundleBtn');

// Modal refs
const modalOverlay = document.getElementById('modalOverlay');
const modalForm = document.getElementById('modalForm');
const modalId = document.getElementById('modalId');
const modalUsername = document.getElementById('modalUsername');
const modalEmail = document.getElementById('modalEmail');
const modalGender = document.getElementById('modalGender');
const modalPhone = document.getElementById('modalPhone');
const modalTitle = document.getElementById('modalTitle');
const modalConfirm = document.getElementById('modalConfirm');
const modalCancel = document.getElementById('modalCancel');

// Product modal refs
const productModalOverlay = document.getElementById('productModalOverlay');
const productModalForm = document.getElementById('productModalForm');
const productModalId = document.getElementById('productModalId');
const productModalName = document.getElementById('productModalName');
const productModalPrice = document.getElementById('productModalPrice');
const productModalStock = document.getElementById('productModalStock');
const productModalTitle = document.getElementById('productModalTitle');
const productModalConfirm = document.getElementById('productModalConfirm');
const productModalCancel = document.getElementById('productModalCancel');

// Bundle modal refs
const bundleModalOverlay = document.getElementById('bundleModalOverlay');
const bundleModalForm = document.getElementById('bundleModalForm');
const bundleModalId = document.getElementById('bundleModalId');
const bundleModalName = document.getElementById('bundleModalName');
const bundleModalPrice = document.getElementById('bundleModalPrice');
const bundleModalStock = document.getElementById('bundleModalStock');
const bundleModalTitle = document.getElementById('bundleModalTitle');
const bundleModalConfirm = document.getElementById('bundleModalConfirm');
const bundleModalCancel = document.getElementById('bundleModalCancel');

// Remove modal refs
const removeOverlay = document.getElementById('removeOverlay');
const removeConfirmBtn = document.getElementById('removeConfirm');
const removeCancelBtn = document.getElementById('removeCancel');

let currentRemoveTarget = null;

// ---------- API HELPERS ----------
function apiGet(url) {
    return fetch(url).then(function (r) { return r.json(); });
}

function apiPost(url, data) {
    var fd = new FormData();
    for (var key in data) {
        if (data.hasOwnProperty(key)) fd.append(key, data[key]);
    }
    return fetch(url, { method: 'POST', body: fd }).then(function (r) { return r.json(); });
}

function apiPut(url, data) {
    var params = new URLSearchParams();
    for (var key in data) {
        if (data.hasOwnProperty(key)) params.append(key, data[key]);
    }
    return fetch(url, { method: 'PUT', body: params }).then(function (r) { return r.json(); });
}

function apiDelete(url, data) {
    var params = new URLSearchParams();
    for (var key in data) {
        if (data.hasOwnProperty(key)) params.append(key, data[key]);
    }
    return fetch(url, { method: 'DELETE', body: params }).then(function (r) { return r.json(); });
}

// ---------- LOAD DATA ----------
function loadUsers() {
    return apiGet('auth/admin_users.php').then(function (data) {
        if (data.success) users = data.users || [];
        renderUsers();
    }).catch(function () {
        users = [];
        renderUsers();
    });
}

function loadProducts() {
    return apiGet('auth/products.php').then(function (data) {
        if (data.success) products = data.products || [];
        renderProducts();
    }).catch(function () {
        products = [];
        renderProducts();
    });
}

function loadBundles() {
    return apiGet('auth/bundles.php').then(function (data) {
        if (data.success) bundles = data.bundles || [];
        renderBundles();
    }).catch(function () {
        bundles = [];
        renderBundles();
    });
}

// ---------- RENDER FUNCTIONS ----------
function renderUsers() {
    let html = '';
    users.forEach(u => {
        html += `<tr>
            <td>${escapeHtml(u.username)}</td>
            <td>${escapeHtml(u.email)}</td>
            <td>${escapeHtml(u.gender)}</td>
            <td>${escapeHtml(u.phone)}</td>
            <td>
                <div class="action-icons">
                    <button class="edit-user-btn" data-id="${u.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="remove-user-btn" data-id="${u.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>`;
    });
    usersTbody.innerHTML = html;
    totalUsersSpan.textContent = users.length;

    document.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const user = users.find(u => u.id === id);
            if (user) openEditUserModal(user);
        });
    });
    document.querySelectorAll('.remove-user-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            currentRemoveTarget = { type: 'user', id };
            removeOverlay.classList.add('open');
        });
    });
}

function renderProducts() {
    let html = '';
    products.forEach(p => {
        html += `<tr>
            <td>${escapeHtml(p.product_name)}</td>
            <td>$${Number(p.price || 0).toFixed(2)}</td>
            <td>${escapeHtml(String(p.stock_quantity))}</td>
            <td>
                <div class="action-icons">
                    <button class="edit-product-btn" data-id="${p.product_id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="remove-product-btn" data-id="${p.product_id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>`;
    });
    productsTbody.innerHTML = html;

    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const prod = products.find(p => p.product_id === id);
            if (prod) openEditProductModal(prod);
        });
    });
    document.querySelectorAll('.remove-product-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            currentRemoveTarget = { type: 'product', id };
            removeOverlay.classList.add('open');
        });
    });
}

function renderBundles() {
    let html = '';
    bundles.forEach(b => {
        html += `<tr>
            <td>${escapeHtml(b.bundle_name)}</td>
            <td>$${Number(b.bundle_price || 0).toFixed(2)}</td>
            <td>${escapeHtml(String(b.stock_quantity))}</td>
            <td>
                <div class="action-icons">
                    <button class="edit-bundle-btn" data-id="${b.bundle_id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="remove-bundle-btn" data-id="${b.bundle_id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>`;
    });
    bundlesTbody.innerHTML = html;

    document.querySelectorAll('.edit-bundle-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            const bundle = bundles.find(b => b.bundle_id === id);
            if (bundle) openEditBundleModal(bundle);
        });
    });
    document.querySelectorAll('.remove-bundle-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id);
            currentRemoveTarget = { type: 'bundle', id };
            removeOverlay.classList.add('open');
        });
    });
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ---------- MODAL FUNCTIONS ----------
function openEditUserModal(user) {
    modalTitle.textContent = 'Edit User';
    modalId.value = user.id;
    modalUsername.value = user.username;
    modalEmail.value = user.email;
    modalGender.value = user.gender;
    modalPhone.value = user.phone;
    modalConfirm.textContent = 'Update';
    modalForm.dataset.mode = 'editUser';
    modalOverlay.classList.add('open');
}

function openEditProductModal(product) {
    productModalTitle.textContent = 'Edit Product';
    productModalId.value = product.product_id;
    productModalName.value = product.product_name;
    productModalPrice.value = product.price;
    productModalStock.value = product.stock_quantity;
    productModalConfirm.textContent = 'Update';
    productModalForm.dataset.mode = 'editProduct';
    productModalOverlay.classList.add('open');
}

function openEditBundleModal(bundle) {
    bundleModalTitle.textContent = 'Edit Bundle';
    bundleModalId.value = bundle.bundle_id;
    bundleModalName.value = bundle.bundle_name;
    bundleModalPrice.value = bundle.bundle_price;
    bundleModalStock.value = bundle.stock_quantity;
    bundleModalConfirm.textContent = 'Update';
    bundleModalForm.dataset.mode = 'editBundle';
    bundleModalOverlay.classList.add('open');
}

function openAddUserModal() {
    modalTitle.textContent = 'Add User';
    modalId.value = '';
    modalUsername.value = '';
    modalEmail.value = '';
    modalGender.value = 'male';
    modalPhone.value = '';
    modalConfirm.textContent = 'Add';
    modalForm.dataset.mode = 'addUser';
    modalOverlay.classList.add('open');
}

function openAddProductModal() {
    productModalTitle.textContent = 'Add Product';
    productModalId.value = '';
    productModalName.value = '';
    productModalPrice.value = '';
    productModalStock.value = '';
    productModalConfirm.textContent = 'Add';
    productModalForm.dataset.mode = 'addProduct';
    productModalOverlay.classList.add('open');
}

function openAddBundleModal() {
    bundleModalTitle.textContent = 'Add Bundle';
    bundleModalId.value = '';
    bundleModalName.value = '';
    bundleModalPrice.value = '';
    bundleModalStock.value = '';
    bundleModalConfirm.textContent = 'Add';
    bundleModalForm.dataset.mode = 'addBundle';
    bundleModalOverlay.classList.add('open');
}

function closeModal() { modalOverlay.classList.remove('open'); }
function closeProductModal() { productModalOverlay.classList.remove('open'); }
function closeBundleModal() { bundleModalOverlay.classList.remove('open'); }
function closeRemoveModal() { removeOverlay.classList.remove('open'); currentRemoveTarget = null; }

// ---------- USER FORM SUBMISSION ----------
modalForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const mode = modalForm.dataset.mode;

    if (mode === 'editUser') {
        const id = parseInt(modalId.value);
        apiPut('auth/admin_users.php', {
            id: id,
            username: modalUsername.value,
            email: modalEmail.value,
            gender: modalGender.value,
            phone: modalPhone.value
        }).then(function () {
            loadUsers();
            closeModal();
        });
    } else if (mode === 'addUser') {
        apiPost('auth/admin_users.php', {
            username: modalUsername.value,
            email: modalEmail.value,
            gender: modalGender.value,
            phone: modalPhone.value
        }).then(function () {
            loadUsers();
            closeModal();
        });
    }
});

modalCancel.addEventListener('click', closeModal);

// ---------- PRODUCT FORM SUBMISSION ----------
productModalForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const mode = productModalForm.dataset.mode;
    const confirmBtn = productModalConfirm;
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Saving...';
    confirmBtn.disabled = true;

    if (mode === 'editProduct') {
        const id = parseInt(productModalId.value);
        apiPut('auth/products.php', {
            product_id: id,
            product_name: productModalName.value,
            price: parseFloat(productModalPrice.value) || 0,
            stock_quantity: parseInt(productModalStock.value) || 0
        }).then(function (result) {
            if (result && result.success) {
                loadProducts();
                closeProductModal();
            } else {
                alert(result && result.message ? result.message : 'Failed to update product.');
            }
        }).catch(function () {
            alert('Something went wrong. Please try again.');
        }).finally(function () {
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
        });
    } else if (mode === 'addProduct') {
        apiPost('auth/products.php', {
            product_name: productModalName.value,
            price: parseFloat(productModalPrice.value) || 0,
            stock_quantity: parseInt(productModalStock.value) || 0
        }).then(function (result) {
            if (result && result.success) {
                loadProducts();
                closeProductModal();
            } else {
                alert(result && result.message ? result.message : 'Failed to add product.');
            }
        }).catch(function () {
            alert('Something went wrong. Please try again.');
        }).finally(function () {
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
        });
    }
});

productModalCancel.addEventListener('click', closeProductModal);

// ---------- BUNDLE FORM SUBMISSION ----------
bundleModalForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const mode = bundleModalForm.dataset.mode;
    const confirmBtn = bundleModalConfirm;
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Saving...';
    confirmBtn.disabled = true;

    if (mode === 'editBundle') {
        const id = parseInt(bundleModalId.value);
        apiPut('auth/bundles.php', {
            bundle_id: id,
            bundle_name: bundleModalName.value,
            bundle_price: parseFloat(bundleModalPrice.value) || 0,
            stock_quantity: parseInt(bundleModalStock.value) || 0
        }).then(function (result) {
            if (result && result.success) {
                loadBundles();
                closeBundleModal();
            } else {
                alert(result && result.message ? result.message : 'Failed to update bundle.');
            }
        }).catch(function () {
            alert('Something went wrong. Please try again.');
        }).finally(function () {
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
        });
    } else if (mode === 'addBundle') {
        apiPost('auth/bundles.php', {
            bundle_name: bundleModalName.value,
            bundle_price: parseFloat(bundleModalPrice.value) || 0,
            stock_quantity: parseInt(bundleModalStock.value) || 0
        }).then(function (result) {
            if (result && result.success) {
                loadBundles();
                closeBundleModal();
            } else {
                alert(result && result.message ? result.message : 'Failed to add bundle.');
            }
        }).catch(function () {
            alert('Something went wrong. Please try again.');
        }).finally(function () {
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
        });
    }
});

bundleModalCancel.addEventListener('click', closeBundleModal);

// ---------- REMOVE CONFIRM ----------
removeConfirmBtn.addEventListener('click', function () {
    if (!currentRemoveTarget) return;

    if (currentRemoveTarget.type === 'user') {
        apiDelete('auth/admin_users.php', { id: currentRemoveTarget.id }).then(function () {
            loadUsers();
            closeRemoveModal();
        });
    } else if (currentRemoveTarget.type === 'product') {
        apiDelete('auth/products.php', { product_id: currentRemoveTarget.id }).then(function () {
            loadProducts();
            closeRemoveModal();
        });
    } else if (currentRemoveTarget.type === 'bundle') {
        apiDelete('auth/bundles.php', { bundle_id: currentRemoveTarget.id }).then(function () {
            loadBundles();
            closeRemoveModal();
        });
    }
});

removeCancelBtn.addEventListener('click', closeRemoveModal);

// ---------- SIDEBAR NAVIGATION ----------
document.querySelectorAll('.nav-link:not(.logout-link)').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.page-content').forEach(p => p.hidden = true);
        const page = this.dataset.page;
        const target = document.getElementById('page-' + page);
        if (target) target.hidden = false;
    });
});

// ---------- ADD BUTTONS ----------
document.getElementById('addUserBtn').addEventListener('click', openAddUserModal);
addProductBtn.addEventListener('click', openAddProductModal);
addBundleBtn.addEventListener('click', openAddBundleModal);

// ---------- PRODUCT / BUNDLE SUBTABS ----------
function showProductsSubtab() {
    subtabProducts.classList.add('active');
    subtabBundles.classList.remove('active');
    productsTableWrapper.hidden = false;
    bundlesTableWrapper.hidden = true;
    addProductBtn.hidden = false;
    addBundleBtn.hidden = true;
}

function showBundlesSubtab() {
    subtabBundles.classList.add('active');
    subtabProducts.classList.remove('active');
    bundlesTableWrapper.hidden = false;
    productsTableWrapper.hidden = true;
    addBundleBtn.hidden = false;
    addProductBtn.hidden = true;
}

subtabProducts.addEventListener('click', showProductsSubtab);
subtabBundles.addEventListener('click', showBundlesSubtab);

// ---------- EXPORT MENU ----------
(function () {
    var exportBtn = document.getElementById('exportBtn');
    var exportMenu = document.getElementById('exportMenu');
    if (!exportBtn || !exportMenu) return;

    function openMenu() { exportMenu.hidden = false; }
    function closeMenu() { exportMenu.hidden = true; }

    exportBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (exportMenu.hidden) openMenu(); else closeMenu();
    });

    exportMenu.querySelectorAll('.export-menu-item').forEach(function (item) {
        item.addEventListener('click', function () {
            var section = item.dataset.export;
            closeMenu();
            // The endpoint sends a CSV with a Content-Disposition: attachment
            // header, so navigating to it just triggers a download.
            window.location.href = 'auth/admin_export.php?section=' + encodeURIComponent(section);
        });
    });

    document.addEventListener('click', function (e) {
        if (!exportMenu.hidden && !exportMenu.contains(e.target) && e.target !== exportBtn) {
            closeMenu();
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });
})();

// ---------- INIT ----------
loadUsers();
loadProducts();
loadBundles();
