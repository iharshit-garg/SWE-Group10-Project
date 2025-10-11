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

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token'); 
    window.location.href = '/index.html'; 
});

populateUserDetails();