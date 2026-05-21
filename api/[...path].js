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

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { path = [] } = req.query;
    const pathParts = Array.isArray(path) ? path : [path];

    try {
        if (pathParts[0] === 'student' && pathParts[1] === 'login' && req.method === 'POST') {
            const { id, password } = req.body;
            const student = students.find(s => s.id === id && s.password === password);
            return res.json(student ? { success: true, student } : { success: false, message: '学号或密码错误' });
        }

        if (pathParts[0] === 'canteen' && pathParts[1] === 'login' && req.method === 'POST') {
            const { username, password } = req.body;
            const canteen = canteens.find(c => c.username === username && c.password === password);
            return res.json(canteen ? { success: true, canteen } : { success: false, message: '用户名或密码错误' });
        }

        if (pathParts[0] === 'deliveryman' && pathParts[1] === 'login' && req.method === 'POST') {
            const { id, password } = req.body;
            const deliveryman = deliverymen.find(d => d.id === id && d.password === password);
            return res.json(deliveryman ? { success: true, deliveryman } : { success: false, message: '配送员ID或密码错误' });
        }

        if (pathParts[0] === 'menu' && req.method === 'GET') {
            if (pathParts[1]) {
                const item = menu.find(m => m.id === parseInt(pathParts[1]));
                return res.json(item ? { success: true, item } : { success: false, message: '菜品不存在' });
            }
            return res.json({ success: true, menu });
        }

        if (pathParts[0] === 'menu' && req.method === 'POST') {
            const { name, price, description, category, image } = req.body;
            if (!name || !price) return res.json({ success: false, message: '请填写菜品名称和价格' });
            const newId = menu.length > 0 ? Math.max(...menu.map(m => m.id)) + 1 : 1;
            const newItem = { id: newId, name, price: parseFloat(price), description: description || '', category: category || 'hot', image: image || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20food&image_size=square' };
            menu.push(newItem);
            return res.json({ success: true, item: newItem, message: '菜品添加成功' });
        }

        if (pathParts[0] === 'menu' && req.method === 'PUT') {
            const index = menu.findIndex(m => m.id === parseInt(pathParts[1]));
            if (index === -1) return res.json({ success: false, message: '菜品不存在' });
            const { name, price, description, category, image } = req.body;
            menu[index] = { ...menu[index], name: name || menu[index].name, price: price !== undefined ? parseFloat(price) : menu[index].price, description: description !== undefined ? description : menu[index].description, category: category || menu[index].category, image: image || menu[index].image };
            return res.json({ success: true, item: menu[index], message: '菜品更新成功' });
        }

        if (pathParts[0] === 'menu' && req.method === 'DELETE') {
            const index = menu.findIndex(m => m.id === parseInt(pathParts[1]));
            if (index === -1) return res.json({ success: false, message: '菜品不存在' });
            menu.splice(index, 1);
            return res.json({ success: true, message: '菜品删除成功' });
        }

        if (pathParts[0] === 'order' && pathParts[1] === 'create' && req.method === 'POST') {
            const { studentId, studentName, items, totalPrice, address } = req.body;
            const student = students.find(s => s.id === studentId);
            if (!student) return res.json({ success: false, message: '学生不存在' });
            if (student.balance < totalPrice) return res.json({ success: false, message: '余额不足' });
            const order = { id: `DD${Date.now()}`, studentId, studentName, items, totalPrice, status: 'pending', createTime: new Date().toLocaleString('zh-CN'), canteenId: 'c001', address };
            orders.push(order);
            student.balance -= totalPrice;
            return res.json({ success: true, order });
        }

        if (pathParts[0] === 'orders' && pathParts[1] === 'pending' && req.method === 'GET') {
            return res.json({ success: true, orders: orders.filter(o => o.status === 'pending') });
        }

        if (pathParts[0] === 'orders' && pathParts[1] === 'cooking' && req.method === 'GET') {
            return res.json({ success: true, orders: orders.filter(o => o.status === 'cooking') });
        }

        if (pathParts[0] === 'orders' && pathParts[1] === 'ready' && req.method === 'GET') {
            return res.json({ success: true, orders: orders.filter(o => o.status === 'ready') });
        }

        if (pathParts[0] === 'orders' && pathParts[1] === 'delivering' && req.method === 'GET') {
            return res.json({ success: true, orders: orders.filter(o => o.status === 'delivering') });
        }

        if (pathParts[0] === 'orders' && pathParts[1] === 'student' && req.method === 'GET') {
            return res.json({ success: true, orders: orders.filter(o => o.studentId === pathParts[2]) });
        }

        if (pathParts[0] === 'orders' && pathParts[1] === 'deliveryman' && req.method === 'GET') {
            return res.json({ success: true, orders: orders.filter(o => o.deliverymanId === pathParts[2] && o.status === 'delivering') });
        }

        if (pathParts[0] === 'order' && pathParts[1] === 'accept' && req.method === 'POST') {
            const { orderId } = req.body;
            const order = orders.find(o => o.id === orderId);
            if (!order) return res.json({ success: false, message: '订单不存在' });
            if (order.status !== 'pending') return res.json({ success: false, message: '订单状态不允许接单' });
            order.status = 'cooking';
            return res.json({ success: true, order });
        }

        if (pathParts[0] === 'order' && pathParts[1] === 'complete' && req.method === 'POST') {
            const { orderId } = req.body;
            const order = orders.find(o => o.id === orderId);
            if (!order) return res.json({ success: false, message: '订单不存在' });
            if (order.status !== 'cooking') return res.json({ success: false, message: '订单状态不允许完成' });
            order.status = 'ready';
            return res.json({ success: true, order });
        }

        if (pathParts[0] === 'order' && pathParts[1] === 'grab' && req.method === 'POST') {
            const { orderId, deliverymanId, deliverymanName } = req.body;
            const order = orders.find(o => o.id === orderId);
            if (!order) return res.json({ success: false, message: '订单不存在' });
            if (order.status !== 'ready') return res.json({ success: false, message: '订单未准备好，无法抢单' });
            order.status = 'delivering';
            order.deliverymanId = deliverymanId;
            order.deliverymanName = deliverymanName;
            return res.json({ success: true, order });
        }

        if (pathParts[0] === 'order' && pathParts[1] === 'deliver' && req.method === 'POST') {
            const { orderId } = req.body;
            const order = orders.find(o => o.id === orderId);
            if (!order) return res.json({ success: false, message: '订单不存在' });
            if (order.status !== 'delivering') return res.json({ success: false, message: '订单状态不允许送达' });
            order.status = 'completed';
            return res.json({ success: true, order });
        }

        if (pathParts[0] === 'deliverymen' && pathParts[1] === 'online' && req.method === 'GET') {
            return res.json({ success: true, deliverymen: deliverymen.filter(d => d.status === 'online') });
        }

        return res.status(404).json({ success: false, message: 'API 路径不存在' });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ success: false, message: '服务器错误' });
    }
};
