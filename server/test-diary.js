// Smart Test: Registers a NEW user, then saves a Diary
async function testDiaryFlow() {
  const registerUrl = 'http://localhost:5000/api/auth/register';
  const diaryUrl = 'http://localhost:5000/api/diaries';

  // 1. Create a RANDOM user (so we never worry about "User exists" errors)
  const randomId = Date.now();
  const newUser = {
    email: `auto_tester_${randomId}@example.com`,
    password: "testpassword123"
  };

  try {
    console.log(`1. Creating new user: ${newUser.email}...`);
    
    // REGISTER (Get a fresh token)
    const authRes = await fetch(registerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    const authData = await authRes.json();

    if (!authData.token) {
      console.log("❌ Registration Failed:", authData);
      return;
    }
    console.log("✅ Registration Success! Got Token.");

    // 2. Use the FRESH token to save a diary
    console.log("2. Attempting to Save Diary...");
    const diaryRes = await fetch(diaryUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}` // <--- Using the fresh token
      },
      body: JSON.stringify({
        date: "2026-01-24",
        mood: "Excited",
        text: "This test runs with a brand new user every time!"
      })
    });
    const diaryData = await diaryRes.json();

    // 3. Check results
    if (diaryRes.status === 201) {
      console.log("------------------------------------------------");
      console.log("🎉 SUCCESS! Diary Saved to Database.");
      console.log("------------------------------------------------");
    } else {
      console.log("❌ FAILED:", diaryData);
    }

  } catch (error) {
    console.error("❌ NETWORK ERROR:", error);
  }
}

testDiaryFlow();