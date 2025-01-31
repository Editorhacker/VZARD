const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
    apiKey: "AIzaSyB2CaMS27dJX7J09wXshnm3jQ3Y5VDURP8",
    authDomain: "bgmi-tournament-1604b.firebaseapp.com",
    projectId: "bgmi-tournament-1604b",
    storageBucket: "bgmi-tournament-1604b.firebasestorage.app",
    messagingSenderId: "295583459013",
    appId: "1:295583459013:web:2981cdac4703c1173272ac",
    measurementId: "G-E0B5ZQ1CWK",
    databaseURL: "https://bgmi-tournament-1604b-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

module.exports = { db, storage };
