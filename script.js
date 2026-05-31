const CONFIG = {
  brandName: "Female EMX",
  creatorCode: "MEDUSAA",
  tiktokUrl: "https://www.tiktok.com/@ttfemale_emx",
  emxTweaksUrl: "https://efect-macros-x-tweaks.vercel.app/",
  fortniteMapsUrl: "https://fortnite.gg/creator/medusaa",

  supabaseUrl: "https://iosbgyokkfoaaawwqqqb.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvc2JneW9ra2ZvYWFhd3dxcXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTMxMzIsImV4cCI6MjA5NTc2OTEzMn0.6xBFuHlvrhXyss9xzKCVH5CmrYdopSRAw0JoVbQ5mDE"
};

/* ULTRA STABLE MODE */
document.documentElement.classList.add("ultra-stable");
document.body.classList.add("ultra-stable");

/* SPCK preview uses demo mode; Vercel uses public Supabase mode */
const IS_LOCAL_PREVIEW = (() => {
  const host = location.hostname.toLowerCase();

  return (
    location.protocol === "file:" ||
    host === "" ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.includes("spck")
  );
})();

/* Remove old service worker/cache one time so her phone stops opening old crashing files */
(function clearOldCacheOnce() {
  const cacheFlag = "femaleEmxClearedOldCacheV7";

  if (localStorage.getItem(cacheFlag) === "yes") return;
  localStorage.setItem(cacheFlag, "yes");

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    }).catch(() => {});
  }

  if ("caches" in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    }).catch(() => {});
  }
})();

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

let hype = Number(localStorage.getItem("femaleEmxHype") || 42);
let logoTapCount = 0;
let soundOn = false;

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

function finishLoading() {
  document.body.classList.add("loaded");
}

window.addEventListener("load", () => {
  setTimeout(finishLoading, 450);
});

setTimeout(finishLoading, 1200);

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1700);
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
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
    } catch (fallbackError) {
      showToast("Copy failed. Hold and copy manually.");
    }

    temp.remove();
  }
}

function setupExternalLinks() {
  const links = document.querySelectorAll(".external-link");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const url = link.dataset.url || link.href;
      showToast("Opening link...");

      setTimeout(() => {
        window.location.href = url;
      }, 80);
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

  challengeText.textContent = challenges[Math.floor(Math.random() * challenges.length)];
  showToast("New challenge loaded ⚡");
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
    document.body.classList.add("secret-mode");
    showToast("MAX EMX ENERGY ⚡");
  } else {
    showToast("Hype boosted to " + hype + "%");
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
    } catch (error) {}
  } else {
    copyText(window.location.href, "Hub link copied.");
  }
}

function toggleSound() {
  soundOn = !soundOn;

  if (soundToggle) {
    soundToggle.textContent = soundOn ? "🔊" : "🔇";
  }

  showToast(soundOn ? "Sound FX on" : "Sound FX off");
}

function unlockSecretMode() {
  document.body.classList.add("secret-mode");
  hype = 100;
  updateHype();
  showToast("Secret neon mode unlocked 💜⚡");
}

/* Button setup */
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
    logoTapCount++;

    if (logoTapCount >= 5) {
      logoTapCount = 0;
      unlockSecretMode();
    } else {
      showToast("Secret mode: " + logoTapCount + "/5 taps");
    }
  });
}

/* PUBLIC / DEMO COMMENTS - STABLE VERSION WITH OWN DELETE + REPORT */
(function setupComments() {
  const convoForm = document.getElementById("convoForm");
  const convoUsername = document.getElementById("convoUsername");
  const convoMessage = document.getElementById("convoMessage");
  const convoCharCount = document.getElementById("convoCharCount");
  const convoMode = document.getElementById("convoMode");
  const convoFeed = document.getElementById("convoFeed");
  const convoStats = document.getElementById("convoStats");
  const refreshConvoBtn = document.getElementById("refreshConvoBtn");
  const convoSort = document.getElementById("convoSort");
  const vibeButtons = document.querySelectorAll(".vibe-btn");
  const topicButtons = document.querySelectorAll(".topic-chip");
  const themeButtons = document.querySelectorAll(".theme-chip");
  const quickButtons = document.querySelectorAll(".quick-btn");

  if (!convoForm || !convoFeed) return;

  let db = null;
  let online = false;
  let canPost = false;
  let loading = false;
  let currentUser = null;
  let selectedVibe = "💜";
  let selectedTopic = "shoutout";
  let selectedTheme = "neon";
  let feedCache = [];

  const topics = {
    shoutout: "💜 Shoutout",
    map: "🎮 Map Review",
    clip: "🔥 Clip Idea",
    question: "⚡ Question",
    duo: "👥 Duo",
    wmoment: "🏆 W Moment"
  };

  const reactions = [
    { key: "hearts", icon: "💜" },
    { key: "bolts", icon: "⚡" },
    { key: "fires", icon: "🔥" },
    { key: "crowns", icon: "👑" },
    { key: "wins", icon: "W" },
    { key: "controllers", icon: "🎮" }
  ];

  function configured() {
    if (IS_LOCAL_PREVIEW) return false;

    return (
      CONFIG.supabaseUrl.startsWith("https://") &&
      CONFIG.supabaseAnonKey.length > 40 &&
      !CONFIG.supabaseAnonKey.includes("PASTE_YOUR") &&
      window.supabase
    );
  }

  async function start() {
    if (configured()) {
      db = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false
        }
      });

      online = true;
      await ensureAnonymousUser();

      if (convoMode) {
        convoMode.textContent = canPost ? "Comments online" : "Comments online · sign-in needed";
      }
    } else {
      online = false;
      canPost = true;

      if (convoMode) convoMode.textContent = "Demo comments";
    }

    loadComments();
  }

  async function ensureAnonymousUser() {
    canPost = false;
    currentUser = null;

    try {
      const sessionResult = await db.auth.getSession();
      const sessionUser = sessionResult?.data?.session?.user;

      if (sessionUser) {
        currentUser = sessionUser;
        canPost = true;
        return;
      }

      const signInResult = await db.auth.signInAnonymously();

      if (signInResult.error) {
        console.error("Anonymous sign-in error:", signInResult.error);
        showToast("Enable Anonymous Sign-Ins in Supabase Auth.");
        return;
      }

      currentUser = signInResult?.data?.user || null;
      canPost = !!currentUser;
    } catch (error) {
      console.error("Auth setup error:", error);
      showToast("Comments sign-in failed.");
    }
  }

  function makeId() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return "local-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  }

  function getLocalComments() {
    return JSON.parse(localStorage.getItem("femaleEmxStableComments") || "[]");
  }

  function saveLocalComments(items) {
    localStorage.setItem("femaleEmxStableComments", JSON.stringify(items.slice(0, 20)));
  }

  function cleanUsername(value) {
    let clean = value
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9_.@-]/g, "")
      .slice(0, 24);

    if (clean && !clean.startsWith("@")) {
      clean = "@" + clean;
    }

    return clean;
  }

  function cleanMessage(value) {
    return value.trim().replace(/\s+/g, " ").slice(0, 140);
  }

  function timeAgo(dateString) {
    const then = new Date(dateString).getTime();
    const diff = Math.max(0, Math.floor((Date.now() - then) / 1000));

    if (diff < 60) return "just now";
    if (diff < 3600) return Math.floor(diff / 60) + "m ago";
    if (diff < 86400) return Math.floor(diff / 3600) + "h ago";

    return Math.floor(diff / 86400) + "d ago";
  }

  function totalReactions(item) {
    return reactions.reduce((sum, reaction) => {
      return sum + Number(item[reaction.key] || 0);
    }, 0);
  }

  function updateCharCount() {
    if (!convoMessage || !convoCharCount) return;

    const count = convoMessage.value.length;
    convoCharCount.textContent = count + "/140";
    convoCharCount.style.color = count > 120 ? "#ff8cff" : "rgba(255,255,255,.48)";
  }

  function setStats(items) {
    if (!convoStats) return;

    const posts = items.length;
    const reactionCount = items.reduce((sum, item) => sum + totalReactions(item), 0);

    convoStats.textContent =
      posts + " comments • " +
      reactionCount + " reactions • " +
      (online ? "comments online" : "demo comments");
  }

  function hasReacted(id, key) {
    return localStorage.getItem("femaleEmxReacted:" + id + ":" + key) === "yes";
  }

  function setReacted(id, key) {
    localStorage.setItem("femaleEmxReacted:" + id + ":" + key, "yes");
  }

  function hasReported(id) {
    return localStorage.getItem("femaleEmxReported:" + id) === "yes";
  }

  function setReported(id) {
    localStorage.setItem("femaleEmxReported:" + id, "yes");
  }

  function ownsPost(item) {
    if (!item) return false;

    if (!online) {
      return item.owner_id === "local-owner";
    }

    return !!currentUser && item.owner_id === currentUser.id;
  }

  function sortItems(items) {
    const sorted = [...items];

    if (convoSort && convoSort.value === "top") {
      sorted.sort((a, b) => totalReactions(b) - totalReactions(a));
    } else {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return sorted;
  }

  function renderComments(items) {
    const safeItems = sortItems(items || []).slice(0, 12);
    feedCache = safeItems;

    convoFeed.textContent = "";
    setStats(safeItems);

    if (!safeItems.length) {
      const empty = document.createElement("div");
      empty.className = "wall-empty";
      empty.textContent = "No comments yet. Be the first fan.";
      convoFeed.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();

    safeItems.forEach((item) => {
      const post = document.createElement("div");
      post.className = "wall-post theme-" + (item.theme || "neon");

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

      if (ownsPost(item)) {
        const ownerTag = document.createElement("span");
        ownerTag.className = "owner-tag";
        ownerTag.textContent = "Your post";
        user.appendChild(ownerTag);
      }

      const topic = document.createElement("div");
      topic.className = "wall-topic";
      topic.textContent = topics[item.topic] || "💜 Shoutout";

      left.appendChild(user);
      left.appendChild(topic);

      const time = document.createElement("div");
      time.className = "wall-time";
      time.textContent = timeAgo(item.created_at);

      const message = document.createElement("div");
      message.className = "wall-message";
      message.textContent = item.message;

      const row = document.createElement("div");
      row.className = "reaction-row";

      reactions.forEach((reaction) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "react-btn";
        btn.dataset.id = item.id;
        btn.dataset.react = reaction.key;
        btn.textContent = reaction.icon + " " + Number(item[reaction.key] || 0);

        if (hasReacted(item.id, reaction.key)) {
          btn.classList.add("reacted");
        }

        row.appendChild(btn);
      });

      const actionRow = document.createElement("div");
      actionRow.className = "comment-actions";

      if (ownsPost(item)) {
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.deleteId = item.id;
        deleteBtn.textContent = "Delete my comment";
        actionRow.appendChild(deleteBtn);
      }

      const reportBtn = document.createElement("button");
      reportBtn.type = "button";
      reportBtn.className = "report-btn";
      reportBtn.dataset.reportId = item.id;
      reportBtn.textContent = hasReported(item.id) ? "Reported" : "Report";

      if (hasReported(item.id)) {
        reportBtn.classList.add("reported");
      }

      actionRow.appendChild(reportBtn);

      top.appendChild(left);
      top.appendChild(time);

      post.appendChild(top);
      post.appendChild(message);
      post.appendChild(row);
      post.appendChild(actionRow);

      frag.appendChild(post);
    });

    convoFeed.appendChild(frag);
  }

  async function loadComments() {
    if (loading || document.hidden) return;

    loading = true;

    if (refreshConvoBtn) refreshConvoBtn.disabled = true;
    if (convoMode) convoMode.textContent = online ? "Loading comments..." : "Demo comments";

    if (!online) {
      renderComments(getLocalComments());
      loading = false;
      if (refreshConvoBtn) refreshConvoBtn.disabled = false;
      return;
    }

    const { data, error } = await db
      .from("fan_wall")
      .select("id, owner_id, username, message, vibe, topic, theme, hearts, bolts, fires, crowns, wins, controllers, reports, hidden, created_at")
      .eq("hidden", false)
      .lt("reports", 3)
      .order("created_at", { ascending: false })
      .limit(12);

    loading = false;
    if (refreshConvoBtn) refreshConvoBtn.disabled = false;

    if (error) {
      console.error("Comments load error:", error);
      if (convoMode) convoMode.textContent = "Comments paused";
      showToast("Comments error. Run the new Supabase SQL.");
      renderComments([]);
      return;
    }

    if (convoMode) convoMode.textContent = canPost ? "Comments online" : "Comments online · sign-in needed";
    renderComments(data || []);
  }

  async function sendMessage(submitBtn) {
    const now = Date.now();
    const lastPost = Number(localStorage.getItem("femaleEmxLastPostTime") || 0);

    if (now - lastPost < 7000) {
      showToast("Wait a few seconds before posting again.");
      return;
    }

    const username = cleanUsername(convoUsername.value);
    const message = cleanMessage(convoMessage.value);

    if (username.length < 3) {
      showToast("Add a username first.");
      return;
    }

    if (!message) {
      showToast("Write a comment first.");
      return;
    }

    if (online && !canPost) {
      showToast("Enable Anonymous Sign-Ins in Supabase Auth first.");
      return;
    }

    if (submitBtn) submitBtn.disabled = true;

    const post = {
      id: makeId(),
      owner_id: online && currentUser ? currentUser.id : "local-owner",
      username,
      message,
      vibe: selectedVibe,
      topic: selectedTopic,
      theme: selectedTheme,
      hearts: 0,
      bolts: 0,
      fires: 0,
      crowns: 0,
      wins: 0,
      controllers: 0,
      reports: 0,
      hidden: false,
      created_at: new Date().toISOString()
    };

    localStorage.setItem("femaleEmxLastPostTime", String(now));
    convoUsername.value = username;

    if (!online) {
      const current = getLocalComments();
      current.unshift(post);
      saveLocalComments(current);

      convoMessage.value = "";
      updateCharCount();
      renderComments(current);
      showToast("Demo comment posted.");

      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    const { error } = await db
      .from("fan_wall")
      .insert({
        owner_id: currentUser.id,
        username,
        message,
        vibe: selectedVibe,
        topic: selectedTopic,
        theme: selectedTheme
      });

    if (submitBtn) submitBtn.disabled = false;

    if (error) {
      console.error("Comment post error:", error);
      showToast("Comment failed. Check Supabase Auth/SQL.");
      return;
    }

    convoMessage.value = "";
    updateCharCount();
    showToast("Comment posted 💜");
    loadComments();
  }

  async function react(id, key, button) {
    const item = feedCache.find((post) => String(post.id) === String(id));
    if (!item) return;

    if (hasReacted(id, key)) {
      showToast("Already reacted.");
      return;
    }

    setReacted(id, key);
    item[key] = Number(item[key] || 0) + 1;

    if (button) {
      button.classList.add("reacted");
      const reaction = reactions.find((r) => r.key === key);
      button.textContent = (reaction ? reaction.icon : "💜") + " " + item[key];
    }

    setStats(feedCache);

    if (!online) {
      saveLocalComments(feedCache);
      return;
    }

    const { error } = await db
      .from("fan_wall")
      .update({ [key]: item[key] })
      .eq("id", id);

    if (error) {
      console.error("Reaction error:", error);
      showToast("Reaction error.");
    }
  }

  async function reportComment(id, button) {
    const item = feedCache.find((post) => String(post.id) === String(id));
    if (!item) return;

    if (hasReported(id)) {
      showToast("Already reported.");
      return;
    }

    setReported(id);
    item.reports = Number(item.reports || 0) + 1;

    if (button) {
      button.classList.add("reported");
      button.textContent = "Reported";
    }

    showToast("Comment reported.");

    if (!online) {
      saveLocalComments(feedCache.filter((post) => Number(post.reports || 0) < 3));
      renderComments(getLocalComments());
      return;
    }

    const { error } = await db
      .from("fan_wall")
      .update({ reports: item.reports })
      .eq("id", id);

    if (error) {
      console.error("Report error:", error);
      showToast("Report error.");
      return;
    }

    if (item.reports >= 3) {
      showToast("Comment hidden after reports.");
      loadComments();
    }
  }

  async function deleteComment(id) {
    const item = feedCache.find((post) => String(post.id) === String(id));
    if (!item) return;

    if (!ownsPost(item)) {
      showToast("You can only delete your own comments.");
      return;
    }

    const confirmDelete = confirm("Delete your comment?");
    if (!confirmDelete) return;

    if (!online) {
      const updated = getLocalComments().filter((post) => String(post.id) !== String(id));
      saveLocalComments(updated);
      renderComments(updated);
      showToast("Comment deleted.");
      return;
    }

    const { error } = await db
      .from("fan_wall")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      showToast("Delete failed. Only the original device can delete it.");
      return;
    }

    showToast("Comment deleted.");
    loadComments();
  }

  vibeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedVibe = btn.dataset.vibe;

      vibeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      showToast("Vibe selected " + selectedVibe);
    });
  });

  topicButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedTopic = btn.dataset.topic;

      topicButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      showToast("Topic selected");
    });
  });

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedTheme = btn.dataset.theme;

      themeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      showToast("Card style selected");
    });
  });

  quickButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      convoMessage.value = btn.dataset.fill || "";
      updateCharCount();
      convoMessage.focus();
      showToast("Quick comment loaded");
    });
  });

  if (convoMessage) convoMessage.addEventListener("input", updateCharCount);

  if (convoSort) {
    convoSort.addEventListener("change", () => {
      renderComments(feedCache);
    });
  }

  convoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitBtn = convoForm.querySelector('button[type="submit"]');
    sendMessage(submitBtn);
  });

  if (refreshConvoBtn) {
    refreshConvoBtn.addEventListener("click", () => {
      loadComments();
      showToast("Comments refreshed.");
    });
  }

  convoFeed.addEventListener("click", (event) => {
    const reactBtn = event.target.closest("[data-react]");
    if (reactBtn) {
      react(reactBtn.dataset.id, reactBtn.dataset.react, reactBtn);
      return;
    }

    const reportBtn = event.target.closest("[data-report-id]");
    if (reportBtn) {
      reportComment(reportBtn.dataset.reportId, reportBtn);
      return;
    }

    const deleteBtn = event.target.closest("[data-delete-id]");
    if (deleteBtn) {
      deleteComment(deleteBtn.dataset.deleteId);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      loadComments();
    }
  });

  updateCharCount();
  start();
})();

setupExternalLinks();
setDailyChallenge();
updateHype();
