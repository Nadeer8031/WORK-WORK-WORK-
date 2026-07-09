// ---------- MOCK BACKEND (in-memory) ----------
let users = [
    { id: 1, username: 'jdoe', email: 'jdoe@med.com', gender: 'Male', phone: '+1 555-1234' },
    { id: 2, username: 'asmith', email: 'asmith@med.com', gender: 'Female', phone: '+1 555-5678' },
    { id: 3, username: 'mross', email: 'mross@med.com', gender: 'Male', phone: '+1 555-9012' }
];
let products = [
    { id: 101, name: 'Starter Bundle', price: 299.99, type: 'Bundle' },
    { id: 102, name: 'Pro Dispenser', price: 499.00, type: 'Hardware' },
    { id: 103, name: 'Advanced Subscription', price: 149.99, type: 'Subscription' }
];
let nextUserId = 4;
let nextProductId = 104;

// DOM refs
const usersTbody = document.getElementById('usersTableBody');
const productsTbody = document.getElementById('productsTableBody');
const totalUsersSpan = document.getElementById('totalUsersDisplay');

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
const productModalType = document.getElementById('productModalType');
const productModalTitle = document.getElementById('productModalTitle');
const productModalConfirm = document.getElementById('productModalConfirm');
const productModalCancel = document.getElementById('productModalCancel');

// Remove modal refs
const removeOverlay = document.getElementById('removeOverlay');
const removeConfirmBtn = document.getElementById('removeConfirm');
const removeCancelBtn = document.getElementById('removeCancel');

let currentRemoveTarget = null; // { type: 'user'|'product', id: number }

// ---------- RENDER FUNCTIONS ----------
function renderUsers() {
    let html = '';
    users.forEach(u => {
        html += `<tr>
            <td>${u.username}</td>
            <td>${u.email}</td>
            <td>${u.gender}</td>
            <td>${u.phone}</td>
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

    // Attach events
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const user = users.find(u => u.id === id);
            if (user) openEditUserModal(user);
        });
    });
    document.querySelectorAll('.remove-user-btn').forEach(btn => {
        btn.addEventListener('click', function() {
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
            <td>${p.name}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>${p.type}</td>
            <td>
                <div class="action-icons">
                    <button class="edit-product-btn" data-id="${p.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="remove-product-btn" data-id="${p.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </td>
        </tr>`;
    });
    productsTbody.innerHTML = html;

    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const prod = products.find(p => p.id === id);
            if (prod) openEditProductModal(prod);
        });
    });
    document.querySelectorAll('.remove-product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            currentRemoveTarget = { type: 'product', id };
            removeOverlay.classList.add('open');
        });
    });
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
    productModalId.value = product.id;
    productModalName.value = product.name;
    productModalPrice.value = product.price;
    productModalType.value = product.type;
    productModalConfirm.textContent = 'Update';
    productModalForm.dataset.mode = 'editProduct';
    productModalOverlay.classList.add('open');
}

function openAddUserModal() {
    modalTitle.textContent = 'Add User';
    modalId.value = '';
    modalUsername.value = '';
    modalEmail.value = '';
    modalGender.value = 'Male';
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
    productModalType.value = 'Bundle';
    productModalConfirm.textContent = 'Add';
    productModalForm.dataset.mode = 'addProduct';
    productModalOverlay.classList.add('open');
}

function closeModal() {
    modalOverlay.classList.remove('open');
}

function closeProductModal() {
    productModalOverlay.classList.remove('open');
}

function closeRemoveModal() {
    removeOverlay.classList.remove('open');
    currentRemoveTarget = null;
}

// ---------- FORM SUBMISSION ----------
modalForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const mode = modalForm.dataset.mode;

    if (mode === 'editUser') {
        const id = parseInt(modalId.value);
        const user = users.find(u => u.id === id);
        if (user) {
            user.username = modalUsername.value;
            user.email = modalEmail.value;
            user.gender = modalGender.value;
            user.phone = modalPhone.value;
            renderUsers();
            closeModal();
        }
    } else if (mode === 'addUser') {
        const newUser = {
            id: nextUserId++,
            username: modalUsername.value,
            email: modalEmail.value,
            gender: modalGender.value,
            phone: modalPhone.value
        };
        users.push(newUser);
        renderUsers();
        closeModal();
    }
});

// ---------- MODAL CANCEL ----------
modalCancel.addEventListener('click', closeModal);

// ---------- PRODUCT FORM SUBMISSION ----------
productModalForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const mode = productModalForm.dataset.mode;

    if (mode === 'editProduct') {
        const id = parseInt(productModalId.value);
        const product = products.find(p => p.id === id);
        if (product) {
            product.name = productModalName.value;
            product.price = parseFloat(productModalPrice.value);
            product.type = productModalType.value;
            renderProducts();
            closeProductModal();
        }
    } else if (mode === 'addProduct') {
        const newProduct = {
            id: nextProductId++,
            name: productModalName.value,
            price: parseFloat(productModalPrice.value),
            type: productModalType.value
        };
        products.push(newProduct);
        renderProducts();
        closeProductModal();
    }
});

// ---------- PRODUCT MODAL CANCEL ----------
productModalCancel.addEventListener('click', closeProductModal);

// ---------- REMOVE CONFIRM ----------
removeConfirmBtn.addEventListener('click', function() {
    if (!currentRemoveTarget) return;

    if (currentRemoveTarget.type === 'user') {
        users = users.filter(u => u.id !== currentRemoveTarget.id);
        renderUsers();
    } else if (currentRemoveTarget.type === 'product') {
        products = products.filter(p => p.id !== currentRemoveTarget.id);
        renderProducts();
    }
    closeRemoveModal();
});

removeCancelBtn.addEventListener('click', closeRemoveModal);

// ---------- SIDEBAR NAVIGATION ----------
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Remove active from all
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Hide all pages
        document.querySelectorAll('.page-content').forEach(p => p.hidden = true);

        // Show selected page
        const page = this.dataset.page;
        const target = document.getElementById('page-' + page);
        if (target) target.hidden = false;
    });
});

// ---------- ADD BUTTONS ----------
document.getElementById('addUserBtn').addEventListener('click', openAddUserModal);
document.getElementById('addProductBtn').addEventListener('click', openAddProductModal);

// ---------- INIT ----------
renderUsers();
renderProducts();