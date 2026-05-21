const menuItems = [
    { id: 1, name: '脆皮炸鸡饭', price: 15, category: 'hot', desc: '外酥里嫩，香气四溢' },
    { id: 2, name: '红烧牛肉面', price: 18, category: 'new', desc: '肉质鲜嫩，汤汁浓郁' },
    { id: 3, name: '蛋炒饭', price: 8, category: 'discount', desc: '粒粒分明，蛋香十足' },
    { id: 4, name: '番茄炒蛋', price: 12, category: 'hot', desc: '酸甜可口，营养均衡' },
    { id: 5, name: '红烧肉', price: 22, category: 'new', desc: '肥而不腻，入口即化' },
    { id: 6, name: '鸡蛋炒面', price: 10, category: 'hot', desc: '劲道爽滑，香气扑鼻' }
];

let cart = [];

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    const targetLink = document.querySelector(`a[href="#${sectionId}"]`);
    
    if (targetSection) {
        targetSection.classList.add('active');
    }
    if (targetLink) {
        targetLink.classList.add('active');
    }
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

function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (item) {
        const existingItem = cart.find(cartItem => cartItem.id === itemId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCart();
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
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>¥${item.price} x ${item.quantity}</span>
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

function checkout() {
    if (cart.length === 0) {
        alert('购物车为空，请先添加商品');
        return;
    }
    openModal('payModal');
}

function trackOrder(orderId) {
    alert(`正在跟踪订单 ${orderId}...\n\n订单状态：配送中\n预计送达时间：10分钟后`);
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

function filterOrders(status) {
    const orderCards = document.querySelectorAll('.order-card');
    orderCards.forEach(card => {
        if (status === 'all' || card.dataset.status === status) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            openModal('loginModal');
        });
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    const addCartBtns = document.querySelectorAll('.add-cart');
    addCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = parseInt(btn.dataset.id);
            addToCart(itemId);
        });
    });

    const menuFilterBtns = document.querySelectorAll('.menu-grid + .filter-bar .filter-btn');
    menuFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterMenu(btn.dataset.category);
        });
    });

    const orderFilterBtns = document.querySelectorAll('.section-header .filter-btn');
    orderFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.dataset.status;
            if (status) {
                filterOrders(status);
            }
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

    const payMethods = document.querySelectorAll('.pay-method');
    payMethods.forEach(method => {
        method.addEventListener('click', () => {
            payMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
        });
    });

    const payBtn = document.querySelector('.pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', () => {
            alert('支付成功！订单已提交，正在准备配餐...');
            closeModal();
            cart = [];
            updateCart();
            showSection('orders');
        });
    }

    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('登录成功！欢迎使用校园外卖专送系统');
            closeModal();
            loginBtn.innerHTML = '<i class="fa fa-user"></i> 学生';
        });
    }
});