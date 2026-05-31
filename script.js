const CONFIG = {
  brandName: "Female EMX",
  creatorCode: "MEDUSAA",
  tiktokUrl: "https://www.tiktok.com/@ttfemale_emx",
  emxTweaksUrl: "https://efect-macros-x-tweaks.vercel.app/",
  fortniteMapsUrl: "https://fortnite.gg/creator/medusaa",

  supabaseUrl: "https://iosbgyokkfoaaawwqqqb.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvc2JneW9ra2ZvYWFhd3dxcXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTMxMzIsImV4cCI6MjA5NTc2OTEzMn0.6xBFuHlvrhXyss9xzKCVH5CmrYdopSRAw0JoVbQ5mDE"
};

const toast = document.getElementById("toast");
const creatorCodeText = document.getElementById("creatorCodeText");
const mapCreatorCode = document.getElementById("mapCreatorCode");
const copyCreatorBtn = document.getElementById("copyCreatorBtn");
const copyMapsBtn = document.getElementById("copyMapsBtn");
const shareBtn = document.getElementById("shareBtn");
const newChallengeBtn = document.getElementById("newChallengeBtn");
const challengeText = document.getElementById("challengeText");
const hypeFill = document.getElementById("hypeFill");
const hypeText = document.getElementById("hypeText");
const boostBtn = document.getElementById("boostBtn");
const logoTap = document.getElementById("logoTap");
const soundToggle = document.getElementById("soundToggle");

if (creatorCodeText) creatorCodeText.textContent = CONFIG.creatorCode;
if (mapCreatorCode) mapCreatorCode.textContent = CONFIG.creatorCode;

const challenges = [
  "Land hot, get 3 eliminations, and clip the best moment.",
  "Play her map and tag her with your best clip.",
  "Win one round using only green and purple weapons.",
  "Get a trickshot, emote, then post the clip.",
  "Drop your highest score on her map and send proof.",
  "No-build challenge: movement only, smart fights only.",
  "Use creator code " + CONFIG.creatorCode + " before playing.",
  "One life challenge: play safe, play smart, clutch up.",
  "Clip a funny fail and turn it into a TikTok.",
  "Duo challenge: protect your teammate for the whole match."
];

let hype = Number(localStorage.getItem("femaleEmxHype") || 42);
let logoTapCount = 0;
let soundOn = false;
let audioContext = null;

function finishLoading() {
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 1350);
}

window.addEventListener("load", finishLoading);
setTimeout(finishLoading, 2600);

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
    playBeep(680, 0.05);
  } catch (error) {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);
    temp.select();

    try {
      document.execCommand("copy");
      showToast(successMessage);
      playBeep(680, 0.05);
    } catch (fallbackError) {
      showToast("Copy failed. Hold text and copy manually.");
    }

    temp.remove();
  }
}

function setupExternalLinks() {
  const externalLinks = document.querySelectorAll(".external-link");

  externalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const url = link.dataset.url || link.href;

      showToast("Opening link...");

      setTimeout(() => {
        window.location.href = url;
      }, 120);
    });
  });
}

function setDailyChallenge() {
  if (!challengeText) return;

  const today = new Date();
  const seed = today.getFullYear() + today.getMonth() + today.getDate();
  challengeText.textContent = challenges[seed % challenges.length];
}

function randomChallenge() {
  if (!challengeText) return;

  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  challengeText.textContent = challenge;

  showToast("New EMX challenge loaded ⚡");
  playBeep(520, 0.06);
}

function updateHype() {
  if (!hypeFill || !hypeText) return;

  hype = Math.max(0, Math.min(100, hype));
  hypeFill.style.width = hype + "%";
  localStorage.setItem("femaleEmxHype", String(hype));

  if (hype >= 100) {
    hypeText.textContent = "MAX POWER. Female EMX is glowing.";
  } else if (hype >= 70) {
    hypeText.textContent = "Neon energy is getting crazy.";
  } else if (hype >= 40) {
    hypeText.textContent = "Good energy. Keep charging.";
  } else {
    hypeText.textContent = "Tap boost to power up the neon.";
  }
}

function boostHype() {
  hype += Math.floor(Math.random() * 13) + 8;

  if (hype >= 100) {
    hype = 100;
    showToast("MAX EMX ENERGY ⚡");
    document.body.classList.add("secret-mode");
    playBeep(780, 0.08);
  } else {
    showToast("Hype boosted to " + hype + "%");
    playBeep(620, 0.05);
  }

  updateHype();
}

async function shareHub() {
  const shareData = {
    title: "Female EMX",
    text: "Check out Female EMX TikTok, Fortnite maps, and creator hub.",
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      playBeep(700, 0.05);
    } catch (error) {
      // User cancelled share.
    }
  } else {
    copyText(window.location.href, "Hub link copied.");
  }
}

function makeSpark(x, y) {
  const colors = ["#62ff2e", "#c026ff", "#ffffff", "#b6ff3d"];

  for (let i = 0; i < 8; i++) {
    const spark = document.createElement("span");
    spark.className = "spark";

    const size = Math.floor(Math.random() * 7) + 5;
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.floor(Math.random() * 84) + 28;

    spark.style.left = x + "px";
    spark.style.top = y + "px";
    spark.style.width = size + "px";
    spark.style.height = size + "px";
    spark.style.background = colors[Math.floor(Math.random() * colors.length)];
    spark.style.setProperty("--x", Math.cos(angle) * distance + "px");
    spark.style.setProperty("--y", Math.sin(angle) * distance + "px");

    document.body.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 700);
  }
}

function toggleSound() {
  soundOn = !soundOn;
  document.body.classList.toggle("sound-on", soundOn);

  if (soundToggle) {
    soundToggle.textContent = soundOn ? "🔊" : "🔇";
  }

  showToast(soundOn ? "Sound FX on" : "Sound FX off");
  playBeep(500, 0.05);
}

function playBeep(frequency, duration) {
  if (!soundOn) return;

  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.02);
  } catch (error) {
    soundOn = false;
    document.body.classList.remove("sound-on");

    if (soundToggle) {
      soundToggle.textContent = "🔇";
    }
  }
}

function unlockSecretMode() {
  document.body.classList.add("secret-mode");
  showToast("Baby girl neon mode unlocked 💜⚡");

  hype = 100;
  updateHype();
  playBeep(880, 0.09);
}

function emojiBurst(x, y, emojis) {
  const emojiList = emojis && emojis.length ? emojis : ["💜", "💚", "⚡", "🎮", "🔥"];

  for (let i = 0; i < 10; i++) {
    const emoji = document.createElement("span");
    emoji.className = "emoji-pop";
    emoji.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.floor(Math.random() * 105) + 45;

    emoji.style.left = x + "px";
    emoji.style.top = y + "px";
    emoji.style.setProperty("--x", Math.cos(angle) * distance + "px");
    emoji.style.setProperty("--y", Math.sin(angle) * distance - 95 + "px");

    document.body.appendChild(emoji);

    setTimeout(() => {
      emoji.remove();
    }, 950);
  }
}

function emojiBurstFromElement(element, emojis) {
  if (!element) return;

  const rect = element.getBoundingClientRect();
  emojiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, emojis);
}

if (copyCreatorBtn) {
  copyCreatorBtn.addEventListener("click", () => {
    copyText(CONFIG.creatorCode, "Creator code copied: " + CONFIG.creatorCode);
  });
}

if (copyMapsBtn) {
  copyMapsBtn.addEventListener("click", () => {
    copyText(CONFIG.fortniteMapsUrl, "Fortnite map link copied.");
  });
}

if (shareBtn) shareBtn.addEventListener("click", shareHub);
if (newChallengeBtn) newChallengeBtn.addEventListener("click", randomChallenge);
if (boostBtn) boostBtn.addEventListener("click", boostHype);
if (soundToggle) soundToggle.addEventListener("click", toggleSound);

if (logoTap) {
  logoTap.addEventListener("click", () => {
    logoTapCount += 1;

    if (logoTapCount >= 5) {
      logoTapCount = 0;
      unlockSecretMode();
    } else {
      showToast("Secret mode: " + logoTapCount + "/5 taps");
    }
  });
}

document.addEventListener("pointerdown", (event) => {
  makeSpark(event.clientX, event.clientY);
});

/* PUBLIC / DEMO CONVO WALL */
(function () {
  const convoForm = document.getElementById("convoForm");
  const convoUsername = document.getElementById("convoUsername");
  const convoMessage = document.getElementById("convoMessage");
  const convoCharCount = document.getElementById("convoCharCount");
  const convoMode = document.getElementById("convoMode");
  const convoFeed = document.getElementById("convoFeed");
  const refreshConvoBtn = document.getElementById("refreshConvoBtn");
  const vibeButtons = document.querySelectorAll(".vibe-btn");
  const topicButtons = document.querySelectorAll(".topic-chip");
  const quickButtons = document.querySelectorAll(".quick-btn");

  if (!convoForm || !convoFeed) return;

  let fanDb = null;
  let wallOnline = false;
  let selectedVibe = "💜";
  let selectedTopic = "shoutout";
  let feedCache = [];

  const topicLabels = {
    shoutout: "💜 Shoutout",
    map: "🎮 Map Review",
    clip: "🔥 Clip Idea",
    question: "⚡ Question"
  };

  function configuredForPublicWall() {
    return (
      CONFIG.supabaseUrl.startsWith("https://") &&
      !CONFIG.supabaseUrl.includes("PASTE_YOUR") &&
      CONFIG.supabaseAnonKey.length > 40 &&
      !CONFIG.supabaseAnonKey.includes("PASTE_YOUR") &&
      window.supabase
    );
  }

  function createId() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return "local-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function startConvoWall() {
    if (configuredForPublicWall()) {
      fanDb = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
      wallOnline = true;

      if (convoMode) {
        convoMode.textContent = "Online public wall";
      }

      setupRealtime();
    } else {
      wallOnline = false;

      if (convoMode) {
        convoMode.textContent = "Demo mode: add Supabase keys for public comments";
      }
    }

    loadConvoWall();
  }

  function getLocalWall() {
    return JSON.parse(localStorage.getItem("femaleEmxConvoWallV3") || "[]");
  }

  function saveLocalWall(items) {
    localStorage.setItem("femaleEmxConvoWallV3", JSON.stringify(items));
  }

  function cleanUsername(username) {
    let clean = username
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9_.@-]/g, "")
      .slice(0, 24);

    if (clean && !clean.startsWith("@")) {
      clean = "@" + clean;
    }

    return clean;
  }

  function cleanMessage(message) {
    return message.trim().replace(/\s+/g, " ").slice(0, 140);
  }

  function timeAgo(dateString) {
    const then = new Date(dateString).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((now - then) / 1000));

    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";

    return Math.floor(diff / 86400) + "d ago";
  }

  function updateCharCount() {
    if (!convoMessage || !convoCharCount) return;

    const count = convoMessage.value.length;
    convoCharCount.textContent = count + "/140";
    convoCharCount.style.color = count > 120 ? "#ff8cff" : "rgba(255, 255, 255, 0.48)";
  }

  function renderConvoWall(items, highlightId) {
    feedCache = items || [];
    convoFeed.innerHTML = "";

    if (!items || items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "wall-empty";
      empty.textContent = "No messages yet. Be the first neon fan.";
      convoFeed.appendChild(empty);
      return;
    }

    items.forEach((item) => {
      const post = document.createElement("div");
      post.className = "wall-post";

      if (highlightId && String(item.id) === String(highlightId)) {
        post.classList.add("new-post");
      }

      const top = document.createElement("div");
      top.className = "wall-top";

      const left = document.createElement("div");
      left.className = "wall-left";

      const user = document.createElement("div");
      user.className = "wall-user";

      const badge = document.createElement("span");
      badge.className = "wall-badge";
      badge.textContent = item.vibe || "💜";

      const userText = document.createElement("span");
      userText.textContent = item.username || "@fan";

      user.appendChild(badge);
      user.appendChild(userText);

      const topic = document.createElement("div");
      topic.className = "wall-topic";
      topic.textContent = topicLabels[item.topic] || "💜 Shoutout";

      left.appendChild(user);
      left.appendChild(topic);

      const time = document.createElement("div");
      time.className = "wall-time";
      time.textContent = timeAgo(item.created_at);

      const message = document.createElement("div");
      message.className = "wall-message";
      message.textContent = item.message;

      const reactions = document.createElement("div");
      reactions.className = "reaction-row";

      const heartBtn = document.createElement("button");
      heartBtn.className = "react-btn";
      heartBtn.type = "button";
      heartBtn.dataset.react = "heart";
      heartBtn.dataset.id = item.id;
      heartBtn.textContent = "💜 " + (Number(item.hearts) || 0);

      const boltBtn = document.createElement("button");
      boltBtn.className = "react-btn";
      boltBtn.type = "button";
      boltBtn.dataset.react = "bolt";
      boltBtn.dataset.id = item.id;
      boltBtn.textContent = "⚡ " + (Number(item.bolts) || 0);

      reactions.appendChild(heartBtn);
      reactions.appendChild(boltBtn);

      top.appendChild(left);
      top.appendChild(time);

      post.appendChild(top);
      post.appendChild(message);
      post.appendChild(reactions);

      convoFeed.appendChild(post);
    });
  }

  async function loadConvoWall(silent) {
    if (!wallOnline) {
      renderConvoWall(getLocalWall());
      return;
    }

    if (!silent && convoMode) {
      convoMode.textContent = "Loading wall...";
    }

    const { data, error } = await fanDb
      .from("fan_wall")
      .select("id, username, message, vibe, topic, hearts, bolts, created_at")
      .order("created_at", { ascending: false })
      .limit(40);

    if (error) {
      if (convoMode) {
        convoMode.textContent = "Wall error";
      }

      showToast("Convo wall could not load. Check Supabase SQL.");
      renderConvoWall([]);
      console.error("Supabase load error:", error);
      return;
    }

    if (convoMode) {
      convoMode.textContent = "Online public wall";
    }

    renderConvoWall(data);
  }

  async function sendConvoMessage(submitButton) {
    const username = cleanUsername(convoUsername.value);
    const message = cleanMessage(convoMessage.value);

    if (username.length < 3) {
      showToast("Add a username first.");
      return;
    }

    if (message.length < 1) {
      showToast("Write a message first.");
      return;
    }

    const newPost = {
      id: createId(),
      username,
      message,
      vibe: selectedVibe,
      topic: selectedTopic,
      hearts: 0,
      bolts: 0,
      created_at: new Date().toISOString()
    };

    convoUsername.value = username;

    if (!wallOnline) {
      const current = getLocalWall();
      current.unshift(newPost);
      saveLocalWall(current.slice(0, 40));

      convoMessage.value = "";
      updateCharCount();

      renderConvoWall(current, newPost.id);
      showToast("Demo message posted. Add Supabase for public wall.");
      emojiBurstFromElement(submitButton || convoForm, [selectedVibe, "⚡", "💚"]);
      playBeep(740, 0.06);
      return;
    }

    const { error } = await fanDb
      .from("fan_wall")
      .insert({
        username,
        message,
        vibe: selectedVibe,
        topic: selectedTopic
      });

    if (error) {
      showToast("Message failed. Check Supabase table/policies.");
      console.error("Supabase insert error:", error);
      return;
    }

    convoMessage.value = "";
    updateCharCount();

    showToast("Message posted 💜⚡");
    emojiBurstFromElement(submitButton || convoForm, [selectedVibe, "⚡", "💚"]);
    playBeep(740, 0.06);

    loadConvoWall(true);
  }

  async function reactToPost(id, reaction, button) {
    const item = feedCache.find((post) => String(post.id) === String(id));
    if (!item) return;

    const column = reaction === "bolt" ? "bolts" : "hearts";
    item[column] = Number(item[column] || 0) + 1;

    renderConvoWall(feedCache, id);

    if (button) {
      emojiBurstFromElement(button, reaction === "bolt" ? ["⚡", "💚"] : ["💜", "💚"]);
    }

    playBeep(reaction === "bolt" ? 780 : 650, 0.045);

    if (!wallOnline) {
      saveLocalWall(feedCache);
      return;
    }

    const { error } = await fanDb
      .from("fan_wall")
      .update({
        [column]: item[column]
      })
      .eq("id", id);

    if (error) {
      showToast("Reaction showed, but database update failed.");
      console.error("Supabase reaction error:", error);
      return;
    }

    loadConvoWall(true);
  }

  function setupRealtime() {
    if (!wallOnline) return;

    fanDb
      .channel("female-emx-convo-wall")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "fan_wall"
        },
        () => {
          loadConvoWall(true);
        }
      )
      .subscribe();
  }

  vibeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedVibe = button.dataset.vibe;

      vibeButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      showToast("Vibe selected " + selectedVibe);
      emojiBurstFromElement(button, [selectedVibe, "⚡"]);
    });
  });

  topicButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedTopic = button.dataset.topic;

      topicButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      showToast("Topic selected");
    });
  });

  quickButtons.forEach((button) => {
    button.addEventListener("click", () => {
      convoMessage.value = button.dataset.fill || "";
      updateCharCount();
      convoMessage.focus();
      showToast("Quick message loaded");
    });
  });

  if (convoMessage) {
    convoMessage.addEventListener("input", updateCharCount);
  }

  convoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitButton = convoForm.querySelector('button[type="submit"]');
    sendConvoMessage(submitButton);
  });

  if (refreshConvoBtn) {
    refreshConvoBtn.addEventListener("click", () => {
      loadConvoWall();
      showToast("Wall refreshed.");
    });
  }

  convoFeed.addEventListener("click", (event) => {
    const button = event.target.closest("[data-react]");
    if (!button) return;

    reactToPost(button.dataset.id, button.dataset.react, button);
  });

  updateCharCount();
  startConvoWall();

  setInterval(() => {
    if (wallOnline) {
      loadConvoWall(true);
    }
  }, 20000);
})();

setupExternalLinks();
setDailyChallenge();
updateHype();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Optional PWA cache failed. Site still works.
    });
  });
}