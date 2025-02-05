// Import Firebase functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to show error messages
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.dashboard-container').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Function to update statistics
function updateStats(registrations) {
    const totalTeams = registrations.length;
    let totalPlayers = 0;
    registrations.forEach(reg => {
        if (reg.players) {
            totalPlayers += reg.players.length;
        }
    });

    document.getElementById('totalTeams').textContent = totalTeams;
    document.getElementById('totalPlayers').textContent = totalPlayers;
}

// Function to create player card
function createPlayerCard(player, index) {
    return `
        <div class="player-item">
            <h4>Player ${index + 1}: ${player.name}</h4>
            <p>BGMI ID: ${player.inGameId || 'N/A'}</p>
            <p>Discord: ${player.discord || 'N/A'}</p>
            ${player.socialProof ? `
                <div class="social-proof">
                    ${player.socialProof.youtube ? `
                        <img src="${player.socialProof.youtube}" alt="YouTube Proof" onclick="showImage('${player.socialProof.youtube}')">
                    ` : ''}
                    ${player.socialProof.instagram ? `
                        <img src="${player.socialProof.instagram}" alt="Instagram Proof" onclick="showImage('${player.socialProof.instagram}')">
                    ` : ''}
                </div>
            ` : ''}
        </div>
    `;
}

// Function to create registration card
function createRegistrationCard(registration) {
    return `
        <div class="registration-card">
            <div class="registration-header">
                <div class="team-info">
                    <h3>${registration.teamName}</h3>
                    <p>Email: ${registration.teamEmail}</p>
                    <p>Phone: ${registration.teamPhone}</p>
                </div>
                <div class="registration-date">
                    ${new Date(registration.timestamp).toLocaleDateString()}
                </div>
            </div>
            <div class="player-list">
                ${registration.players ? registration.players.map((player, index) => createPlayerCard(player, index)).join('') : ''}
            </div>
        </div>
    `;
}

// Function to load registrations from Firebase
export async function loadRegistrations() {
    const loadingSpinner = document.querySelector('.loading-spinner');
    const registrationsGrid = document.querySelector('.registrations-grid');
    
    try {
        loadingSpinner.style.display = 'block';
        
        // Get registrations from Firebase Realtime Database
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
            
            // Sort registrations by timestamp (newest first)
            registrations.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            
            // Update statistics
            updateStats(registrations);
            
            // Create registration cards
            registrationsGrid.innerHTML = registrations.map(reg => 
                createRegistrationCard(reg)
            ).join('');
        } else {
            registrationsGrid.innerHTML = '<p class="no-data">No registrations found</p>';
            updateStats([]);
        }
    } catch (error) {
        console.error('Error loading registrations:', error);
        showError('Failed to load registrations. Please try again later.');
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

// Function to show image in modal
export function showImage(src) {
    const modal = document.querySelector('.modal');
    const modalImg = document.querySelector('.modal img');
    modalImg.src = src;
    modal.style.display = 'flex';
}

// Function to handle logout
export function logout() {
    window.location.href = '/admin/login';
}
