const API_URL = '/api';
let menu = [];
let cart = [];
let currentStudent = null;

async function loadMenu() {
    try {
        const response = await fetch(`${API_URL}/menu`);
        const data = await response.json();
        if (data.success) {
            menu = data.menu;
            renderMenu();
        }
    } catch (error) {
        console.error('加载菜单失败:', error);
        document.getElementById('menuGrid').innerHTML = '<p class="empty-cart">加载失败，请刷新页面</p>';
    }
}

function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';
    
    menu.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.dataset.category = item.category;
        menuItem.innerHTML = `
            <div class="menu-img">
                <img src="${item.image}" alt="${item.name}">
                <span class="tag ${item.category}">${item.category === 'hot' ? '热销' : item.category === 'new' ? '新品' : '8折'}</span>
            </div>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="price-row">
                <span class="price">¥${item.price}</span>
                <button class="add-cart" onclick="addToCart(${item.id})">
                    <i class="fa fa-plus"></i>
                </button>
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });
}

function addToCart(itemId) {
    if (!currentStudent) {
        openModal('loginModal');
        return;
    }
    
    const item = menu.find(item => item.id === itemId);
    if (item) {
        const existingItem = cart.find(cartItem => cartItem.id === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCart();
        openCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const totalPrice = document.querySelector('.total-price');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">购物车为空</p>';
        cartCount.textContent = '0';
        totalPrice.textContent = '¥0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>¥${item.price}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-btn-minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-btn-plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="cart-btn-remove" onclick="removeFromCart(${item.id})">×</button>
                </div>
                <span class="cart-item-total">¥${itemTotal}</span>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalPrice.textContent = `¥${total}`;
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

function openCart() {
    document.getElementById('cartOverlay').style.display = 'block';
    document.getElementById('cartPanel').style.right = '0';
}

function closeCart() {
    document.getElementById('cartOverlay').style.display = 'none';
    document.getElementById('cartPanel').style.right = '-400px';
}

async function checkout() {
    if (!currentStudent) {
        openModal('loginModal');
        return;
    }
    
    if (cart.length === 0) {
        showError('购物车为空');
        return;
    }
    
    const address = document.getElementById('deliveryAddress').value;
    if (!address.trim()) {
        showError('请输入配送地址');
        return;
    }
    
    const items = cart.map(item => ({
        menuId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));
    
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    try {
        const response = await fetch(`${API_URL}/order/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: currentStudent.id,
                studentName: currentStudent.name,
                items,
                totalPrice,
                address
            })
        });
        
        const data = await response.json();
        if (data.success) {
            showSuccess(`订单提交成功！订单号：${data.order.id}`);
            cart = [];
            updateCart();
            closeCart();
            document.getElementById('deliveryAddress').value = '';
            currentStudent.balance -= totalPrice;
            updateUserInfo();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('下单失败，请重试');
    }
}

function filterMenu(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

async function studentLogin(event) {
    event.preventDefault();
    
    const id = document.getElementById('studentId').value;
    const password = document.getElementById('studentPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/student/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password })
        });
        
        const data = await response.json();
        if (data.success) {
            currentStudent = data.student;
            closeModal();
            updateUserInfo();
            showSuccess(`欢迎，${currentStudent.name}！`);
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('登录失败，请重试');
    }
}

function updateUserInfo() {
    const userArea = document.getElementById('userArea');
    userArea.innerHTML = `
        <div class="user-info">
            <span>欢迎：${currentStudent.name}</span>
            <span class="balance">余额：¥${currentStudent.balance}</span>
            <button class="btn btn-outline" onclick="logout()">退出</button>
        </div>
    `;
}

function logout() {
    currentStudent = null;
    const userArea = document.getElementById('userArea');
    userArea.innerHTML = `
        <button id="loginBtn" class="btn btn-primary" onclick="openModal('loginModal')">
            <i class="fa fa-user"></i> 学生登录
        </button>
    `;
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

function showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    openModal('successModal');
}

function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    openModal('errorModal');
}

document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    
    document.getElementById('studentLoginForm').addEventListener('submit', studentLogin);
    
    document.getElementById('cartIcon').addEventListener('click', openCart);
    
    document.getElementById('cartOverlay').addEventListener('click', closeCart);
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterMenu(btn.dataset.category);
        });
    });
    
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
});