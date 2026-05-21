const API_URL = 'https://ruanjiangc-work.vercel.app/api';
let currentCanteen = null;
let currentOrder = null;
let refreshInterval = null;

async function canteenLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('canteenUsername').value;
    const password = document.getElementById('canteenPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/canteen/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (data.success) {
            currentCanteen = data.canteen;
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('dashboardPage').style.display = 'block';
            document.getElementById('canteenName').textContent = currentCanteen.name;
            startRefresh();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('登录失败，请重试');
    }
}

function logout() {
    currentCanteen = null;
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    document.getElementById('dashboardPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
}

function goBack() {
    window.location.href = 'index.html';
}

function startRefresh() {
    loadOrders();
    loadMenu();
    refreshInterval = setInterval(() => {
        loadOrders();
    }, 3000);
}

async function loadOrders() {
    await loadPendingOrders();
    await loadCookingOrders();
    await loadReadyOrders();
}

async function loadMenu() {
    try {
        const response = await fetch(`${API_URL}/menu`);
        const data = await response.json();
        if (data.success) {
            renderMenu(data.menu);
        }
    } catch (error) {
        console.error('加载菜单失败:', error);
    }
}

function renderMenu(menu) {
    const container = document.getElementById('canteenMenuGrid');
    if (menu.length === 0) {
        container.innerHTML = '<p class="empty-state">暂无菜品</p>';
        return;
    }
    
    let html = '';
    menu.forEach(item => {
        html += `
            <div class="menu-item" data-id="${item.id}">
                <div class="menu-img">
                    <img src="${item.image}" alt="${item.name}">
                    <span class="tag ${item.category}">${item.category === 'hot' ? '热销' : item.category === 'new' ? '新品' : '优惠'}</span>
                </div>
                <div class="menu-content">
                    <h4>${item.name}</h4>
                    <p>${item.description || ''}</p>
                </div>
                <div class="menu-footer">
                    <span class="menu-price">¥${item.price}</span>
                    <div class="menu-actions">
                        <button class="btn btn-secondary" onclick="openEditMenuModal(${item.id})">
                            <i class="fa fa-edit"></i> 编辑
                        </button>
                        <button class="btn btn-danger" onclick="deleteMenu(${item.id})">
                            <i class="fa fa-trash"></i> 删除
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function openAddMenuModal() {
    document.getElementById('menuModalTitle').textContent = '添加菜品';
    document.getElementById('menuForm').reset();
    document.getElementById('menuId').value = '';
    document.getElementById('menuPreviewGroup').style.display = 'none';
    openModal('menuModal');
}

async function openEditMenuModal(id) {
    try {
        const response = await fetch(`${API_URL}/menu/${id}`);
        const data = await response.json();
        if (data.success) {
            const item = data.item;
            document.getElementById('menuModalTitle').textContent = '编辑菜品';
            document.getElementById('menuId').value = item.id;
            document.getElementById('menuName').value = item.name;
            document.getElementById('menuPrice').value = item.price;
            document.getElementById('menuCategory').value = item.category;
            document.getElementById('menuDescription').value = item.description || '';
            document.getElementById('menuImage').value = item.image || '';
            
            if (item.image) {
                document.getElementById('menuPreviewImage').src = item.image;
                document.getElementById('menuPreviewGroup').style.display = 'block';
            } else {
                document.getElementById('menuPreviewGroup').style.display = 'none';
            }
            
            openModal('menuModal');
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('加载菜品信息失败');
    }
}

async function saveMenu(event) {
    event.preventDefault();
    
    const id = document.getElementById('menuId').value;
    const menuData = {
        name: document.getElementById('menuName').value,
        price: document.getElementById('menuPrice').value,
        category: document.getElementById('menuCategory').value,
        description: document.getElementById('menuDescription').value,
        image: document.getElementById('menuImage').value
    };
    
    try {
        let response;
        if (id) {
            response = await fetch(`${API_URL}/menu/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menuData)
            });
        } else {
            response = await fetch(`${API_URL}/menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menuData)
            });
        }
        
        const data = await response.json();
        if (data.success) {
            showSuccess(data.message);
            closeModal();
            loadMenu();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('保存失败，请重试');
    }
}

async function deleteMenu(id) {
    if (!confirm('确定要删除这个菜品吗？')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/menu/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        if (data.success) {
            showSuccess(data.message);
            loadMenu();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('删除失败，请重试');
    }
}

document.getElementById('menuImage').addEventListener('input', function() {
    const previewGroup = document.getElementById('menuPreviewGroup');
    const previewImage = document.getElementById('menuPreviewImage');
    
    if (this.value) {
        previewImage.src = this.value;
        previewGroup.style.display = 'block';
    } else {
        previewGroup.style.display = 'none';
    }
});

async function loadPendingOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/pending`);
        const data = await response.json();
        if (data.success) {
            renderOrders('pendingOrders', data.orders, 'pending');
            document.getElementById('pendingCount').textContent = data.orders.length;
        }
    } catch (error) {
        console.error('加载待接单订单失败:', error);
    }
}

async function loadCookingOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/cooking`);
        const data = await response.json();
        if (data.success) {
            renderOrders('cookingOrders', data.orders, 'cooking');
            document.getElementById('cookingCount').textContent = data.orders.length;
        }
    } catch (error) {
        console.error('加载制作中订单失败:', error);
    }
}

async function loadReadyOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/ready`);
        const data = await response.json();
        if (data.success) {
            renderOrders('readyOrders', data.orders, 'ready');
            document.getElementById('readyCount').textContent = data.orders.length;
        }
    } catch (error) {
        console.error('加载已完成订单失败:', error);
    }
}

function renderOrders(containerId, orders, status) {
    const container = document.getElementById(containerId);
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="empty-state">暂无订单</p>';
        return;
    }
    
    let html = '';
    orders.forEach(order => {
        html += `
            <div class="order-card" data-order-id="${order.id}" onclick="showOrderDetail('${order.id}', '${status}')">
                <div class="order-header">
                    <span class="order-id">订单号：${order.id}</span>
                    <span class="order-time">${order.createTime}</span>
                </div>
                <div class="order-student">
                    <i class="fa fa-user"></i>
                    <span>${order.studentName}</span>
                    <span class="address">${order.address}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `<span>${item.name} x${item.quantity}</span>`).join('')}
                </div>
                <div class="order-footer">
                    <span class="total">¥${order.totalPrice}</span>
                    ${status === 'pending' ? '<span class="status-tag pending">待接单</span>' : ''}
                    ${status === 'cooking' ? '<span class="status-tag cooking">制作中</span>' : ''}
                    ${status === 'ready' ? '<span class="status-tag ready">已完成</span>' : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function showOrderDetail(orderId, status) {
    const ordersContainer = document.getElementById(status + 'Orders');
    const orderCard = ordersContainer.querySelector(`[data-order-id="${orderId}"]`);
    
    if (!orderCard) return;
    
    const orderData = {
        id: orderId,
        studentName: orderCard.querySelector('.order-student span').textContent,
        address: orderCard.querySelector('.address').textContent,
        createTime: orderCard.querySelector('.order-time').textContent,
        items: Array.from(orderCard.querySelectorAll('.order-items span')).map(el => el.textContent),
        totalPrice: orderCard.querySelector('.total').textContent.replace('¥', '')
    };
    
    currentOrder = orderData;
    
    const detailHtml = `
        <div class="detail-row">
            <span class="label">订单号</span>
            <span class="value">${orderData.id}</span>
        </div>
        <div class="detail-row">
            <span class="label">下单时间</span>
            <span class="value">${orderData.createTime}</span>
        </div>
        <div class="detail-row">
            <span class="label">学生姓名</span>
            <span class="value">${orderData.studentName}</span>
        </div>
        <div class="detail-row">
            <span class="label">配送地址</span>
            <span class="value">${orderData.address}</span>
        </div>
        <div class="detail-row">
            <span class="label">订单菜品</span>
            <div class="value">${orderData.items.join('<br>')}</div>
        </div>
        <div class="detail-row total-row">
            <span class="label">订单金额</span>
            <span class="value">¥${orderData.totalPrice}</span>
        </div>
    `;
    
    document.getElementById('orderDetail').innerHTML = detailHtml;
    
    let actionsHtml = '';
    if (status === 'pending') {
        actionsHtml = `
            <button class="btn btn-success" onclick="acceptOrder('${orderId}')">接单</button>
            <button class="btn btn-outline" onclick="closeModal()">取消</button>
        `;
    } else if (status === 'cooking') {
        actionsHtml = `
            <button class="btn btn-primary" onclick="completeOrder('${orderId}')">确认完成</button>
            <button class="btn btn-outline" onclick="closeModal()">取消</button>
        `;
    } else {
        actionsHtml = `
            <button class="btn btn-outline" onclick="closeModal()">关闭</button>
        `;
    }
    
    document.getElementById('modalActions').innerHTML = actionsHtml;
    
    openModal('orderDetailModal');
}

async function acceptOrder(orderId) {
    try {
        const response = await fetch(`${API_URL}/order/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId })
        });
        
        const data = await response.json();
        if (data.success) {
            showSuccess('接单成功，开始制作');
            closeModal();
            loadOrders();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('接单失败，请重试');
    }
}

async function completeOrder(orderId) {
    try {
        const response = await fetch(`${API_URL}/order/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId })
        });
        
        const data = await response.json();
        if (data.success) {
            showSuccess('订单完成，等待配送员抢单');
            closeModal();
            loadOrders();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('操作失败，请重试');
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Panel').classList.add('active');
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
    document.getElementById('canteenLoginForm').addEventListener('submit', canteenLogin);
    document.getElementById('menuForm').addEventListener('submit', saveMenu);
    
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