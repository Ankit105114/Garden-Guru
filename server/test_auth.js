const axios = require('axios');

const testAuth = async () => {
    try {
        console.log('Testing Registration...');
        const regRes = await axios.post('http://localhost:5001/api/auth/register', {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        });
        console.log('Registration Success:', regRes.data);

        console.log('Testing Login...');
        const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
            email: JSON.parse(regRes.config.data).email,
            password: 'password123'
        });
        console.log('Login Success, Token:', loginRes.data.token ? 'Received' : 'Missing');

    } catch (err) {
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        } else {
            console.error('Error Message:', err.message);
        }
    }
};

testAuth();
