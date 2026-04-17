// ============================================================
// VLIVE WEB — Main Application Logic v2
// Mirrors the backend API structure from v_tube_admin
// ============================================================

// ── Mock Data (mirrors Go entity structs) ──────────────────

const CATEGORIES = [
  { id: 'all', name: 'すべて' },
  { id: 'music', name: 'Music' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'chat', name: 'Just Chatting' },
  { id: 'tech', name: 'Tech' },
];

const AVATARS = [
  './vtuber_1.png',
  './vtuber_2.png',
  './vtuber_3.png',
  './vtuber_4.png',
  './vtuber_5.png',
  './vtuber_6.png',
];

// Mimics entity.UserLiveWithCategory
const MOCK_STREAMS = [
  { live_id: 'L001', user_id: 'U001', nick_name: 'Akira Neon', stream_name: '🎵 深夜カラオケ配信〜リクエスト受付中！', avatar: AVATARS[0], is_live: true, total_viewers: 2134, category: 'music' },
  { live_id: 'L002', user_id: 'U002', nick_name: 'Zero Kuro', stream_name: 'ランク戦！ダイヤ目指す💎', avatar: AVATARS[1], is_live: true, total_viewers: 5421, category: 'gaming' },
  { live_id: 'L003', user_id: 'U003', nick_name: 'Sakura Mochi', stream_name: '☕ 朝の雑談タイム〜おはよう！', avatar: AVATARS[2], is_live: true, total_viewers: 856, category: 'chat' },
  { live_id: 'L004', user_id: 'U004', nick_name: 'Dark Shade', stream_name: 'ホラーゲーム実況…怖い😱', avatar: AVATARS[3], is_live: true, total_viewers: 3201, category: 'gaming' },
  { live_id: 'L005', user_id: 'U005', nick_name: 'Kitsune Hana', stream_name: '🎶 オリジナル曲披露！新曲あり', avatar: AVATARS[4], is_live: true, total_viewers: 1789, category: 'music' },
  { live_id: 'L006', user_id: 'U006', nick_name: 'Silver Wind', stream_name: 'テック雑談＆コーディング配信 💻', avatar: AVATARS[5], is_live: true, total_viewers: 943, category: 'tech' },
];

// Mimics entity.RankedUser
const MOCK_RANKINGS = [
  { id: 'U002', name: 'Zero Kuro', image_url: AVATARS[1], total_duration: 48200 },
  { id: 'U001', name: 'Akira Neon', image_url: AVATARS[0], total_duration: 36100 },
  { id: 'U005', name: 'Kitsune Hana', image_url: AVATARS[4], total_duration: 28500 },
  { id: 'U004', name: 'Dark Shade', image_url: AVATARS[3], total_duration: 21000 },
  { id: 'U003', name: 'Sakura Mochi', image_url: AVATARS[2], total_duration: 14300 },
];

const GIFTS = [
  { emoji: '🌹', name: 'バラ', price: 10 },
  { emoji: '🎀', name: 'リボン', price: 20 },
  { emoji: '💎', name: 'ダイヤ', price: 50 },
  { emoji: '🏆', name: 'トロフィー', price: 100 },
  { emoji: '🚀', name: 'ロケット', price: 200 },
  { emoji: '👑', name: '王冠', price: 500 },
  { emoji: '🌈', name: '虹', price: 30 },
  { emoji: '⭐', name: '星', price: 5 },
];

const CHAT_USERNAMES = ['sakura_fan', 'pro_gamer99', 'vt_lover', 'anon_user', 'neon_light', 'kawaii_chan', 'stream_watcher', 'midnight_owl'];
const CHAT_MESSAGES = [
  'かわいい！😍', 'www', 'もう一曲お願い！', '888888', '神配信！',
  'こんばんは〜', 'リグすごい！', '何のゲーム？', 'w', '🔥🔥🔥',
  'フォローした！', 'いいね！', '最高！', 'お疲れ様！',
];

// ── DOM References ─────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const splash = $('#splash-screen');
const views = $$('.view');
const bottomNav = $('#bottom-nav');
const navTabs = $$('.nav-tab[data-view]');

// Home
const storiesScroll = $('#stories-scroll');
const rankingScroll = $('#ranking-scroll');
const feedGrid = $('#feed-grid');
const liveCountBadge = $('#live-count');
const categoryTabs = $$('.cat-tab');
const searchToggle = $('#search-toggle-btn');
const searchPanel = $('#search-panel');
const searchInput = $('#search-input');
const searchCancel = $('#search-cancel-btn');
const searchResults = $('#search-results');

// Discover
const discoverCategories = $('#discover-categories');
const discoverGrid = $('#discover-grid');

// Live
const liveView = $('#live-view');
const liveBgImg = $('#live-bg-img');
const liveHostPic = $('#live-host-pic');
const liveHostName = $('#live-host-name');
const liveViewersNum = $('#live-viewers-num');
const liveDuration = $('#live-duration');
const closeLiveBtn = $('#close-live-btn');
const chatList = $('#chat-list');
const chatScroll = $('#chat-scroll');
const chatInput = $('#chat-input');
const sendMsgBtn = $('#send-msg-btn');
const likeBtn = $('#like-btn');
const giftBtn = $('#gift-btn');
const giftPanel = $('#gift-panel');
const closeGiftPanel = $('#close-gift-panel');
const giftGrid = $('#gift-grid');
const heartsLayer = $('#hearts-layer');
const giftOverlay = $('#gift-overlay');
const followBtn = $('#follow-btn');

let chatInterval = null;
let durationInterval = null;
let durationSeconds = 0;
let currentCategory = 'all';
let isFollowing = false;

// ── Splash ─────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    splash.classList.add('hidden');
    $('#home-view').classList.add('active');
  }, 2200);
});

// ── Navigation ─────────────────────────────────────────────
navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetId = tab.dataset.view;
    // Don't navigate to inbox (placeholder)
    if (targetId === 'inbox-view') return;

    navTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    views.forEach(v => v.classList.remove('active'));
    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');
  });
});

// ── Stories ─────────────────────────────────────────────────
function renderStories() {
  storiesScroll.innerHTML = '';
  MOCK_STREAMS.forEach(s => {
    const el = document.createElement('div');
    el.className = 'story-bubble';
    el.innerHTML = `
      <div class="story-ring ${s.is_live ? 'live-ring' : ''}">
        <img src="${s.avatar}" alt="${s.nick_name}">
        ${s.is_live ? '<span class="story-live-badge">LIVE</span>' : ''}
      </div>
      <span class="story-name">${s.nick_name}</span>
    `;
    el.addEventListener('click', () => openLive(s));
    storiesScroll.appendChild(el);
  });
}

// ── Rankings ────────────────────────────────────────────────
function renderRankings() {
  rankingScroll.innerHTML = '';
  const badges = ['gold', 'silver', 'bronze'];
  MOCK_RANKINGS.forEach((r, i) => {
    const card = document.createElement('div');
    card.className = 'rank-card';
    const hours = Math.floor(r.total_duration / 3600);
    card.innerHTML = `
      ${i < 3 ? `<div class="rank-badge ${badges[i]}">${i + 1}</div>` : ''}
      <img src="${r.image_url}" alt="${r.name}">
      <div class="rank-name">${r.name}</div>
      <div class="rank-time">${hours}h 配信</div>
    `;
    rankingScroll.appendChild(card);
  });
}

// ── Feed Grid ──────────────────────────────────────────────
function renderFeed(category = 'all') {
  const streams = category === 'all'
    ? MOCK_STREAMS
    : MOCK_STREAMS.filter(s => s.category === category);

  liveCountBadge.textContent = streams.length;
  feedGrid.innerHTML = '';

  streams.forEach(s => {
    const card = document.createElement('div');
    card.className = 'feed-card';
    const viewerStr = s.total_viewers >= 1000
      ? (s.total_viewers / 1000).toFixed(1) + 'k'
      : s.total_viewers;
    card.innerHTML = `
      <img src="${s.avatar}" alt="${s.stream_name}">
      <div class="feed-card-overlay">
        <div class="feed-card-top">
          <span class="feed-live-tag">LIVE</span>
          <span class="feed-viewer-tag">👁 ${viewerStr}</span>
        </div>
        <div class="feed-card-bottom">
          <div class="feed-card-title">${s.stream_name}</div>
          <div class="feed-host-info">
            <img src="${s.avatar}" alt="">
            <span>${s.nick_name}</span>
            <span class="feed-cat">${s.category}</span>
          </div>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openLive(s));
    feedGrid.appendChild(card);
  });
}

// ── Category Filter ────────────────────────────────────────
categoryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    categoryTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentCategory = tab.dataset.cat;
    renderFeed(currentCategory);
  });
});

// ── Search ─────────────────────────────────────────────────
searchToggle.addEventListener('click', () => {
  searchPanel.classList.toggle('hidden');
  if (!searchPanel.classList.contains('hidden')) {
    searchInput.focus();
  }
});
searchCancel.addEventListener('click', () => {
  searchPanel.classList.add('hidden');
  searchInput.value = '';
  searchResults.innerHTML = '';
});
searchInput.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  if (!q) { searchResults.innerHTML = ''; return; }
  const results = MOCK_STREAMS.filter(s =>
    s.nick_name.toLowerCase().includes(q) || s.stream_name.toLowerCase().includes(q)
  );
  searchResults.innerHTML = results.map(s => `
    <div class="search-result-item" data-id="${s.live_id}">
      <img src="${s.avatar}" alt="">
      <div>
        <div class="sr-name">${s.nick_name}</div>
        <div class="sr-sub">${s.stream_name}</div>
      </div>
    </div>
  `).join('');

  searchResults.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const stream = MOCK_STREAMS.find(s => s.live_id === item.dataset.id);
      if (stream) openLive(stream);
      searchPanel.classList.add('hidden');
      searchInput.value = '';
    });
  });
});

// ── Discover View ──────────────────────────────────────────
function renderDiscover() {
  const catColors = [
    'linear-gradient(135deg, #e040fb, #7c4dff)',
    'linear-gradient(135deg, #ff5252, #ff1744)',
    'linear-gradient(135deg, #448aff, #2979ff)',
    'linear-gradient(135deg, #69f0ae, #00c853)',
  ];
  const catEmojis = ['🎵', '🎮', '💬', '💻'];
  discoverCategories.innerHTML = '';
  CATEGORIES.filter(c => c.id !== 'all').forEach((c, i) => {
    const card = document.createElement('div');
    card.className = 'discover-cat-card';
    card.style.background = catColors[i % catColors.length];
    card.innerHTML = `<span class="cat-emoji">${catEmojis[i]}</span>${c.name}`;
    discoverCategories.appendChild(card);
  });

  // Recommended grid (reuse feed cards)
  discoverGrid.innerHTML = '';
  const shuffled = [...MOCK_STREAMS].sort(() => Math.random() - 0.5);
  shuffled.forEach(s => {
    const card = document.createElement('div');
    card.className = 'feed-card';
    const viewerStr = s.total_viewers >= 1000 ? (s.total_viewers / 1000).toFixed(1) + 'k' : s.total_viewers;
    card.innerHTML = `
      <img src="${s.avatar}" alt="">
      <div class="feed-card-overlay">
        <div class="feed-card-top">
          <span class="feed-live-tag">LIVE</span>
          <span class="feed-viewer-tag">👁 ${viewerStr}</span>
        </div>
        <div class="feed-card-bottom">
          <div class="feed-card-title">${s.stream_name}</div>
          <div class="feed-host-info"><img src="${s.avatar}"><span>${s.nick_name}</span></div>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openLive(s));
    discoverGrid.appendChild(card);
  });
}

// ── Live Room ──────────────────────────────────────────────
function openLive(stream) {
  // Populate
  liveBgImg.src = stream.avatar;
  liveHostPic.src = stream.avatar;
  liveHostName.textContent = stream.nick_name;
  liveViewersNum.textContent = stream.total_viewers.toLocaleString();

  // Reset state
  isFollowing = false;
  followBtn.textContent = 'Follow';
  followBtn.classList.remove('following');
  chatList.innerHTML = '<div class="chat-bubble system-msg">ライブルームへようこそ！マナーを守って楽しみましょう ✨</div>';
  giftPanel.classList.add('hidden');

  // Show live view, hide nav
  views.forEach(v => v.classList.remove('active'));
  liveView.classList.add('active');
  bottomNav.classList.add('hidden');

  // Start timers
  durationSeconds = 0;
  updateDuration();
  durationInterval = setInterval(() => { durationSeconds++; updateDuration(); }, 1000);
  startChat();
}

function closeLive() {
  clearInterval(chatInterval);
  clearInterval(durationInterval);
  liveView.classList.remove('active');
  bottomNav.classList.remove('hidden');

  // Go back to whichever tab was active
  const activeTab = document.querySelector('.nav-tab.active');
  const targetView = activeTab ? activeTab.dataset.view : 'home-view';
  const target = document.getElementById(targetView);
  if (target) target.classList.add('active');
}

closeLiveBtn.addEventListener('click', closeLive);

function updateDuration() {
  const m = String(Math.floor(durationSeconds / 60)).padStart(2, '0');
  const s = String(durationSeconds % 60).padStart(2, '0');
  liveDuration.textContent = `${m}:${s}`;
}

// ── Follow ─────────────────────────────────────────────────
followBtn.addEventListener('click', () => {
  isFollowing = !isFollowing;
  followBtn.textContent = isFollowing ? 'Following' : 'Follow';
  followBtn.classList.toggle('following', isFollowing);
});

// ── Chat System ────────────────────────────────────────────
function startChat() {
  clearInterval(chatInterval);
  chatInterval = setInterval(() => {
    const user = CHAT_USERNAMES[Math.floor(Math.random() * CHAT_USERNAMES.length)];
    const msg = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
    addChatBubble(user, msg);
  }, 1800);
}

function addChatBubble(username, text) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = `<span class="chat-user">${username}</span>${text}`;
  chatList.appendChild(bubble);
  chatScroll.scrollTop = chatScroll.scrollHeight;
  // Clean up
  if (chatList.children.length > 40) chatList.removeChild(chatList.children[0]);
}

// Send message
sendMsgBtn.addEventListener('click', sendUserMessage);
chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendUserMessage(); });
function sendUserMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  addChatBubble('あなた', text);
  chatInput.value = '';
}

// ── Hearts (Like) ──────────────────────────────────────────
const HEART_EMOJIS = ['❤️', '💖', '✨', '💜', '🔥', '💕'];
likeBtn.addEventListener('click', () => {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => spawnHeart(), i * 120);
  }
});

function spawnHeart() {
  const heart = document.createElement('div');
  heart.className = 'float-heart';
  heart.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  heart.style.left = Math.random() * 30 + 'px';
  heart.style.animationDuration = (2 + Math.random()) + 's';
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 3000);
}

// ── Gift System ────────────────────────────────────────────
function renderGifts() {
  giftGrid.innerHTML = '';
  GIFTS.forEach(g => {
    const item = document.createElement('div');
    item.className = 'gift-item';
    item.innerHTML = `<span class="gift-emoji">${g.emoji}</span><span class="gift-price">🪙 ${g.price}</span>`;
    item.addEventListener('click', () => sendGift(g));
    giftGrid.appendChild(item);
  });
}

giftBtn.addEventListener('click', () => giftPanel.classList.toggle('hidden'));
closeGiftPanel.addEventListener('click', () => giftPanel.classList.add('hidden'));

function sendGift(gift) {
  giftPanel.classList.add('hidden');

  // Update coin balance
  const coinEl = $('#coin-count');
  let coins = parseInt(coinEl.textContent);
  if (coins < gift.price) return;
  coins -= gift.price;
  coinEl.textContent = coins;

  // Floating gift notification
  const notif = document.createElement('div');
  notif.className = 'gift-float';
  notif.style.bottom = (120 + Math.random() * 100) + 'px';
  notif.innerHTML = `
    <img src="${liveHostPic.src}" alt="">
    <div class="gift-text">あなた が <strong>${gift.name}</strong> を送りました</div>
    <span class="gift-emoji">${gift.emoji}</span>
  `;
  giftOverlay.appendChild(notif);
  setTimeout(() => notif.remove(), 3500);

  // Also add chat bubble
  addChatBubble('あなた', `${gift.emoji} ${gift.name} を送りました！`);
}

// ── Initialize ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderStories();
  renderRankings();
  renderFeed('all');
  renderDiscover();
  renderGifts();
});
