async function testSignup() {
  const url = 'http://localhost:5000/api/auth/register';
  // Use a random email so you don't get "User already exists" error
  const fakeUser = {
    email: "newuser" + Date.now() + "@test.com",
    password: "mypassword123"
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fakeUser)
    });

    const data = await response.json();
    console.log("STATUS:", response.status);
    
    if (data.token) console.log("✅ SUCCESS! Token received.");
    else console.log("❌ FAILED:", data);

  } catch (error) {
    console.error("❌ ERROR:", error);
  }
}

testSignup();