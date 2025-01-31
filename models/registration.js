const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    teamEmail: {
        type: String,
        required: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email']
    },
    teamPhone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    teamSize: {
        type: Number,
        required: true,
        min: [1, 'Team size must be at least 1'],
        max: [5, 'Team size cannot exceed 5']
    },
    experience: {
        type: String,
        required: true
    },
    players: [{
        name: {
            type: String,
            required: true
        },

        inGameId: {
            type: String,
            required: true

        },
        discord: {
            type: String,
            required: true
        },
        socialProof: {
            youtube: String,
            instagram: String
            // discord: String
        },
        role: {
            type: String,
            required: true,
            enum: ['IGL', 'Assaulter', 'Support', 'Sniper']
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true 
});

// Add index on createdAt field
registrationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Registration', registrationSchema);