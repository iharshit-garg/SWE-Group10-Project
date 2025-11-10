let aiResultPatient;
let doctorSelect;
let messageDoctorSelect;
let appointmentForm;
let messageForm;
let symptomForm;
let symptomHistoryElement;
let userEmailElement;
let logoutButton;
let navLinks;
let sections;
let analyzeHistoryBtn;
let analysisHistoryResult;
let doctorListContainer;
let chatbotHistory;
let chatbotForm;
let chatbotInput;
let patientChatHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    doctorSelect = document.getElementById('doctor-select');
    messageDoctorSelect = document.getElementById('message-doctor-select');
    appointmentForm = document.getElementById('appointment-form');
    messageForm = document.getElementById('message-form');
    symptomForm = document.getElementById('symptom-form');
    symptomHistoryElement = document.getElementById('symptom-history-container');
    userEmailElement = document.getElementById('user-email');
    logoutButton = document.getElementById('logout-button');
    navLinks = document.querySelectorAll('.nav-link');
    sections = document.querySelectorAll('.section');
    analyzeHistoryBtn = document.getElementById('analyze-history-btn');
    analysisHistoryResult = document.getElementById('analysis-history-result');
    doctorListContainer = document.getElementById('doctor-list-container');
    aiResultPatient = document.getElementById('ai-result-patient');
    chatbotHistory = document.getElementById('chatbot-history');
    chatbotForm = document.getElementById('chatbot-form');
    chatbotInput = document.getElementById('chatbot-input');

    populateUserDetails();
    fetchSymptomHistory();
    populateDoctors();
    setupNavigation();
    initializeNavigation();
    setupFormHandlers();
    setupAnalysisHandler();
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
        });
    });
    aiFormPatient?.addEventListener('submit', handleAiAnalysisSubmit);
    chatbotForm?.addEventListener('submit', handleChatbotSubmit);
}

function showSection(sectionId) {
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId)?.classList.add('active');
    
    if (sectionId === 'symptom-history') {
        fetchSymptomHistory();
    }
    if (sectionId === 'messages') {
        fetchPatientMessages();
    }
    if (sectionId === 'find-doctor') {
        fetchAndDisplayDoctors();
    }
    if (sectionId === 'chatbot') {
        patientChatHistory = [];
        chatbotHistory.innerHTML = '<div class="chatbot-message bot">Hello! I am HealthMe Bot. How can I help you today? Remember, I am not a real doctor.</div>';
    }
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

function setupFormHandlers() {
    symptomForm?.addEventListener('submit', handleSymptomSubmit);
    appointmentForm?.addEventListener('submit', handleAppointmentSubmit);
    messageForm?.addEventListener('submit', handleMessageSubmit);
    logoutButton?.addEventListener('click', handleLogout);
}

function setupAnalysisHandler() {
    if (!analyzeHistoryBtn) return;

    analyzeHistoryBtn.addEventListener('click', async () => {
        analysisHistoryResult.textContent = 'Analyzing your symptom history...';
        analysisHistoryResult.className = 'message info';
        analysisHistoryResult.style.display = 'block';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/patient/symptoms', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch symptom history.');

            const history = await response.json();
            if (history.length === 0) {
                analysisHistoryResult.textContent = 'No symptoms in your history to analyze.';
                analysisHistoryResult.className = 'message';
                return;
            }

            const allSymptoms = history.map(log => log.symptoms.join(', ')).join(', ');
            
            const res = await fetch('/api/patient/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ symptoms: allSymptoms })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Analysis failed.');
            analysisHistoryResult.textContent = data.analysis;
            analysisHistoryResult.className = 'message success';
        } catch (error) { analysisHistoryResult.textContent = `Error: ${error.message}`; analysisHistoryResult.className = 'message error'; }
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
        } else {
            const errorData = await response.json();
            console.error('Auth failed:', response.status, errorData);
            localStorage.removeItem('token');
            window.location.href = '../login/index.html';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        window.location.href = '../login/index.html';
    }
}

async function fetchSymptomHistory() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3000/api/patient/symptoms', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const history = await response.json();
            symptomHistoryElement.innerHTML = '';

            if (history.length === 0) {
                symptomHistoryElement.innerHTML = '<p class="loading">No symptoms have been logged yet.</p>';
                return;
            }

            history.forEach(log => {
                const item = document.createElement('div');
                item.className = 'history-item';
                const date = new Date(log.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                const time = new Date(log.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                item.innerHTML = `
                    <div class="history-date">${date} at ${time}</div>
                    <div class="history-symptoms">
                        ${log.symptoms.map(symptom => `<span class="symptom-tag">${symptom.trim()}</span>`).join('')}
                    </div>
                `;
                symptomHistoryElement.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error fetching symptom history:', error);
        symptomHistoryElement.innerHTML = '<p class="loading error">Could not load history.</p>';
    }
}

async function populateDoctors() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('http://localhost:3000/api/patient/doctors', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const doctors = await response.json();
            
            if (doctors && Array.isArray(doctors) && doctors.length > 0) {
                const selectElements = [doctorSelect, messageDoctorSelect];

                selectElements.forEach(select => {
                    select.innerHTML = '<option value="">Choose a doctor...</option>';
                    doctors.forEach(doctor => {
                        const option = document.createElement('option');
                        option.value = doctor._id;
                        option.textContent = doctor.email;
                        select.appendChild(option);
                    });
                });
            } else {
                console.warn('No doctors available');
                [doctorSelect, messageDoctorSelect].forEach(select => {
                    select.innerHTML = '<option value="">No doctors available</option>';
                });
            }
        } else {
            console.error('Failed to fetch doctors:', response.status);
            [doctorSelect, messageDoctorSelect].forEach(select => {
                select.innerHTML = '<option value="">Unable to load doctors</option>';
            });
        }
    } catch (error) {
        console.error('Error fetching doctors:', error);
        [doctorSelect, messageDoctorSelect].forEach(select => {
            select.innerHTML = '<option value="">Unable to load doctors</option>';
        });
    }
}

async function handleSymptomSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const symptomsInput = document.getElementById('symptoms-input').value;
    const messageDiv = document.getElementById('symptom-message');

    if (!symptomsInput.trim()) {
        showMessage(messageDiv, 'Please enter symptoms', 'error');
        return;
    }

    const symptoms = symptomsInput.split(',').map(s => s.trim()).filter(s => s);

    try {
        const response = await fetch('http://localhost:3000/api/patient/symptoms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ symptoms })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(messageDiv, 'Symptoms logged successfully!', 'success');
            symptomForm.reset();
            setTimeout(() => fetchSymptomHistory(), 500);
        } else {
            showMessage(messageDiv, data.message || 'Failed to log symptoms', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(messageDiv, 'An error occurred. Please try again.', 'error');
    }
}

async function handleAppointmentSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const messageDiv = document.getElementById('appointment-message');

    const doctorId = doctorSelect.value;
    const date = document.getElementById('appointment-date').value;
    const reason = document.getElementById('appointment-reason').value;

    if (!doctorId) {
        showMessage(messageDiv, 'Please select a doctor', 'error');
        return;
    }
    
    if (!date) {
        showMessage(messageDiv, 'Please select a date', 'error');
        return;
    }
    
    if (!reason.trim()) {
        showMessage(messageDiv, 'Please provide a reason for the appointment', 'error');
        return;
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showMessage(messageDiv, 'Please select a future date', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/patient/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ doctorId, date, reason })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(messageDiv, 'Appointment scheduled successfully!', 'success');
            appointmentForm.reset();
        } else {
            showMessage(messageDiv, data.message || 'Failed to schedule appointment', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(messageDiv, 'An error occurred. Please try again.', 'error');
    }
}

async function handleMessageSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const messageDiv = document.getElementById('message-message');

    const doctorId = messageDoctorSelect.value;
    const content = document.getElementById('message-content').value;

    if (!doctorId || !content.trim()) {
        showMessage(messageDiv, 'Please select a doctor and enter a message', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/patient/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ doctorId, content })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(messageDiv, 'Message sent successfully!', 'success');
            messageForm.reset();
        } else {
            showMessage(messageDiv, data.message || 'Failed to send message', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(messageDiv, 'An error occurred. Please try again.', 'error');
    }
}

async function fetchAndDisplayDoctors() {
    const token = localStorage.getItem('token');
    doctorListContainer.innerHTML = '<p class="loading">Loading doctors...</p>';

    try {
        const response = await fetch('http://localhost:3000/api/patient/doctors', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch doctors');

        const doctors = await response.json();
        doctorListContainer.innerHTML = ''; // Clear 'loading'

        if (doctors.length === 0) {
            doctorListContainer.innerHTML = '<p class="loading">No doctors are available at this time.</p>';
            return;
        }

        doctors.forEach(doctor => {
            const card = document.createElement('div');
            card.className = 'doctor-card';
            card.innerHTML = `
                <div class="doctor-email">${doctor.email}</div>
                <div class="doctor-specialty">Specialty: General Medicine</div>
                <button class="btn btn-primary btn-small" onclick="selectDoctorForAppointment('${doctor._id}', '${doctor.email}')">
                    Book Appointment
                </button>
            `;
            doctorListContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching doctors:', error);
        doctorListContainer.innerHTML = '<p class="loading error">Could not load doctors.</p>';
    }
}

async function handleChatbotSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const prompt = chatbotInput.value.trim();
    if (!prompt) return;

    appendChatMessage(prompt, 'user');
    patientChatHistory.push({ role: 'user', content: prompt });
    chatbotInput.value = '';

    try {
        const response = await fetch('http://localhost:3000/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ prompt, history: patientChatHistory })
        });

        if (!response.ok) throw new Error('AI chat failed');

        const data = await response.json();
        
        appendChatMessage(data.reply, 'bot');
        patientChatHistory.push({ role: 'assistant', content: data.reply });

    } catch (error) {
        console.error('Error:', error);
        appendChatMessage('Sorry, I am having trouble connecting. Please try again.', 'bot error');
    }
}

function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '../login/index.html';
}

function showMessage(element, text, type) {
    element.textContent = text;
    element.className = 'message ' + type;
    
    if (type === 'success') {
        setTimeout(() => {
            element.textContent = '';
            element.className = 'message';
        }, 5000);
    }
}

function selectDoctorForAppointment(doctorId, doctorEmail) {
    showSection('appointments');
    
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-section="appointments"]').classList.add('active');

    doctorSelect.value = doctorId;
    
    if (!doctorSelect.querySelector(`option[value="${doctorId}"]`)) {
        const option = document.createElement('option');
        option.value = doctorId;
        option.textContent = doctorEmail;
        doctorSelect.appendChild(option);
        doctorSelect.value = doctorId;
    }
}

function appendChatMessage(message, role) {
    const messageElement = document.createElement('div');
    messageElement.className = `chatbot-message ${role}`;
    messageElement.textContent = message;
    chatbotHistory.appendChild(messageElement);
    
    chatbotHistory.scrollTop = chatbotHistory.scrollHeight;
}