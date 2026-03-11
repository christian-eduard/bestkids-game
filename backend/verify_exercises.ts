
async function verify() {
    const baseURL = 'http://localhost:3001/api';

    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'student1',
                password: 'admin123'
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json() as any;
        const token = loginData.access_token;
        console.log('Login successful. Token obtained.');

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // 2. Verify IDs
        const ids = [27, 33, 34, 35, 37, 43];

        for (const id of ids) {
            try {
                const res = await fetch(`${baseURL}/exercises/${id}`, { headers });
                if (res.ok) {
                    const data = await res.json() as any;
                    console.log(`[PASS] ID ${id}: ${data.title} (${data.exerciseType})`);
                } else {
                    console.log(`[FAIL] ID ${id}: ${res.status} ${res.statusText}`);
                }
            } catch (err: any) {
                console.log(`[FAIL] ID ${id}: ${err.message}`);
            }
        }

    } catch (error: any) {
        console.error('Verification failed:', error.message);
    }
}

verify();
