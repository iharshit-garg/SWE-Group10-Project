const patientListElement = document.getElementById('patient-list');
const symptomHistoryElement = document.getElementById('symptom-history');
const selectedPatientElement = document.getElementById('selected-patient');
const token = localStorage.getItem('token');

async function fetchPatients() {
    const response = await fetch('http://localhost:3000/api/doctor/patients', {
        headers: { 'x-auth-token': token }
    });
    if (response.ok) {
        const patients = await response.json();
        patientListElement.innerHTML = '';
        patients.forEach(patient => {
            const button = document.createElement('button');
            button.textContent = patient.email;
            button.onclick = () => fetchPatientSymptoms(patient._id, patient.email);
            patientListElement.appendChild(button);
        });
    }
}

async function fetchPatientSymptoms(patientId, patientEmail) {
    selectedPatientElement.textContent = patientEmail;
    const response = await fetch(`http://localhost:3000/api/doctor/patients/${patientId}/symptoms`, {
        headers: { 'x-auth-token': token }
    });
    if (response.ok) {
        const history = await response.json();
        symptomHistoryElement.innerHTML = '';
        if (history.length > 0) {
            const list = document.createElement('ul');
            history.forEach(log => {
                const item = document.createElement('li');
                item.textContent = `${new Date(log.date).toLocaleDateString()}: ${log.symptoms.join(', ')}`;
                list.appendChild(item);
            });
            symptomHistoryElement.appendChild(list);
        } else {
            symptomHistoryElement.innerHTML = '<p>No symptoms logged for this patient.</p>';
        }
    }
}

fetchPatients();