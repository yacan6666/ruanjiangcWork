const API_URL = '/api';
let currentDeliveryman = null;
let currentOrder = null;
let refreshInterval = null;

async function deliverymanLogin(event) {
    event.preventDefault();
    
    const id = document.getElementById('deliverymanId').value;
    const password = document.getElementById('deliverymanPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/deliveryman/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password })
        });
        
        const data = await response.json();
        if (data.success) {
            currentDeliveryman = data.deliveryman;
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('dashboardPage').style.display = 'block';
            document.getElementById('deliverymanName').textContent = currentDeliveryman.name;
            startRefresh();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('登录失败，请重试');
    }
}

function logout() {
    currentDeliveryman = null;
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
    refreshInterval = setInterval(loadOrders, 3000);
}

async function loadOrders() {
    await loadReadyOrders();
    await loadDeliveringOrders();
}

async function loadReadyOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/ready`);
        const data = await response.json();
        if (data.success) {
            renderReadyOrders(data.orders);
            document.getElementById('readyCount').textContent = data.orders.length;
        }
    } catch (error) {
        console.error('加载待抢订单失败:', error);
    }
}

async function loadDeliveringOrders() {
    try {
        const response = await fetch(`${API_URL}/orders/deliveryman/${currentDeliveryman.id}`);
        const data = await response.json();
        if (data.success) {
            renderDeliveringOrders(data.orders);
            document.getElementById('deliveringCount').textContent = data.orders.length;
        }
    } catch (error) {
        console.error('加载配送中订单失败:', error);
    }
}

function renderReadyOrders(orders) {
    const container = document.getElementById('readyOrders');
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="empty-state">暂无待抢订单</p>';
        return;
    }
    
    let html = '';
    orders.forEach(order => {
        html += `
            <div class="order-card ready" data-order-id="${order.id}">
                <div class="order-header">
                    <span class="order-id">订单号：${order.id}</span>
                    <span class="status-tag ready">待抢单</span>
                </div>
                <div class="order-student">
                    <i class="fa fa-user"></i>
                    <span>${order.studentName}</span>
                </div>
                <div class="order-address">
                    <i class="fa fa-map-marker"></i>
                    <span>${order.address}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `<span>${item.name} x${item.quantity}</span>`).join('')}
                </div>
                <div class="order-footer">
                    <span class="total">¥${order.totalPrice}</span>
                    <button class="btn btn-success grab-btn" onclick="grabOrder('${order.id}')">抢单</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderDeliveringOrders(orders) {
    const container = document.getElementById('deliveringOrders');
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="empty-state">暂无配送中订单</p>';
        return;
    }
    
    let html = '';
    orders.forEach(order => {
        html += `
            <div class="order-card delivering" data-order-id="${order.id}" onclick="showOrderDetail('${order.id}', 'delivering')">
                <div class="order-header">
                    <span class="order-id">订单号：${order.id}</span>
                    <span class="status-tag delivering">配送中</span>
                </div>
                <div class="order-student">
                    <i class="fa fa-user"></i>
                    <span>${order.studentName}</span>
                </div>
                <div class="order-address">
                    <i class="fa fa-map-marker"></i>
                    <span>${order.address}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `<span>${item.name} x${item.quantity}</span>`).join('')}
                </div>
                <div class="order-footer">
                    <span class="total">¥${order.totalPrice}</span>
                    <button class="btn btn-primary" onclick="deliverOrder('${order.id}')">确认送达</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

async function grabOrder(orderId) {
    if (!currentDeliveryman) {
        showError('请先登录');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/order/grab`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId,
                deliverymanId: currentDeliveryman.id,
                deliverymanName: currentDeliveryman.name
            })
        });
        
        const data = await response.json();
        if (data.success) {
            showSuccess('抢单成功！请尽快前往食堂取餐');
            loadOrders();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('抢单失败，请重试');
    }
}

function showOrderDetail(orderId, status) {
    const ordersContainer = document.getElementById(status + 'Orders');
    const orderCard = ordersContainer.querySelector(`[data-order-id="${orderId}"]`);
    
    if (!orderCard) return;
    
    const orderData = {
        id: orderId,
        studentName: orderCard.querySelector('.order-student span').textContent,
        address: orderCard.querySelector('.order-address span').textContent,
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
    if (status === 'delivering') {
        actionsHtml = `
            <button class="btn btn-primary" onclick="deliverOrder('${orderId}')">确认送达</button>
            <button class="btn btn-outline" onclick="closeModal()">取消</button>
        `;
    }
    
    document.getElementById('modalActions').innerHTML = actionsHtml;
    
    openModal('orderDetailModal');
}

async function deliverOrder(orderId) {
    try {
        const response = await fetch(`${API_URL}/order/deliver`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId })
        });
        
        const data = await response.json();
        if (data.success) {
            showSuccess('订单已送达！感谢您的配送');
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
    document.getElementById('deliverymanLoginForm').addEventListener('submit', deliverymanLogin);
    
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