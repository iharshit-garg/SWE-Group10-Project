let userEmailElement;
let logoutButton;
let patientsContainer;
let searchPatientsInput;
let patientInfoContainer;
let patientSymptomsContainer;
let appointmentsContainer;
let navLinks;
let sections;

// Variables for Messaging
let messagesContainer;
let replyForm;
let replyPatientId;
let replyPatientEmail;
let replyContent;
let replyMessage;

// Variables for AI Analysis
let aiFormDoctor;
let aiSymptomsInputDoctor;
let aiResultDoctor;

let allPatients = [];
let selectedPatientId = null;

document.addEventListener('DOMContentLoaded', () => {
    userEmailElement = document.getElementById('user-email');
    logoutButton = document.getElementById('logout-button');
    patientsContainer = document.getElementById('patients-container');
    searchPatientsInput = document.getElementById('search-patients');
    patientInfoContainer = document.getElementById('patient-info-container');
    patientSymptomsContainer = document.getElementById('patient-symptoms');
    appointmentsContainer = document.getElementById('appointments-container');
    

    // Select Messaging elements
    messagesContainer = document.getElementById('messages-container');
    replyForm = document.getElementById('reply-form');
    replyPatientId = document.getElementById('reply-patient-id');
    replyPatientEmail = document.getElementById('reply-patient-email');
    replyContent = document.getElementById('reply-content');
    replyMessage = document.getElementById('reply-message');

    // Select AI Analysis elements
    aiFormDoctor = document.getElementById('ai-form-doctor');
    aiSymptomsInputDoctor = document.getElementById('symptoms-input-doctor');
    aiResultDoctor = document.getElementById('ai-result-doctor');

    
    navLinks = document.querySelectorAll('.nav-link');
    sections = document.querySelectorAll('.section');
    
    populateUserDetails();
    fetchAllPatients();
    setupNavigation();
    initializeNavigation();
    setupSearchFilter();
    setupLogout();

    // --- ADD EVENT LISTENERS ---
    replyForm?.addEventListener('submit', handleReplySubmit);
    aiFormDoctor?.addEventListener('submit', handleAiAnalysisSubmitDoctor);
});

function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            
            navLinks.forEach(l => {
                l.classList.remove('active');
            });
            
            link.classList.add('active');
            
            showSection(sectionId);

            // Fetch data based on the section clicked
            if (sectionId === 'appointments') {
                fetchDoctorAppointments();
            }
            if (sectionId === 'messages') {
                fetchDoctorMessages();
            }
        });
    });
}

function showSection(sectionId) {
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId)?.classList.add('active');
}

function initializeNavigation() {
    let activeSection = null;
    sections.forEach(section => {
        if (section.classList.contains('active')) {
            activeSection = section.id;
        }
    });
    
    if (activeSection) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === activeSection) {
                link.classList.add('active');
            }
        });
    }
}

function setupSearchFilter() {
    searchPatientsInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.patient-card');
        
        cards.forEach(card => {
            const email = card.dataset.email.toLowerCase();
            if (email.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function setupLogout() {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '../login/index.html';
    });
}

async function populateUserDetails() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../login/index.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            userEmailElement.textContent = userData.email;
            
            if (userData.role !== 'doctor') {
                alert('Access denied. This dashboard is for doctors only.');
                localStorage.removeItem('token');
                window.location.href = '../login/index.html';
            }
        } else {
            localStorage.removeItem('token');
            window.location.href = '../login/index.html';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        window.location.href = '../login/index.html';
    }
}

async function fetchAllPatients() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('http://localhost:3000/api/doctor/patients', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const users = await response.json();
            allPatients = users.filter(user => user.role === 'patient');
            displayPatients(allPatients);
        } else {
            patientsContainer.innerHTML = '<p class="loading error">Failed to load patients</p>';
        }
    } catch (error) {
        console.error('Error fetching patients:', error);
        patientsContainer.innerHTML = '<p class="loading error">Could not load patients. Please try again.</p>';
    }
}

function displayPatients(patients) {
    patientsContainer.innerHTML = '';

    if (patients.length === 0) {
        patientsContainer.innerHTML = '<p class="loading">No patients found</p>';
        return;
    }

    patients.forEach(patient => {
        const card = document.createElement('div');
        card.className = 'patient-card';
        card.dataset.email = patient.email;
        card.dataset.patientId = patient._id;

        const lastVisit = patient.lastAppointment 
            ? new Date(patient.lastAppointment).toLocaleDateString()
            : 'No appointments yet';

        card.innerHTML = `
            <div class="patient-email">${patient.email}</div>
            <div class="patient-status">Patient ID: ${patient._id.substring(0, 8)}...</div>
            <div class="patient-last-visit">Last visit: ${lastVisit}</div>
        `;

        card.addEventListener('click', () => selectPatient(patient));
        patientsContainer.appendChild(card);
    });
}

async function selectPatient(patient) {
    selectedPatientId = patient._id;
    
    // Update patient info
    const patientInfoHTML = `
        <div class="patient-info-header">
            <div class="patient-name">${patient.email}</div>
            <div class="patient-email-display">Patient ID: ${patient._id}</div>
        </div>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Account Status</div>
                <div class="info-value">Active</div>
            </div>
            <div class="info-item">
                <div class="info-label">Role</div>
                <div class="info-value">Patient</div>
            </div>
            <div class="info-item">
                <div class="info-label">Registered</div>
                <div class="info-value">${new Date(patient.createdAt || new Date()).toLocaleDateString()}</div>
            </div>
        </div>
    `;
    
    patientInfoContainer.innerHTML = patientInfoHTML;
    
    await fetchPatientSymptoms(patient._id);
    
    showSection('patient-details');
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-section="patient-details"]').classList.add('active');
}

async function fetchPatientSymptoms(patientId) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`http://localhost:3000/api/doctor/patients/${patientId}/symptoms`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const symptoms = await response.json();
            displayPatientSymptoms(symptoms);
        } else {
            patientSymptomsContainer.innerHTML = '<p class="loading">Failed to load symptoms</p>';
        }
    } catch (error) {
        console.error('Error fetching patient symptoms:', error);
        patientSymptomsContainer.innerHTML = '<p class="loading error">Could not load symptoms</p>';
    }
}

function displayPatientSymptoms(symptoms) {
    patientSymptomsContainer.innerHTML = '';

    if (!symptoms || symptoms.length === 0) {
        patientSymptomsContainer.innerHTML = '<p class="loading">No symptom history available</p>';
        return;
    }

    symptoms.forEach(log => {
        const entry = document.createElement('div');
        entry.className = 'symptom-entry';

        const date = new Date(log.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        entry.innerHTML = `
            <div class="symptom-date">${date}</div>
            <div class="symptom-items">
                ${(log.symptoms || []).map(symptom => `<span class="symptom-tag">${symptom.trim()}</span>`).join('')}
            </div>
        `;

        patientSymptomsContainer.appendChild(entry);
    });
}


// Function to fetch doctor appointments
async function fetchDoctorAppointments() {
    const token = localStorage.getItem('token');
    appointmentsContainer.innerHTML = '<p class="loading">Loading appointments...</p>';

    try {
        const response = await fetch('http://localhost:3000/api/doctor/appointments', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const appointments = await response.json();
            appointmentsContainer.innerHTML = ''; // Clear 'loading' message

            if (appointments.length === 0) {
                appointmentsContainer.innerHTML = '<p class="loading">No appointments scheduled.</p>';
                return;
            }

            appointments.forEach(appt => {
                const item = document.createElement('div');
                item.className = 'appointment-item';
                
                const date = new Date(appt.date).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                });

                item.innerHTML = `
                    <div class="appointment-patient"><strong>Patient:</strong> ${appt.patient.email}</div>
                    <div class="appointment-date"><strong>Date:</strong> ${date}</div>
                    <div class="appointment-reason"><strong>Reason:</strong> ${appt.reason}</div>
                    <div class="appointment-status"><strong>Status:</strong> ${appt.status}</div>
                `;
                appointmentsContainer.appendChild(item);
            });
        } else {
            appointmentsContainer.innerHTML = '<p class="loading error">Could not load appointments.</p>';
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
        appointmentsContainer.innerHTML = '<p class="loading error">Could not load appointments.</p>';
    }
}

// Function to fetch doctor messages
async function fetchDoctorMessages() {
    const token = localStorage.getItem('token');
    messagesContainer.innerHTML = '<p class="loading">Loading messages...</p>';

    try {
        const response = await fetch('http://localhost:3000/api/doctor/messages', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }

        const messages = await response.json();
        messagesContainer.innerHTML = ''; // Clear 'loading'

        if (messages.length === 0) {
            messagesContainer.innerHTML = '<p class="loading">No messages found.</p>';
            return;
        }

        messages.forEach(msg => {
            const item = document.createElement('div');
            const isDoctor = msg.from.role === 'doctor';
            item.className = isDoctor ? 'message-item sent' : 'message-item received';
            
            const date = new Date(msg.createdAt).toLocaleString('en-US', {
                dateStyle: 'short',
                timeStyle: 'short'
            });

            item.innerHTML = `
                <div class="message-sender">${isDoctor ? 'You' : msg.from.email}</div>
                <div class="message-content">${msg.content}</div>
                <div class="message-date">${date}</div>
            `;

            if (!isDoctor) {
                const replyButton = document.createElement('button');
                replyButton.textContent = 'Reply';
                replyButton.className = 'btn btn-secondary btn-small';
                replyButton.onclick = () => {
                    replyPatientId.value = msg.from._id;
                    replyPatientEmail.textContent = msg.from.email;
                    replyContent.focus();
                };
                item.appendChild(replyButton);
            }

            messagesContainer.appendChild(item);
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        messagesContainer.innerHTML = '<p class="loading error">Could not load messages.</p>';
    }
}

// Function to handle message reply
async function handleReplySubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const patientId = replyPatientId.value;
    const content = replyContent.value;

    if (!patientId) {
        showMessage(replyMessage, 'Please select a patient message to reply to.', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/doctor/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ patientId, content })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(replyMessage, 'Reply sent successfully!', 'success');
            replyForm.reset();
            replyPatientId.value = '';
            replyPatientEmail.textContent = '(Select a message to reply)';
            fetchDoctorMessages(); // Refresh the message list
        } else {
            showMessage(replyMessage, data.message || 'Failed to send reply', 'error');
        }
    } catch (error) {
        console.error('Error sending reply:', error);
        showMessage(replyMessage, 'An error occurred. Please try again.', 'error');
    }
}

// Function to handle AI analysis submit
async function handleAiAnalysisSubmitDoctor(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const symptoms = aiSymptomsInputDoctor.value;
    
    aiResultDoctor.textContent = 'Analyzing...';
    aiResultDoctor.className = 'message';

    try {
        const response = await fetch('http://localhost:3000/api/ai/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ symptoms })
        });

        const data = await response.json();

        if (response.ok) {
            aiResultDoctor.innerHTML = data.analysis.replace(/\n/g, '<br>');
            aiResultDoctor.className = 'message success';
        } else {
            aiResultDoctor.textContent = data.message || 'Analysis failed.';
            aiResultDoctor.className = 'message error';
        }
    } catch (error) {
        console.error('Error:', error);
        aiResultDoctor.textContent = 'An error occurred. Please try again.';
        aiResultDoctor.className = 'message error';
    }
}

// Helper function to show messages
function showMessage(element, text, type) {
    if (element) {
        element.textContent = text;
        element.className = 'message ' + type;
        
        setTimeout(() => {
            element.textContent = '';
            element.className = 'message';
        }, 5000);
    } else {
        console.error('showMessage: element is null');
    }
}