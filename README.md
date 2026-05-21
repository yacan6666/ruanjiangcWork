# 校园外卖专送系统

一个完整的校园外卖配送管理系统，包含学生端、食堂管理端和配送员端。

## 功能特性

### 学生端
- 菜品浏览和菜单展示
- 购物车功能
- 在线下单
- 订单状态跟踪

### 食堂管理端
- 订单管理（待接单、制作中、已完成）
- 菜品管理（添加、编辑、删除）
- 订单确认和制作完成

### 配送员端
- 抢单功能
- 配送管理
- 订单完成确认

## 快速开始

### 本地运行

1. 安装依赖：
```bash
npm install
```

2. 启动后端服务：
```bash
npm start
```

3. 访问前端页面：
- 学生端：`http://localhost:3000/index.html`
- 食堂端：`http://localhost:3000/canteen.html`
- 配送员端：`http://localhost:3000/deliveryman.html`

## 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 学生 | 2024001 | 123456 |
| 食堂 | canteen1 | canteen123 |
| 配送员 | d001 | delivery123 |

## 部署指南

详细的部署说明请查看 [DEPLOYMENT.md](DEPLOYMENT.md)

### 快速部署到 Netlify

1. 将代码推送到 GitHub
2. 在 Netlify 上连接仓库并部署
3. 同时部署后端到 Vercel/Render/Railway
4. 更新前端的 API 地址

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript
- **后端**：Node.js + Express
- **样式**：Font Awesome

## 文件结构

```
campus-delivery-system/
├── index.html              # 学生端首页
├── canteen.html            # 食堂管理页面
├── deliveryman.html        # 配送员页面
├── server.js               # 后端服务
├── netlify.toml            # Netlify 配置
├── package.json            # 项目配置
├── DEPLOYMENT.md           # 部署指南
├── README.md               # 本文件
├── css/
│   └── style.css           # 样式文件
└── js/
    ├── student.js          # 学生端脚本
    ├── canteen.js          # 食堂端脚本
    └── deliveryman.js      # 配送员脚本
```

## API 接口

### 学生相关
- `POST /api/student/login` - 学生登录
- `POST /api/order/create` - 创建订单

### 食堂相关
- `POST /api/canteen/login` - 食堂登录
- `GET /api/orders/pending` - 待接单订单
- `GET /api/orders/cooking` - 制作中订单
- `GET /api/orders/ready` - 已完成订单
- `POST /api/order/accept` - 接单
- `POST /api/order/complete` - 完成制作

### 配送员相关
- `POST /api/deliveryman/login` - 配送员登录
- `GET /api/orders/ready` - 待抢单
- `GET /api/orders/deliveryman/:id` - 我的配送单
- `POST /api/order/grab` - 抢单
- `POST /api/order/deliver` - 确认送达

### 菜品管理
- `GET /api/menu` - 获取菜单
- `GET /api/menu/:id` - 获取菜品详情
- `POST /api/menu` - 添加菜品
- `PUT /api/menu/:id` - 更新菜品
- `DELETE /api/menu/:id` - 删除菜品

## 许可证

MIT License
