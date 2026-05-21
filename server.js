const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

let students = [
    { id: '2024001', name: '张三', password: '123456', balance: 100 },
    { id: '2024002', name: '李四', password: '654321', balance: 200 }
];

let canteens = [
    { id: 'c001', name: '第一食堂', username: 'canteen1', password: 'canteen123' }
];

let deliverymen = [
    { id: 'd001', name: '张师傅', phone: '13800138001', password: 'delivery123', status: 'online' },
    { id: 'd002', name: '李师傅', phone: '13900139002', password: 'delivery456', status: 'online' }
];

let menu = [
    { id: 1, name: '脆皮炸鸡饭', price: 15, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20Chinese%20fried%20chicken%20with%20rice%20on%20plate&image_size=square', description: '外酥里嫩，香气四溢', category: 'hot' },
    { id: 2, name: '红烧牛肉面', price: 18, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20beef%20noodles%20in%20soup%20bowl&image_size=square', description: '肉质鲜嫩，汤汁浓郁', category: 'new' },
    { id: 3, name: '蛋炒饭', price: 8, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20vegetable%20fried%20rice%20in%20wok&image_size=square', description: '粒粒分明，蛋香十足', category: 'discount' },
    { id: 4, name: '番茄炒蛋', price: 12, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20tomato%20egg%20vegetable%20soup&image_size=square', description: '酸甜可口，营养均衡', category: 'hot' },
    { id: 5, name: '红烧肉', price: 22, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20braised%20pork%20belly%20on%20plate&image_size=square', description: '肥而不腻，入口即化', category: 'new' },
    { id: 6, name: '鸡蛋炒面', price: 10, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20fried%20noodles%20with%20vegetables&image_size=square', description: '劲道爽滑，香气扑鼻', category: 'hot' },
    { id: 7, name: '酸辣土豆丝', price: 10, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20sour%20spicy%20shredded%20potato%20dish&image_size=square', description: '酸辣开胃，爽脆可口', category: 'hot' },
    { id: 8, name: '宫保鸡丁', price: 16, image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20kung%20pao%20chicken%20with%20peanuts&image_size=square', description: '麻辣鲜香，下饭首选', category: 'new' }
];

let orders = [
    { 
        id: 'DD20240101001', 
        studentId: '2024001', 
        studentName: '张三',
        items: [{ menuId: 1, name: '脆皮炸鸡饭', quantity: 1, price: 15 }],
        totalPrice: 15,
        status: 'completed',
        createTime: '2024-01-01 11:00:00',
        canteenId: 'c001',
        deliverymanId: 'd001',
        deliverymanName: '张师傅',
        address: '男生宿舍3号楼'
    }
];

app.post('/api/student/login', (req, res) => {
    const { id, password } = req.body;
    const student = students.find(s => s.id === id && s.password === password);
    if (student) {
        res.json({ success: true, student });
    } else {
        res.json({ success: false, message: '学号或密码错误' });
    }
});

app.post('/api/canteen/login', (req, res) => {
    const { username, password } = req.body;
    const canteen = canteens.find(c => c.username === username && c.password === password);
    if (canteen) {
        res.json({ success: true, canteen });
    } else {
        res.json({ success: false, message: '用户名或密码错误' });
    }
});

app.post('/api/deliveryman/login', (req, res) => {
    const { id, password } = req.body;
    const deliveryman = deliverymen.find(d => d.id === id && d.password === password);
    if (deliveryman) {
        res.json({ success: true, deliveryman });
    } else {
        res.json({ success: false, message: '配送员ID或密码错误' });
    }
});

app.get('/api/menu', (req, res) => {
    res.json({ success: true, menu });
});

app.get('/api/menu/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = menu.find(m => m.id === id);
    if (item) {
        res.json({ success: true, item });
    } else {
        res.json({ success: false, message: '菜品不存在' });
    }
});

app.post('/api/menu', (req, res) => {
    const { name, price, description, category, image } = req.body;
    if (!name || !price) {
        return res.json({ success: false, message: '请填写菜品名称和价格' });
    }
    const newId = menu.length > 0 ? Math.max(...menu.map(m => m.id)) + 1 : 1;
    const newItem = {
        id: newId,
        name,
        price: parseFloat(price),
        description: description || '',
        category: category || 'hot',
        image: image || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20food&image_size=square'
    };
    menu.push(newItem);
    res.json({ success: true, item: newItem, message: '菜品添加成功' });
});

app.put('/api/menu/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price, description, category, image } = req.body;
    const index = menu.findIndex(m => m.id === id);
    if (index === -1) {
        return res.json({ success: false, message: '菜品不存在' });
    }
    menu[index] = {
        ...menu[index],
        name: name || menu[index].name,
        price: price !== undefined ? parseFloat(price) : menu[index].price,
        description: description !== undefined ? description : menu[index].description,
        category: category || menu[index].category,
        image: image || menu[index].image
    };
    res.json({ success: true, item: menu[index], message: '菜品更新成功' });
});

app.delete('/api/menu/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = menu.findIndex(m => m.id === id);
    if (index === -1) {
        return res.json({ success: false, message: '菜品不存在' });
    }
    menu.splice(index, 1);
    res.json({ success: true, message: '菜品删除成功' });
});

app.post('/api/order/create', (req, res) => {
    const { studentId, studentName, items, totalPrice, address } = req.body;
    const student = students.find(s => s.id === studentId);
    if (!student) {
        return res.json({ success: false, message: '学生不存在' });
    }
    if (student.balance < totalPrice) {
        return res.json({ success: false, message: '余额不足' });
    }
    const order = {
        id: `DD${Date.now()}`,
        studentId,
        studentName,
        items,
        totalPrice,
        status: 'pending',
        createTime: new Date().toLocaleString('zh-CN'),
        canteenId: 'c001',
        address
    };
    orders.push(order);
    student.balance -= totalPrice;
    res.json({ success: true, order });
});

app.get('/api/orders/pending', (req, res) => {
    const pendingOrders = orders.filter(o => o.status === 'pending');
    res.json({ success: true, orders: pendingOrders });
});

app.get('/api/orders/cooking', (req, res) => {
    const cookingOrders = orders.filter(o => o.status === 'cooking');
    res.json({ success: true, orders: cookingOrders });
});

app.get('/api/orders/ready', (req, res) => {
    const readyOrders = orders.filter(o => o.status === 'ready');
    res.json({ success: true, orders: readyOrders });
});

app.get('/api/orders/delivering', (req, res) => {
    const deliveringOrders = orders.filter(o => o.status === 'delivering');
    res.json({ success: true, orders: deliveringOrders });
});

app.get('/api/orders/student/:studentId', (req, res) => {
    const studentOrders = orders.filter(o => o.studentId === req.params.studentId);
    res.json({ success: true, orders: studentOrders });
});

app.get('/api/orders/deliveryman/:deliverymanId', (req, res) => {
    const deliverymanOrders = orders.filter(o => o.deliverymanId === req.params.deliverymanId && o.status === 'delivering');
    res.json({ success: true, orders: deliverymanOrders });
});

app.post('/api/order/accept', (req, res) => {
    const { orderId } = req.body;
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.json({ success: false, message: '订单不存在' });
    }
    if (order.status !== 'pending') {
        return res.json({ success: false, message: '订单状态不允许接单' });
    }
    order.status = 'cooking';
    res.json({ success: true, order });
});

app.post('/api/order/complete', (req, res) => {
    const { orderId } = req.body;
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.json({ success: false, message: '订单不存在' });
    }
    if (order.status !== 'cooking') {
        return res.json({ success: false, message: '订单状态不允许完成' });
    }
    order.status = 'ready';
    res.json({ success: true, order });
});

app.post('/api/order/grab', (req, res) => {
    const { orderId, deliverymanId, deliverymanName } = req.body;
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.json({ success: false, message: '订单不存在' });
    }
    if (order.status !== 'ready') {
        return res.json({ success: false, message: '订单未准备好，无法抢单' });
    }
    order.status = 'delivering';
    order.deliverymanId = deliverymanId;
    order.deliverymanName = deliverymanName;
    res.json({ success: true, order });
});

app.post('/api/order/deliver', (req, res) => {
    const { orderId } = req.body;
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.json({ success: false, message: '订单不存在' });
    }
    if (order.status !== 'delivering') {
        return res.json({ success: false, message: '订单状态不允许送达' });
    }
    order.status = 'completed';
    res.json({ success: true, order });
});

app.get('/api/deliverymen/online', (req, res) => {
    const onlineDeliverymen = deliverymen.filter(d => d.status === 'online');
    res.json({ success: true, deliverymen: onlineDeliverymen });
});

app.use(express.static(path.join(__dirname, '.')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
