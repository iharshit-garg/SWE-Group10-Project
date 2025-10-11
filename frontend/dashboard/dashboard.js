const doctorSelect = document.getElementById('doctor-select');
const appointmentForm = document.getElementById('appointment-form');
const messageForm = document.getElementById('message-form');
const symptomHistoryElement = document.getElementById('symptom-history');
const userEmailElement = document.getElementById('user-email');
const userRoleElement = document.getElementById('user-role');
const logoutButton = document.getElementById('logout-button');

async function populateUserDetails() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token 
            }
        });

        if (response.ok) {
            const userData = await response.json();
            userEmailElement.textContent = userData.email;
            userRoleElement.textContent = userData.role;
        } else {
            localStorage.removeItem('token');
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        window.location.href = '/index.html';
    }
}

async function fetchSymptomHistory() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://localhost:3000/api/patient/symptoms', {
      headers: { 'x-auth-token': token }
    });
    if (response.ok) {
      const history = await response.json();
      symptomHistoryElement.innerHTML = '';

      if (history.length === 0) {
        symptomHistoryElement.innerHTML = '<p>No symptoms have been logged yet.</p>';
        return;
      }

      const list = document.createElement('ul');
      history.forEach(log => {
        const listItem = document.createElement('li');
        const formattedDate = new Date(log.date).toLocaleDateString();
        listItem.textContent = `${formattedDate}: ${log.symptoms.join(', ')}`;
        list.appendChild(listItem);
      });
      symptomHistoryElement.appendChild(list);
    }
  } catch (error) {
    console.error('Error fetching symptom history:', error);
    symptomHistoryElement.innerHTML = '<p>Could not load history.</p>';
  }
}

async function populateDoctors() {
  const response = await fetch('http://localhost:3000/api/doctor/patients', {
    headers: { 'x-auth-token': localStorage.getItem('token') } // Note: This is a temporary way to get doctors. Ideally, a public doctor list endpoint is better.
  });
  if (response.ok) {
    const users = await response.json();
    const doctors = users.filter(user => user.role === 'doctor'); // Assuming the endpoint returns all users
    doctors.forEach(doctor => {
      const option = document.createElement('option');
      option.value = doctor._id;
      option.textContent = doctor.email;
      doctorSelect.appendChild(option);
    });
  }
}

appointmentForm.addEventListener('submit', async e => {
  e.preventDefault();
  const response = await fetch('/api/patient/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('token') },
    body: JSON.stringify({
      doctorId: doctorSelect.value,
      date: document.getElementById('appointment-date').value,
      reason: document.getElementById('appointment-reason').value
    })
  });
  if(response.ok) alert('Appointment scheduled!');
});

messageForm.addEventListener('submit', async e => {
  e.preventDefault();
  const response = await fetch('/api/patient/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('token') },
    body: JSON.stringify({
      doctorId: doctorSelect.value,
      content: document.getElementById('message-content').value
    })
  });
  if(response.ok) alert('Message sent!');
});

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token'); 
    window.location.href = '/index.html'; 
});


populateUserDetails();
fetchSymptomHistory();