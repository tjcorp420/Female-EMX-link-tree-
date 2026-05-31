const ADMIN_CONFIG = {
  supabaseUrl: "https://iosbgyokkfoaaawwqqqb.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvc2JneW9ra2ZvYWFhd3dxcXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxOTMxMzIsImV4cCI6MjA5NTc2OTEzMn0.6xBFuHlvrhXyss9xzKCVH5CmrYdopSRAw0JoVbQ5mDE",
  settingsId: "main"
};

const db = window.supabase.createClient(ADMIN_CONFIG.supabaseUrl, ADMIN_CONFIG.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

const $ = (id) => document.getElementById(id);

const loginCard = $("loginCard");
const lockedCard = $("lockedCard");
const adminPanel = $("adminPanel");
const adminToast = $("adminToast");
const emailInput = $("emailInput");
const sendLoginBtn = $("sendLoginBtn");
const signOutBtn = $("signOutBtn");
const signOutFromLockedBtn = $("signOutFromLockedBtn");
const adminEmail = $("adminEmail");
const lockedText = $("lockedText");

const brandNameInput = $("brandNameInput");
const creatorCodeInput = $("creatorCodeInput");
const statusBadgeInput = $("statusBadgeInput");
const backgroundModeInput = $("backgroundModeInput");
const primaryColorInput = $("primaryColorInput");
const secondaryColorInput = $("secondaryColorInput");
const taglineInput = $("taglineInput");
const pinnedMessageInput = $("pinnedMessageInput");
const tiktokUrlInput = $("tiktokUrlInput");
const emxTweaksUrlInput = $("emxTweaksUrlInput");
const fortniteMapsUrlInput = $("fortniteMapsUrlInput");
const featuredClipUrlInput = $("featuredClipUrlInput");
const questionOfWeekInput = $("questionOfWeekInput");
const commentsEnabledInput = $("commentsEnabledInput");
const reactionsEnabledInput = $("reactionsEnabledInput");
const saveSettingsBtn = $("saveSettingsBtn");

const refreshCommentsBtn = $("refreshCommentsBtn");
const commentFilter = $("commentFilter");
const commentList = $("commentList");

let currentUser = null;
let currentAdminEmail = "";

const DEFAULT_SETTINGS = {
  id: "main",
  brand_name: "Female EMX",
  creator_code: "MEDUSAA",
  tiktok_url: "https://www.tiktok.com/@ttfemale_emx",
  emx_tweaks_url: "https://efect-macros-x-tweaks.vercel.app/",
  fortnite_maps_url: "https://fortnite.gg/creator/medusaa",
  status_badge: "Official Creator Hub",
  tagline: "TikTok clips, Fortnite maps, creator code, EMX links, and neon gamer energy in one place.",
  pinned_message: "Use creator code <strong>MEDUSAA</strong>, play the maps, and drop a comment below 💜⚡",
  background_mode: "neon",
  primary_color: "#c026ff",
  secondary_color: "#62ff2e",
  comments_enabled: true,
  reactions_enabled: true,
  featured_clip_url: "",
  question_of_week: ""
};

function showToast(message) {
  if (!adminToast) return;
  adminToast.textContent = message;
  adminToast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => adminToast.classList.remove("show"), 1900);
}

function showOnly(view) {
  loginCard.classList.toggle("hidden", view !== "login");
  lockedCard.classList.toggle("hidden", view !== "locked");
  adminPanel.classList.toggle("hidden", view !== "admin");
}

function cleanUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) return trimmed;
  return "https://" + trimmed;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value || "");
  return div.innerHTML;
}

function timeAgo(dateString) {
  const then = new Date(dateString).getTime();
  const diff = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

async function sendLoginLink() {
  const email = emailInput.value.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    showToast("Enter your admin email first.");
    return;
  }

  sendLoginBtn.disabled = true;

  const { error } = await db.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + window.location.pathname
    }
  });

  sendLoginBtn.disabled = false;

  if (error) {
    console.error("Login link error:", error);
    showToast("Login link failed. Check Supabase Auth settings.");
    return;
  }

  showToast("Check your email for the login link.");
}

async function signOut() {
  await db.auth.signOut();
  currentUser = null;
  currentAdminEmail = "";
  showOnly("login");
  showToast("Signed out.");
}

async function checkAdminAccess(user) {
  const email = String(user?.email || "").toLowerCase();
  currentAdminEmail = email;

  if (!email) return false;

  const { data, error } = await db
    .from("admin_users")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Admin check error:", error);
    return false;
  }

  return !!data;
}

async function boot() {
  showOnly("login");

  const { data } = await db.auth.getSession();
  currentUser = data?.session?.user || null;

  if (!currentUser) {
    showOnly("login");
    return;
  }

  const allowed = await checkAdminAccess(currentUser);

  if (!allowed) {
    lockedText.textContent = "Signed in as " + (currentUser.email || "unknown") + ". Add this email to public.admin_users in Supabase, then reload.";
    showOnly("locked");
    return;
  }

  adminEmail.textContent = currentUser.email || "Admin";
  showOnly("admin");
  await loadSettings();
  await loadComments();
}

async function loadSettings() {
  const { data, error } = await db
    .from("site_settings")
    .select("*")
    .eq("id", ADMIN_CONFIG.settingsId)
    .maybeSingle();

  if (error) {
    console.error("Settings load error:", error);
    showToast("Settings could not load. Run supabase.sql.");
    fillSettings(DEFAULT_SETTINGS);
    return;
  }

  fillSettings({ ...DEFAULT_SETTINGS, ...(data || {}) });
}

function fillSettings(settings) {
  brandNameInput.value = settings.brand_name || DEFAULT_SETTINGS.brand_name;
  creatorCodeInput.value = settings.creator_code || DEFAULT_SETTINGS.creator_code;
  statusBadgeInput.value = settings.status_badge || DEFAULT_SETTINGS.status_badge;
  backgroundModeInput.value = settings.background_mode || DEFAULT_SETTINGS.background_mode;
  primaryColorInput.value = settings.primary_color || DEFAULT_SETTINGS.primary_color;
  secondaryColorInput.value = settings.secondary_color || DEFAULT_SETTINGS.secondary_color;
  taglineInput.value = settings.tagline || DEFAULT_SETTINGS.tagline;
  pinnedMessageInput.value = settings.pinned_message || DEFAULT_SETTINGS.pinned_message;
  tiktokUrlInput.value = settings.tiktok_url || DEFAULT_SETTINGS.tiktok_url;
  emxTweaksUrlInput.value = settings.emx_tweaks_url || DEFAULT_SETTINGS.emx_tweaks_url;
  fortniteMapsUrlInput.value = settings.fortnite_maps_url || DEFAULT_SETTINGS.fortnite_maps_url;
  featuredClipUrlInput.value = settings.featured_clip_url || "";
  questionOfWeekInput.value = settings.question_of_week || "";
  commentsEnabledInput.checked = settings.comments_enabled !== false;
  reactionsEnabledInput.checked = settings.reactions_enabled !== false;
}

async function saveSettings() {
  const settings = {
    id: ADMIN_CONFIG.settingsId,
    brand_name: brandNameInput.value.trim() || DEFAULT_SETTINGS.brand_name,
    creator_code: creatorCodeInput.value.trim() || DEFAULT_SETTINGS.creator_code,
    status_badge: statusBadgeInput.value.trim() || DEFAULT_SETTINGS.status_badge,
    background_mode: backgroundModeInput.value,
    primary_color: primaryColorInput.value || DEFAULT_SETTINGS.primary_color,
    secondary_color: secondaryColorInput.value || DEFAULT_SETTINGS.secondary_color,
    tagline: taglineInput.value.trim() || DEFAULT_SETTINGS.tagline,
    pinned_message: pinnedMessageInput.value.trim() || DEFAULT_SETTINGS.pinned_message,
    tiktok_url: cleanUrl(tiktokUrlInput.value) || DEFAULT_SETTINGS.tiktok_url,
    emx_tweaks_url: cleanUrl(emxTweaksUrlInput.value) || DEFAULT_SETTINGS.emx_tweaks_url,
    fortnite_maps_url: cleanUrl(fortniteMapsUrlInput.value) || DEFAULT_SETTINGS.fortnite_maps_url,
    featured_clip_url: cleanUrl(featuredClipUrlInput.value),
    question_of_week: questionOfWeekInput.value.trim(),
    comments_enabled: commentsEnabledInput.checked,
    reactions_enabled: reactionsEnabledInput.checked,
    updated_at: new Date().toISOString()
  };

  saveSettingsBtn.disabled = true;

  const { error } = await db
    .from("site_settings")
    .upsert(settings, { onConflict: "id" });

  saveSettingsBtn.disabled = false;

  if (error) {
    console.error("Settings save error:", error);
    showToast("Save failed. Confirm your email is in admin_users.");
    return;
  }

  showToast("Settings saved. Public site updates on refresh.");
}

async function loadComments() {
  commentList.innerHTML = '<div class="admin-comment">Loading comments...</div>';

  let query = db
    .from("fan_wall")
    .select("id, username, message, vibe, topic, theme, hearts, bolts, fires, crowns, wins, controllers, reports, hidden, created_at")
    .order("created_at", { ascending: false })
    .limit(60);

  const filter = commentFilter.value;
  if (filter === "reported") query = query.gt("reports", 0);
  if (filter === "hidden") query = query.eq("hidden", true);
  if (filter === "visible") query = query.eq("hidden", false).lt("reports", 3);

  const { data, error } = await query;

  if (error) {
    console.error("Comment load error:", error);
    commentList.innerHTML = '<div class="admin-comment">Could not load comments. Run supabase.sql and confirm admin access.</div>';
    return;
  }

  renderComments(data || []);
}

function renderComments(items) {
  commentList.textContent = "";

  if (!items.length) {
    commentList.innerHTML = '<div class="admin-comment">No comments found for this filter.</div>';
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "admin-comment" + (item.hidden ? " hidden-comment" : "");

    const reactionTotal =
      Number(item.hearts || 0) + Number(item.bolts || 0) + Number(item.fires || 0) +
      Number(item.crowns || 0) + Number(item.wins || 0) + Number(item.controllers || 0);

    card.innerHTML = `
      <div class="comment-top">
        <div class="comment-user">${escapeHtml(item.vibe || "💜")} ${escapeHtml(item.username || "@fan")}</div>
        <div class="comment-time">${timeAgo(item.created_at)}</div>
      </div>
      <div class="comment-message">${escapeHtml(item.message || "")}</div>
      <div class="comment-meta">
        ${escapeHtml(item.topic || "shoutout")} • ${escapeHtml(item.theme || "neon")} • ${reactionTotal} reactions • ${Number(item.reports || 0)} reports • ${item.hidden ? "hidden" : "visible"}
      </div>
      <div class="comment-actions">
        <button class="ghost-btn" type="button" data-pin="${item.id}">Pin as message</button>
        <button class="ghost-btn" type="button" data-hide="${item.id}">${item.hidden ? "Unhide" : "Hide"}</button>
        <button class="ghost-btn" type="button" data-reset="${item.id}">Reset reports</button>
        <button class="danger-btn" type="button" data-delete="${item.id}">Delete</button>
      </div>
    `;

    fragment.appendChild(card);
  });

  commentList.appendChild(fragment);
}

function findCachedComment(id) {
  const cards = [...commentList.querySelectorAll("[data-pin]")];
  const pinButton = cards.find((button) => button.dataset.pin === id);
  if (!pinButton) return null;

  const card = pinButton.closest(".admin-comment");
  if (!card) return null;

  const user = card.querySelector(".comment-user")?.textContent || "@fan";
  const message = card.querySelector(".comment-message")?.textContent || "";

  return { user, message };
}

async function pinComment(id) {
  const item = findCachedComment(id);
  if (!item) return;

  pinnedMessageInput.value = `<strong>${escapeHtml(item.user)}</strong>: ${escapeHtml(item.message)}`;
  await saveSettings();
}

async function toggleHidden(id, shouldHide) {
  const { error } = await db
    .from("fan_wall")
    .update({ hidden: shouldHide })
    .eq("id", id);

  if (error) {
    console.error("Hide update error:", error);
    showToast("Could not update comment.");
    return;
  }

  showToast(shouldHide ? "Comment hidden." : "Comment unhidden.");
  loadComments();
}

async function resetReports(id) {
  const { error } = await db
    .from("fan_wall")
    .update({ reports: 0 })
    .eq("id", id);

  if (error) {
    console.error("Reset reports error:", error);
    showToast("Could not reset reports.");
    return;
  }

  showToast("Reports reset.");
  loadComments();
}

async function deleteComment(id) {
  const ok = confirm("Delete this comment permanently?");
  if (!ok) return;

  const { error } = await db
    .from("fan_wall")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    showToast("Could not delete comment.");
    return;
  }

  showToast("Comment deleted.");
  loadComments();
}

sendLoginBtn.addEventListener("click", sendLoginLink);
signOutBtn.addEventListener("click", signOut);
signOutFromLockedBtn.addEventListener("click", signOut);
saveSettingsBtn.addEventListener("click", saveSettings);
refreshCommentsBtn.addEventListener("click", loadComments);
commentFilter.addEventListener("change", loadComments);

commentList.addEventListener("click", (event) => {
  const pin = event.target.closest("[data-pin]");
  const hide = event.target.closest("[data-hide]");
  const reset = event.target.closest("[data-reset]");
  const del = event.target.closest("[data-delete]");

  if (pin) {
    pinComment(pin.dataset.pin);
    return;
  }

  if (hide) {
    const card = hide.closest(".admin-comment");
    toggleHidden(hide.dataset.hide, !card.classList.contains("hidden-comment"));
    return;
  }

  if (reset) {
    resetReports(reset.dataset.reset);
    return;
  }

  if (del) {
    deleteComment(del.dataset.delete);
  }
});

window.addEventListener("load", boot);
