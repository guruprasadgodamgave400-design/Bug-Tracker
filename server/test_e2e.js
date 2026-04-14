const API_URL = 'http://localhost:5000/api';

async function fetchWithMethod(url, method, body, headers = {}) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error ${res.status}: ${errorText}`);
  }
  return await res.json();
}

async function runTests() {
  try {
    console.log('--- STARTING E2E BACKEND TESTS ---');

    const random = Math.floor(Math.random() * 10000);
    const email = `testuser${random}@test.com`;
    const password = 'password123';

    console.log(`1. Registering user ${email}...`);
    const regRes = await fetchWithMethod(`${API_URL}/auth/register`, 'POST', { name: 'Test User', email, password });
    const token = regRes.token;
    console.log('✅ Registered Successfully, got Token.');

    const headers = { Authorization: `Bearer ${token}` };

    console.log('\n2. Creating a new Project...');
    const project = await fetchWithMethod(`${API_URL}/projects`, 'POST', {
      title: 'Automated Test Project',
      description: 'E2E Testing is verifying project functionalities.'
    }, headers);
    console.log(`✅ Project Created: ${project.title} (ID: ${project._id})`);

    console.log('\n3. Creating a new Ticket...');
    const ticket = await fetchWithMethod(`${API_URL}/tickets`, 'POST', {
      title: 'Fix 500 Network Bug',
      description: 'Memory was wiped unexpectedly.',
      project: project._id,
      priority: 'High',
      status: 'To Do'
    }, headers);
    console.log(`✅ Ticket Created: ${ticket.title} (ID: ${ticket._id})`);

    console.log('\n4. Adding a Comment to the Ticket...');
    const comment = await fetchWithMethod(`${API_URL}/comments/ticket/${ticket._id}`, 'POST', {
      text: 'This issue is already resolved by the updated AuthMiddleware!'
    }, headers);
    console.log(`✅ Comment Created by ${comment.user?.name || 'User'}: "${comment.text}"`);

    console.log('\n5. Fetching Ticket Comments...');
    const commentsFetchRes = await fetchWithMethod(`${API_URL}/comments/ticket/${ticket._id}`, 'GET', null, headers);
    console.log(`✅ Fetched ${commentsFetchRes.length} comments successfully.`);

    console.log('\n--- ALL E2E BACKEND TESTS PASSED SUCCESSFULLY! ---');

  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Request Failed:', error.message);
    }
    process.exit(1);
  }
}

runTests();
