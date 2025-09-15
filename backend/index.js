
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = 'your_super_secret_key_that_should_be_in_env_vars'; // In a real app, use environment variables

app.use(cors());
app.use(bodyParser.json());

// In-memory database for simplicity
let users = [
    // Default admin user for testing
    {
        id: 1,
        username: 'admin',
        // Password is "adminpassword"
        passwordHash: '$2a$10$k.0T8s2/C.E.a.1a2b3c4d5e6f7g8h9i0j/k.l.m.n.o.p.q.r.s.t.u',
        role: 'ADMIN'
    }
];
let nextUserId = 2;

// In-memory product data
const products = [
    {
        id: 1,
        name: 'Smartphone Pro X',
        description: 'The latest and greatest smartphone with a stunning display and amazing camera.',
        price: 999.99,
        condition: 'NEW',
        category: 'Smartphone',
        brand: 'Apple',
        imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Smartphone'
    },
    {
        id: 2,
        name: 'Laptop UltraBook 14',
        description: 'A lightweight and powerful laptop for professionals on the go.',
        price: 1299.99,
        condition: 'NEW',
        category: 'Laptop',
        brand: 'Dell',
        imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Laptop'
    },
    {
        id: 3,
        name: 'Wireless Headphones',
        description: 'Noise-cancelling headphones with superior sound quality.',
        price: 199.99,
        condition: 'NEW',
        category: 'Audio',
        brand: 'Sony',
        imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Headphones'
    },
    {
        id: 4,
        name: 'Gaming Console NextGen',
        description: 'Experience the future of gaming with this powerful console.',
        price: 499.99,
        condition: 'NEW',
        category: 'Gaming',
        brand: 'MSI',
        imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Console'
    },
    {
        id: 5,
        name: 'Smartphone Classic (Used)',
        description: 'A reliable and affordable smartphone. Great condition.',
        price: 249.99,
        condition: 'SECONDHAND',
        category: 'Smartphone',
        brand: 'Samsung',
        imageUrl: 'https://placehold.co/600x400/718096/ffffff?text=Used+Phone'
    },
    {
        id: 6,
        name: 'Work Laptop 15-inch (Used)',
        description: 'A sturdy workhorse laptop with plenty of power for daily tasks.',
        price: 450.00,
        condition: 'SECONDHAND',
        category: 'Laptop',
        brand: 'HP',
        imageUrl: 'https://placehold.co/600x400/718096/ffffff?text=Used+Laptop'
    },
    {
        id: 7,
        name: 'Mirrorless Camera Z',
        description: 'Professional-grade mirrorless camera with 4K video and a full-frame sensor.',
        price: 1999.99,
        condition: 'NEW',
        category: 'Photography',
        brand: 'Nikon',
        imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Camera'
    },
    {
        id: 8,
        name: '50mm F1.8 Prime Lens',
        description: 'A sharp and fast prime lens, perfect for portraits and low-light photography.',
        price: 250.00,
        condition: 'NEW',
        category: 'Photography',
        brand: 'Canon',
        imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Lens'
    },
    {
        id: 9,
        name: 'Action Camera Hero',
        description: 'A rugged, waterproof action camera for capturing all your adventures.',
        price: 399.00,
        condition: 'NEW',
        category: 'Photography',
        brand: 'GoPro',
        imageUrl: 'https://placehold.co/600x400/2d3748/ffffff?text=Action+Cam'
    },
    {
        id: 10,
        name: 'DSLR Camera (Used)',
        description: 'A versatile DSLR camera, great for beginners and enthusiasts. Comes with a kit lens.',
        price: 550.00,
        condition: 'SECONDHAND',
        category: 'Photography',
        brand: 'Canon',
        imageUrl: 'https://placehold.co/600x400/718096/ffffff?text=Used+DSLR'
    }
];

// --- AUTH ROUTES ---

// Register a new user
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
        id: nextUserId++,
        username,
        passwordHash,
        role: 'USER' // Default role
    };

    users.push(newUser);
    console.log('Registered new user:', newUser.username);
    res.status(201).json({ message: 'User registered successfully' });
});

// Login a user
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
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
app.get('/api/admin/users', authenticateToken, isAdmin, (req, res) => {
    // Return users without their password hashes
    const safeUsers = users.map(({ passwordHash, ...user }) => user);
    res.json(safeUsers);
});

// --- PRODUCT ROUTES ---

// Get all products (Authenticated users only)
app.get('/api/products', authenticateToken, (req, res) => {
    res.json(products);
});

// Get a single product by ID (Authenticated users only)
app.get('/api/products/:id', authenticateToken, (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = products.find(p => p.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // A hashed password for "adminpassword" to pre-seed the admin user.
    // This is just for demonstration. In a real app, this would be handled by a setup script.
    bcrypt.hash('adminpassword', 10).then(hash => {
        users[0].passwordHash = hash;
        console.log('Default admin user is ready.');
    });
});
