const loginForm = document.getElementById('login-form');
const messageElement = document.getElementById('message');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const messageElement = document.getElementById('message');

    if (email === '' || password === '') {
        messageElement.textContent = 'Email and password are required.';
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            messageElement.style.color = 'green';
            messageElement.textContent = 'Login successful! Redirecting...';
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            messageElement.textContent = data.message || 'Login failed.';
        }
    } catch (error) {
        console.error('Login Error:', error);
        messageElement.textContent = 'An error occurred. Please try again.';
    }
});