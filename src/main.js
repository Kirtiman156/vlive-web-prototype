// VLive Web App Logic

// DOM Elements
const homeView = document.getElementById('home-view');
const liveView = document.getElementById('live-view');
const feedContainer = document.getElementById('feed-container');
const closeLiveBtn = document.getElementById('close-live');
const likeBtn = document.getElementById('like-btn');
const heartsContainer = document.getElementById('hearts-container');
const chatMessages = document.getElementById('chat-messages');

// Mock Data mimicking the backend `UserLiveWithCategory` struct
const mockLiveStreams = [
  {
    live_id: 'L1001',
    stream_name: '🎵 Late Night Karaoke & Chill',
    nick_name: 'Akira Neon',
    avatar: './vtuber_1.png',
    total_viewers: '2.1k',
    is_live: true,
    category: 'Music'
  },
  {
    live_id: 'L1002',
    stream_name: 'FPS Ranked Grind to Diamond! 💎',
    nick_name: 'Zero Kuro',
    avatar: './vtuber_2.png',
    total_viewers: '5.4k',
    is_live: true,
    category: 'Gaming'
  },
  {
    live_id: 'L1003',
    stream_name: '☕ Morning Chat - Let\'s wake up!',
    nick_name: 'Nova VT',
    avatar: './vtuber_1.png',
    total_viewers: '856',
    is_live: true,
    category: 'Just Chatting'
  },
  {
    live_id: 'L1004',
    stream_name: 'Building cool tech widgets 💻',
    nick_name: 'Techie Yuka',
    avatar: './vtuber_2.png',
    total_viewers: '1.2k',
    is_live: true,
    category: 'Tech'
  }
];

// Initialize the Feed
function initFeed() {
  feedContainer.innerHTML = '';
  mockLiveStreams.forEach(stream => {
    const card = document.createElement('div');
    card.className = 'feed-card';
    card.innerHTML = `
      <img class="feed-thumbnail" src="${stream.avatar}" alt="Thumbnail">
      <div class="card-overlay">
        <div class="card-top">
          <div class="live-badge">LIVE</div>
          <div class="viewer-badge">👁 ${stream.total_viewers}</div>
        </div>
        <div class="card-bottom">
          <h3>${stream.stream_name}</h3>
          <div class="host-mini-info">
            <img src="${stream.avatar}" class="host-mini-avatar">
            <span>${stream.nick_name}</span>
            <span style="margin-left:auto; background:rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px; font-size:10px;">${stream.category}</span>
          </div>
        </div>
      </div>
    `;
    
    // Add click event to open Live Room
    card.addEventListener('click', () => openLiveRoom(stream));
    feedContainer.appendChild(card);
  });
}

// Logic for opening the live room
let chatInterval;

function openLiveRoom(stream) {
  // Populate Live Room UI
  document.getElementById('live-avatar-img').src = stream.avatar;
  document.getElementById('live-host-avatar').src = stream.avatar;
  document.getElementById('live-host-name').innerText = stream.nick_name;
  document.getElementById('live-viewers').innerText = '👁 ' + stream.total_viewers;

  // Clear previous chat
  chatMessages.innerHTML = '<div class="chat-msg system">Welcome to the Live Room! Please be respectful to the VTuber.</div>';

  // Toggle View
  homeView.classList.remove('active');
  liveView.classList.add('active');

  // Start Fake Chat loop
  startFakeChat();
}

function closeLiveRoom() {
  clearInterval(chatInterval);
  liveView.classList.remove('active');
  homeView.classList.add('active');
}

closeLiveBtn.addEventListener('click', closeLiveRoom);

// Mock Chat Generator
const mockUsernames = ['baka_boy', 'sakura_fan', 'pro_gamer99', 'vtuber_simp', 'neon_lights', 'anon_user'];
const mockMessages = [
  'Kawaii!!! 😍',
  'lol true',
  'Can you sing another song?',
  'PogChamp',
  'Notice me pls!!',
  'The rigging on this model is so crisp',
  'What game are we playing next?',
  'W',
  '🔥🔥🔥'
];

function startFakeChat() {
  chatInterval = setInterval(() => {
    const username = mockUsernames[Math.floor(Math.random() * mockUsernames.length)];
    const text = mockMessages[Math.floor(Math.random() * mockMessages.length)];
    
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg';
    msgEl.innerHTML = `<span class="username">${username}:</span> ${text}`;
    
    chatMessages.appendChild(msgEl);
    
    // Auto scroll down
    const container = document.querySelector('.chat-container');
    container.scrollTop = container.scrollHeight;
    
    // Remove old messages to prevent DOM bloat
    if (chatMessages.children.length > 30) {
      chatMessages.removeChild(chatMessages.children[1]);
    }
    
  }, 1500); // New message every 1.5 seconds
}

// Interactive Hearts (Like System)
const heartEmojis = ['❤️', '💖', '✨', '🔥'];

likeBtn.addEventListener('click', () => {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    
    // Random horizontal start position
    heart.style.left = Math.random() * 20 + 'px';
    
    heartsContainer.appendChild(heart);
    
    // Remove element after animation ends
    setTimeout(() => {
      heart.remove();
    }, 2000);
});

// Run Init
document.addEventListener('DOMContentLoaded', () => {
  initFeed();
});
