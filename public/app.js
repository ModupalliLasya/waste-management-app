async function createUser() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert("Please enter a username!");
        return;
    }

    const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, qrCode: `QR-${username}` }),
    });

    if (response.ok) {
        const user = await response.json();
        alert(`Profile created for ${user.username}`);
        displayUserInfo(user);
    } else {
        alert('Error creating profile. Try a different username.');
    }
}

async function getUserInfo() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert("Please enter a username to view the profile.");
        return;
    }

    const response = await fetch(`/api/users/${username}`);
    if (response.ok) {
        const user = await response.json();
        displayUserInfo(user);
    } else {
        alert('User not found.');
    }
}

async function addPoints() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert("Please enter a username.");
        return;
    }

    const response = await fetch(`/api/users/${username}/add-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pointsToAdd: 10 }),
    });

    if (response.ok) {
        const user = await response.json();
        displayUserInfo(user);
        alert(`10 points added! Total points: ${user.points}`);
    } else {
        alert('Error adding points.');
    }
}

function displayUserInfo(user) {
    document.getElementById("profile-name").innerHTML = `Username: <span>${user.username}</span>`;
    document.getElementById("profile-points").innerHTML = `Points: <span>${user.points}</span>`;
    document.getElementById("profile-badges").innerHTML = `Badges: <span>${user.badges.join(', ') || 'None'}</span>`;
}

async function resetPoints() {
    const username = document.getElementById('username').value;
    if (!username) {
        alert("Please enter a username.");
        return;
    }

    const response = await fetch(`/api/users/${username}/reset-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        const user = await response.json();
        displayUserInfo(user);
        alert(`Points reset to zero for ${user.username}`);
    } else {
        alert('Error resetting points.');
    }
}
