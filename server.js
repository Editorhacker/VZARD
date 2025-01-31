const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db } = require('./config/firebase');
const cloudinary = require('./config/cloudinary');
const { ref, set, push, get, child } = require('firebase/database');
const app = express();

// Enable CORS
app.use(cors());

// Middleware for parsing form data
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Session middleware for admin authentication
const session = require('express-session');
app.use(session({
    secret: 'bgmi-tournament-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Admin authentication middleware
function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

// Serve static files
app.use(express.static(path.join(__dirname)));

// Admin routes
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/login.html'));
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple authentication
    if (username === 'VZARD' && password === 'vz@rd') {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

app.get('/admin/dashboard', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/dashboard.html'));
});

app.get('/admin/registrations', requireAdmin, async (req, res) => {
    try {
        const registrationsRef = ref(db, 'registrations');
        const snapshot = await get(registrationsRef);
        
        if (snapshot.exists()) {
            const registrations = [];
            snapshot.forEach((childSnapshot) => {
                registrations.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            res.json(registrations);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registrations',
            error: error.message
        });
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for the registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const registrationData = req.body;

        // If there's an image, upload to Cloudinary
        if (registrationData.playerImage) {
            const result = await cloudinary.uploader.upload(registrationData.playerImage, {
                folder: 'player-images'
            });
            registrationData.playerImage = result.secure_url;
        }

        // Save data to Firebase Realtime Database
        const registrationsRef = ref(db, 'registrations');
        const newRegistrationRef = push(registrationsRef);
        await set(newRegistrationRef, {
            ...registrationData,
            timestamp: Date.now()
        });
        
        res.status(200).json({
            success: true,
            message: 'Registration successful',
            id: newRegistrationRef.key
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Get registrations endpoint
app.get('/api/registrations', async (req, res) => {
    try {
        const registrationsRef = ref(db, 'registrations');
        const snapshot = await get(registrationsRef);
        
        if (snapshot.exists()) {
            const registrations = [];
            snapshot.forEach((childSnapshot) => {
                registrations.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            res.json(registrations);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registrations',
            error: error.message
        });
    }
});

// Fast2SMS Configuration
const fast2sms = require('fast-two-sms');
const FAST2SMS_API_KEY = 'bYwIv6Pulnp8kiTsLQO1qtrxAVCR7ySGcNaJ53jKXHFmZ9e2oUri7v4B6TKfAsuFVdptPDJzc28NObm0'; // Replace with your Fast2SMS API key
const verificationCodes = new Map();

// Generate OTP endpoint
app.post('/api/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;
        console.log('Received phone number:', phone);
        
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        console.log('Generated OTP:', otp);
        
        console.log('Attempting to send SMS with Fast2SMS...');
        const options = {
            authorization: FAST2SMS_API_KEY,
            message: `Your VZard Game registration OTP is: ${otp}`,
            numbers: [phone]
        };
        
        const response = await fast2sms.sendMessage(options);
        console.log('Fast2SMS response:', response);

        if (response.return === true) {
            verificationCodes.set(phone, {
                code: otp.toString(),
                timestamp: Date.now()
            });
            res.json({ success: true, message: 'OTP sent successfully' });
        } else {
            throw new Error('Failed to send SMS');
        }
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send OTP',
            error: error.message
        });
    }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    console.log('Verifying OTP:', { phone, otp });
    const storedData = verificationCodes.get(phone);
    console.log('Stored OTP data:', storedData);

    if (!storedData) {
        return res.json({ success: false, message: 'No OTP found for this number' });
    }

    // Check if OTP is expired (5 minutes validity)
    if (Date.now() - storedData.timestamp > 5 * 60 * 1000) {
        verificationCodes.delete(phone);
        return res.json({ success: false, message: 'OTP has expired' });
    }

    if (storedData.code === otp) {
        verificationCodes.delete(phone);
        return res.json({ 
            success: true, 
            message: 'Phone number verified successfully',
            verified: true
        });
    }

    res.json({ 
        success: false, 
        message: 'Invalid OTP. Please try again.',
        verified: false
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong! Please try again later.'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
