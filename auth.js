document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login');
    const registerForm = document.getElementById('register');
    const logoutBtn = document.getElementById('logout_btn');
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // Login functionality
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = users.find(user => user.username === username && user.password === password);
            
            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'index.html'; // Redirect to main tracker page
            } else {
                alert('Invalid username or password');
            }
        });
    }

    // Register functionality
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newUsername = document.getElementById('new-username').value;
            const newPassword = document.getElementById('new-password').value;

            // Check if the username already exists
            if (users.some(user => user.username === newUsername)) {
                alert('Username already exists. Please choose a different username.');
                return;
            }

            // Add the new user to the users array
            users.push({ username: newUsername, password: newPassword });

            // Save users to localStorage
            localStorage.setItem('users', JSON.stringify(users));

            alert('Registration successful! You can now log in.');
            window.location.href = 'login.html'; // Redirect to login page
        });
    }

    // Logout functionality
    if (logoutBtn && loggedInUser) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html'; // Redirect to login page
        });
    }

    // Redirect if user is not logged in
    if (!loggedInUser && window.location.pathname !== '/login.html' && window.location.pathname !== '/register.html') {
        window.location.href = 'login.html'; // Redirect to login page if not logged in
    }
});
