// ===== USER DASHBOARD SPECIFIC FUNCTIONALITY =====

// Check authentication on page load
function checkUserAuth() {
  const userData = sessionStorage.getItem('smartguide_user') || 
                   localStorage.getItem('smartguide_user');
  
  if (!userData) {
    // Redirect to login if not authenticated
    window.location.href = 'login.html';
    return null;
  }
  
  try {
    const user = JSON.parse(userData);
    
    // Check if user has correct role
    if (user.role !== 'User') {
      // Redirect to appropriate dashboard
      window.location.href = 'index.html';
      return null;
    }
    
    return user;
  } catch (e) {
    console.error('Error parsing user data:', e);
    window.location.href = 'login.html';
    return null;
  }
}

// Initialize user dashboard
const currentUser = checkUserAuth();

if (currentUser) {
  // Update user info in sidebar
  const userNameEl = document.querySelector('.user-name');
  const userRoleEl = document.querySelector('.user-role-text');
  
  if (userNameEl) userNameEl.textContent = currentUser.name;
  if (userRoleEl) userRoleEl.textContent = currentUser.role;
  
  console.log('👤 User Dashboard initialized for:', currentUser.name);
}

// ===== LOGOUT FUNCTIONALITY =====
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to logout?')) {
    sessionStorage.removeItem('smartguide_user');
    localStorage.removeItem('smartguide_user');
    localStorage.removeItem('smartguide_remember');
    
    showModal('Logout Successful', 'You have been logged out. Redirecting...');
    
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  }
});

// ===== QUICK EMERGENCY BUTTON =====
const quickEmergencyBtn = document.getElementById('quickEmergency');

quickEmergencyBtn.addEventListener('click', () => {
  // Trigger emergency alert
  emergencyStatusEl.textContent = 'ACTIVE';
  
  addActivityLog(
    formatTime(new Date()),
    'EMERGENCY ALERT',
    'User triggered emergency button',
    'Danger'
  );
  
  showModal(
    '🚨 EMERGENCY ALERT SENT!',
    'Emergency notification has been sent to all your contacts:\n\n' +
    '• Pedro Dela Cruz (Primary)\n' +
    '• Maria Santos (Secondary)\n' +
    '• Emergency Services (911)\n\n' +
    'Help is on the way!'
  );
  
  playVoiceMessage('Emergency alert sent to all contacts. Help is on the way.');
  
  // Add to timeline
  addTimelineItem('alert', 'Emergency Alert', 'Emergency button pressed', 'Just now');
  
  // Reset after demo
  setTimeout(() => {
    emergencyStatusEl.textContent = 'None';
  }, 10000);
});

// ===== SHARE LOCATION =====
const shareLocationBtn = document.getElementById('shareLocationBtn');

shareLocationBtn.addEventListener('click', () => {
  const currentLocation = document.getElementById('currentLocation').textContent;
  
  addActivityLog(
    formatTime(new Date()),
    'Location Shared',
    'Location sent to emergency contacts',
    'Success'
  );
  
  showModal(
    '📤 Location Shared',
    `Your current location has been shared:\n\n${currentLocation}\n\nSent to all emergency contacts.`
  );
  
  playVoiceMessage('Location shared successfully');
  
  addTimelineItem('navigation', 'Location Shared', `Shared location: ${currentLocation}`, 'Just now');
});

// ===== VOICE CONTROLS =====
const testVoiceBtn = document.getElementById('testVoice');
const adjustVolumeBtn = document.getElementById('adjustVolume');
const changeSpeedBtn = document.getElementById('changeSpeed');

let currentVolume = 80;
let currentSpeed = 1.0;

testVoiceBtn.addEventListener('click', () => {
  const messages = [
    'Voice assistant is working correctly',
    'Obstacle detected 30 centimeters ahead',
    'Turn right in 10 meters',
    'You are on Corrales Avenue',
    'Battery at 78 percent'
  ];
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  playVoiceMessage(randomMessage);
  
  showModal('🔊 Voice Test', `Playing: "${randomMessage}"`);
  
  addTimelineItem('success', 'Voice Test', 'Voice system tested successfully', 'Just now');
});

adjustVolumeBtn.addEventListener('click', () => {
  const volumes = [60, 70, 80, 90, 100];
  const currentIndex = volumes.indexOf(currentVolume);
  const nextIndex = (currentIndex + 1) % volumes.length;
  currentVolume = volumes[nextIndex];
  
  adjustVolumeBtn.textContent = `🔈 Volume: ${currentVolume}%`;
  
  showModal('🔈 Volume Adjusted', `Voice volume set to ${currentVolume}%`);
  playVoiceMessage(`Volume set to ${currentVolume} percent`);
});

changeSpeedBtn.addEventListener('click', () => {
  const speeds = {
    0.8: 'Slow',
    1.0: 'Normal',
    1.2: 'Fast'
  };
  
  const speedValues = Object.keys(speeds).map(Number);
  const currentIndex = speedValues.indexOf(currentSpeed);
  const nextIndex = (currentIndex + 1) % speedValues.length;
  currentSpeed = speedValues[nextIndex];
  
  changeSpeedBtn.textContent = `⚡ Speed: ${speeds[currentSpeed]}`;
  
  showModal('⚡ Speed Adjusted', `Voice speed set to ${speeds[currentSpeed]}`);
  playVoiceMessage(`Speed set to ${speeds[currentSpeed]}`);
});

// ===== AUTO-ANNOUNCE SETTINGS =====
const autoAnnounceCheckbox = document.getElementById('autoAnnounce');
const streetNamesCheckbox = document.getElementById('streetNames');

autoAnnounceCheckbox.addEventListener('change', (e) => {
  const status = e.target.checked ? 'enabled' : 'disabled';
  showModal(
    '⚙️ Setting Updated',
    `Auto-announce obstacles ${status}`
  );
  
  addTimelineItem('success', 'Settings Changed', `Auto-announce ${status}`, 'Just now');
});

streetNamesCheckbox.addEventListener('change', (e) => {
  const status = e.target.checked ? 'enabled' : 'disabled';
  showModal(
    '⚙️ Setting Updated',
    `Street name announcements ${status}`
  );
  
  addTimelineItem('success', 'Settings Changed', `Street names ${status}`, 'Just now');
});

// ===== EMERGENCY CONTACTS =====
const contactCallBtns = document.querySelectorAll('.contact-call-btn');

contactCallBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const contactName = btn.dataset.contact;
    
    addActivityLog(
      formatTime(new Date()),
      'Calling Contact',
      `Initiating call to ${contactName}`,
      'Info'
    );
    
    showModal(
      '📞 Calling...',
      `Connecting to ${contactName}...\n\nPlease wait.`
    );
    
    playVoiceMessage(`Calling ${contactName}`);
    
    addTimelineItem('navigation', 'Call Initiated', `Calling ${contactName}`, 'Just now');
  });
});

// ===== ACTIVITY FILTER =====
const activityFilter = document.getElementById('activityFilter');

activityFilter.addEventListener('change', (e) => {
  const filterValue = e.target.value;
  showModal(
    'Filter Applied',
    `Showing ${filterValue === 'all' ? 'all events' : filterValue} only`
  );
});

// ===== TIMELINE HELPER FUNCTION =====
function addTimelineItem(type, title, description, time) {
  const timelineEl = document.getElementById('activityTimeline');
  
  const item = document.createElement('div');
  item.className = 'timeline-item';
  item.innerHTML = `
    <div class="timeline-marker ${type}"></div>
    <div class="timeline-content">
      <div class="timeline-header">
        <h4>${title}</h4>
        <span class="timeline-time">${time}</span>
      </div>
      <p>${description}</p>
    </div>
  `;
  
  timelineEl.insertBefore(item, timelineEl.firstChild);
  
  // Keep only last 10 items
  if (timelineEl.children.length > 10) {
    timelineEl.removeChild(timelineEl.lastChild);
  }
}

// ===== SIMULATED USER DATA UPDATES =====
function simulateUserActivity() {
  setInterval(() => {
    // Random activity generation
    const rand = Math.random();
    
    if (rand > 0.95) {
      // Simulate obstacle detection
      const distance = Math.floor(Math.random() * 80) + 20;
      addTimelineItem(
        'obstacle',
        'Obstacle Detected',
        `Object detected ${distance}cm ahead - successfully avoided`,
        'Just now'
      );
      
      if (autoAnnounceCheckbox.checked) {
        playVoiceMessage(`Obstacle detected ${distance} centimeters ahead`);
      }
    }
    
    if (rand > 0.98) {
      // Simulate navigation update
      const streets = ['Corrales Avenue', 'Hayes Street', 'Chavez Street', 'Limketkai Drive'];
      const randomStreet = streets[Math.floor(Math.random() * streets.length)];
      
      addTimelineItem(
        'navigation',
        'Navigation Update',
        `Now on ${randomStreet}`,
        'Just now'
      );
      
      if (streetNamesCheckbox.checked) {
        playVoiceMessage(`You are now on ${randomStreet}`);
      }
    }
  }, 8000); // Check every 8 seconds
}

// ===== UPDATE DISTANCE WALKED =====
let distanceWalked = 2.4; // km

function updateDistance() {
  setInterval(() => {
    // Slowly increment distance
    if (Math.random() > 0.7) {
      distanceWalked += 0.01;
      document.getElementById('distanceWalked').textContent = distanceWalked.toFixed(2) + ' km';
    }
  }, 10000); // Every 10 seconds
}

// ===== BATTERY WARNING FOR USER =====
function checkUserBattery() {
  setInterval(() => {
    const batteryLevel = parseInt(batteryLevelEl.textContent);
    
    if (batteryLevel === 20) {
      showModal(
        '🔋 Low Battery Warning',
        'Your SmartGuide battery is at 20%. Please charge soon to ensure continuous assistance.'
      );
      playVoiceMessage('Low battery warning. Please charge your device');
      
      addTimelineItem(
        'alert',
        'Low Battery',
        'Battery level critical - charge required',
        'Just now'
      );
    }
  }, 30000); // Check every 30 seconds
}

// ===== INITIALIZE USER DASHBOARD =====
function initializeUserDashboard() {
  console.log('🎯 User Dashboard Initialized');
  console.log('👤 User:', currentUser?.name);
  
  // Start simulations
  simulateUserActivity();
  updateDistance();
  checkUserBattery();
  
  // Welcome message
  setTimeout(() => {
    showModal(
      '👋 Welcome Back!',
      `Hello ${currentUser?.name}! Your SmartGuide is ready and connected.`
    );
    playVoiceMessage(`Welcome back ${currentUser?.name}. Your SmartGuide is ready`);
  }, 1000);
}

// Initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUserDashboard);
} else {
  initializeUserDashboard();
}
