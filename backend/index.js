
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { sequelize, User, Product, Order, OrderProduct, syncDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = 'your_super_secret_key_that_should_be_in_env_vars'; // In a real app, use environment variables

app.use(cors());
app.use(bodyParser.json());

// --- AUTH ROUTES ---

// Register a new user
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        passwordHash,
    });

    console.log('Registered new user:', newUser.username);
    res.status(201).json({ message: 'User registered successfully' });
});

// Login a user
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});


// --- MIDDLEWARE FOR AUTH ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}


// --- ADMIN ROUTES ---

// Get all users (Admin only)
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
    const users = await User.findAll({ attributes: { exclude: ['passwordHash'] } });
    res.json(users);
});

// Get a single user by ID (Admin only)
app.get('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = await User.findByPk(userId, { attributes: { exclude: ['passwordHash'] } });

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Update a user (Admin only)
app.put('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { username, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        await user.update({ username, role });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a user (Admin only)
app.delete('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = await User.findByPk(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.status(204).send();
});

// Create a new product (Admin only)
app.post('/api/admin/products', authenticateToken, isAdmin, async (req, res) => {
    const { name, description, price, condition, category, brand, imageUrl } = req.body;
    try {
        const newProduct = await Product.create({ name, description, price, condition, category, brand, imageUrl });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an existing product (Admin only)
app.put('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const { name, description, price, condition, category, brand, imageUrl } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    try {
        await product.update({ name, description, price, condition, category, brand, imageUrl });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a product (Admin only)
app.delete('/api/admin/products/:id', authenticateToken, isAdmin, async (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = await Product.findByPk(productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.status(204).send();
});

// --- PRODUCT ROUTES ---

// Get all products (Authenticated users only)
app.get('/api/products', authenticateToken, async (req, res) => {
    const { search, category, brand, condition } = req.query;
    const where = {};

    if (search) {
        where[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }
    if (category) {
        where.category = category;
    }
    if (brand) {
        where.brand = brand;
    }
    if (condition) {
        where.condition = condition;
    }

    const products = await Product.findAll({ where });
    res.json(products);
});

// Get a single product by ID (Authenticated users only)
app.get('/api/products/:id', authenticateToken, async (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = await Product.findByPk(productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// --- ORDER ROUTES ---

// Place a new order
app.post('/api/orders', authenticateToken, async (req, res) => {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) {
            return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }
        totalAmount += product.price * item.quantity;
        orderProducts.push({
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
        });
    }

    try {
        const order = await Order.create({ totalAmount, UserId: userId });
        for (const op of orderProducts) {
            const product = await Product.findByPk(op.productId);
            await order.addProduct(product, { through: { quantity: op.quantity, price: op.price } });
        }
        res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
});

// Get all orders for the authenticated user
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { UserId: req.user.id },
            include: [
                { model: Product, through: { attributes: ['quantity', 'price'] } }
            ]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user orders', error: error.message });
    }
});

// Get all orders (Admin only)
app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Product, through: { attributes: ['quantity', 'price'] } }
            ]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

const startServer = async () => {
  await syncDatabase();

  // Seed the database with initial data if it's empty
  const userCount = await User.count();
  if (userCount === 0) {
    const passwordHash = await bcrypt.hash('adminpassword', 10);
    await User.create({ username: 'admin', passwordHash, role: 'ADMIN' });
    console.log('Default admin user created.');
  }

  const productCount = await Product.count();
  if (productCount === 0) {
    await Product.bulkCreate([
        {
            name: 'Smartphone Pro X',
            description: 'The latest and greatest smartphone with a stunning display and amazing camera.',
            price: 999.99,
            condition: 'NEW',
            category: 'Smartphone',
            brand: 'Apple',
            imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Smartphone'
        },
        {
            name: 'Laptop UltraBook 14',
            description: 'A lightweight and powerful laptop for professionals on the go.',
            price: 1299.99,
            condition: 'NEW',
            category: 'Laptop',
            brand: 'Dell',
            imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Laptop'
        },
        {
            name: 'Wireless Headphones',
            description: 'Noise-cancelling headphones with superior sound quality.',
            price: 199.99,
            condition: 'NEW',
            category: 'Audio',
            brand: 'Sony',
            imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Headphones'
        },
        {
            name: 'Gaming Console NextGen',
            description: 'Experience the future of gaming with this powerful console.',
            price: 499.99,
            condition: 'NEW',
            category: 'Gaming',
            brand: 'MSI',
            imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Console'
        },
        {
            name: 'Smartphone Classic (Used)',
            description: 'A reliable and affordable smartphone. Great condition.',
            price: 249.99,
            condition: 'SECONDHAND',
            category: 'Smartphone',
            brand: 'Samsung',
            imageUrl: 'https://placehold.co/600x400/718096/ffffff?text=Used+Phone'
        },
        {
            name: 'Work Laptop 15-inch (Used)',
            description: 'A sturdy workhorse laptop with plenty of power for daily tasks.',
            price: 450.00,
            condition: 'SECONDHAND',
            category: 'Laptop',
            brand: 'HP',
            imageUrl: 'https://placehold.co/600x400/718096/ffffff?text=Used+Laptop'
        },
        {
            name: 'Mirrorless Camera Z',
            description: 'Professional-grade mirrorless camera with 4K video and a full-frame sensor.',
            price: 1999.99,
            condition: 'NEW',
            category: 'Photography',
            brand: 'Nikon',
            imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Camera'
        },
        {
            name: '50mm F1.8 Prime Lens',
            description: 'A sharp and fast prime lens, perfect for portraits and low-light photography.',
            price: 250.00,
            condition: 'NEW',
            category: 'Photography',
            brand: 'Canon',
            imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Lens'
        },
        {
            name: 'Action Camera Hero',
            description: 'A rugged, waterproof action camera for capturing all your adventures.',
            price: 399.00,
            condition: 'NEW',
            category: 'Photography',
            brand: 'GoPro',
            imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Action+Cam'
        },
        {
            name: 'DSLR Camera (Used)',
            description: 'A versatile DSLR camera, great for beginners and enthusiasts. Comes with a kit lens.',
            price: 550.00,
            condition: 'SECONDHAND',
            category: 'Photography',
            brand: 'Canon',
            imageUrl: 'https://placehold.co/600x400/718096/ffffff?text=Used+DSLR'
        }
    ]);
    console.log('Default products created.');
  }

  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
