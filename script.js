// ==== CONFIG (edit these) ====
const SERVER_IP = "Play.OceanNetworkMC.com";
const DISCORD_INVITE = "https://discord.gg/OceanMC"; // <-- replace
const STORE_URL = "https://OceanNetworkMC.craftingstore.net";
const DISCORD_SERVER_ID = "1455570357476921598";
const DISCORD_WIDGET_API = `https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`;       // <-- replace

// Optional: a public status API. This one uses mcsrvstat.us (no key needed).
// It may not work for every setup; if it fails, the site still works fine.
const STATUS_API = `https://api.mcsrvstat.us/2/${encodeURIComponent(SERVER_IP)}`;

// ==== DOM ====
const toast = document.getElementById("toast");
const ipText = document.getElementById("ipText");

const copyBtns = [
  document.getElementById("copyIpBtn"),
  document.getElementById("copyIpBtn2"),
  document.getElementById("copyIpBtn3"),
  document.getElementById("copyIpBtn4")
].filter(Boolean);

const discordBtns = [
  document.getElementById("discordBtn"),
  document.getElementById("discordBtn2"),
  document.getElementById("discordBtn3")
].filter(Boolean);

const storeBtn = document.getElementById("storeBtn");
const themeBtn = document.getElementById("themeBtn");

const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const playersText = document.getElementById("playersText");
const checkStatusBtn = document.getElementById("checkStatusBtn");


const sbDot = document.getElementById("sbDot");
const sbText = document.getElementById("sbText");
const sbPlayers = document.getElementById("sbPlayers");
const sbIp = document.getElementById("sbIp");
const sbRefresh = document.getElementById("sbRefresh");

const playersOnlineBig = document.getElementById("playersOnlineBig");
const discordOnlineBig = document.getElementById("discordOnlineBig");
const discordMembersSmall = document.getElementById("discordMembersSmall");
const serverIpText = document.getElementById("serverIpText");
const discordFooterLink = document.getElementById("discordFooterLink");
const yearEl = document.getElementById("year");
const discordChannels = document.getElementById("discordChannels");
const discordUsers = document.getElementById("discordUsers");
const discordOnlineSmall = document.getElementById("discordOnlineSmall");




// ==== INIT ====
if (ipText) ipText.textContent = SERVER_IP;
if (sbIp) sbIp.textContent = SERVER_IP;
if (serverIpText) serverIpText.textContent = SERVER_IP;
discordBtns.forEach(a => a.href = DISCORD_INVITE);
if (discordFooterLink) discordFooterLink.href = DISCORD_INVITE;
if (storeBtn) storeBtn.href = STORE_URL;

// Theme: remember preference
const savedTheme = localStorage.getItem("oceanmc_theme");
if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon();

themeBtn?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "" : "light";
  if (next) document.documentElement.setAttribute("data-theme", next);
  else document.documentElement.removeAttribute("data-theme");
  localStorage.setItem("oceanmc_theme", next || "");
  updateThemeIcon();
  showToast(`Theme: ${next === "light" ? "Light" : "Ocean Dark"}`);
});

function updateThemeIcon(){
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  if (themeBtn) themeBtn.textContent = isLight ? "☼" : "☾";
}

// Copy IP
copyBtns.forEach(btn => {
  btn.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(SERVER_IP);
      showToast("Copied IP to clipboard!");
    }catch{
      // fallback
      const t = document.createElement("textarea");
      t.value = SERVER_IP;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
      showToast("Copied IP!");
    }
  });
});

// Mobile menu
burger?.addEventListener("click", () => {
  mobileMenu.classList.toggle("show");
});

// Close mobile menu when clicking a link
mobileMenu?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => mobileMenu.classList.remove("show"));
});

// Status check
checkStatusBtn?.addEventListener("click", checkServerStatus);

async function checkServerStatus(){
  setStatus("Checking…", "gray", "—");
  try{
    const res = await fetch(STATUS_API, { cache: "no-store" });
    const data = await res.json();

    if (data?.online){
      const onlineCount = data?.players?.online ?? "Online";
      const maxCount = data?.players?.max ?? "";
      const players = maxCount ? `${onlineCount}/${maxCount}` : `${onlineCount}`;
      setStatus("Online", "green", players);
      showToast("Server is online!");
    } else {
      setStatus("Offline", "red", "0");
      showToast("Server appears offline.");
    }
  }catch(e){
    setStatus("Unavailable", "gray", "—");
    showToast("Status check blocked or unavailable.");
  }
}

function setStatus(text, color, players){
  if (statusText) statusText.textContent = `Status: ${text}`;
  if (playersText) playersText.textContent = players;
  if (sbText) sbText.textContent = text;
  if (sbPlayers) sbPlayers.textContent = players;
  if (playersOnlineBig) playersOnlineBig.textContent = players;

  if (sbDot){
    sbDot.style.background = color === "green" ? "#35ff8b"
      : color === "red" ? "#ff4d6d"
      : "#888";
    sbDot.style.boxShadow = color === "green" ? "0 0 18px rgba(53,255,139,.35)"
      : color === "red" ? "0 0 18px rgba(255,77,109,.35)"
      : "none";
  }

  if (statusDot){
    statusDot.style.background = color === "green" ? "#35ff8b"
      : color === "red" ? "#ff4d6d"
      : "#888";
    statusDot.style.boxShadow = color === "green" ? "0 0 18px rgba(53,255,139,.35)"
      : color === "red" ? "0 0 18px rgba(255,77,109,.35)"
      : "none";
  }
}

// Toast
let toastTimer;
function showToast(msg){
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1700);
}


// Status bar refresh
sbRefresh?.addEventListener("click", checkServerStatus);

// Auto-check once on page load (nice for the status bar)
window.addEventListener("load", () => {
  // slight delay so UI renders first
  setTimeout(() => checkServerStatus(), 250);
});


// Sync hero stats
const hsPlayers = document.getElementById("hsPlayers");
const hsDiscord = document.getElementById("hsDiscord");
const dsOnline = document.getElementById("dsOnline");

// Fake discord count for now (replace with real API later)
const DISCORD_ONLINE_FAKE = 340;

if (hsDiscord) hsDiscord.textContent = DISCORD_ONLINE_FAKE;
if (dsOnline) dsOnline.textContent = DISCORD_ONLINE_FAKE;

// Hook into existing status updates
const _oldSetStatus = setStatus;
setStatus = function(text, color, players){
  _oldSetStatus(text, color, players);
  if (hsPlayers) hsPlayers.textContent = players;
}


// Footer year
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Discord counts (placeholder - requires a server widget API to be accurate)
if (discordOnlineBig) discordOnlineBig.textContent = "Discord";
if (discordMembersSmall) discordMembersSmall.textContent = "—";


// ===== Discord Widget (requires Server Settings > Widget > Enable Server Widget) =====
async function refreshDiscordWidget(){
  // If widget isn't enabled, this endpoint will fail.
  try{
    const res = await fetch(DISCORD_WIDGET_API, { cache: "no-store" });
    if (!res.ok) throw new Error("Widget not enabled");
    const data = await res.json();

    // Member counts
    // 'presence_count' is online count for the widget
    const online = data?.presence_count ?? null;
    const members = data?.members?.length ?? null;

    if (discordOnlineBig) discordOnlineBig.textContent = online ?? "—";
    if (discordOnlineSmall) discordOnlineSmall.textContent = online ?? "—";
    if (discordMembersSmall) discordMembersSmall.textContent = members ?? "—";

    // Channels (voice + stage shown in widget)
    if (discordChannels){
      discordChannels.innerHTML = "";
      const chans = Array.isArray(data?.channels) ? data.channels.slice(0, 8) : [];
      if (chans.length === 0){
        const li = document.createElement("li");
        li.innerHTML = '<span class="dotc"></span> No channels listed';
        discordChannels.appendChild(li);
      } else {
        for (const ch of chans){
          const li = document.createElement("li");
          li.innerHTML = `<span class="dotc"></span> ${escapeHtml(ch.name)}${ch.position != null ? "" : ""}`;
          discordChannels.appendChild(li);
        }
      }
    }

    // Online members list
    if (discordUsers){
      discordUsers.innerHTML = "";
      const users = Array.isArray(data?.members) ? data.members.slice(0, 10) : [];
      if (users.length === 0){
        const li = document.createElement("li");
        li.innerHTML = '<span class="userdot"></span> No members listed';
        discordUsers.appendChild(li);
      } else {
        for (const m of users){
          const li = document.createElement("li");
          const name = m?.nick || m?.username || "member";
          li.innerHTML = `<span class="userdot"></span> ${escapeHtml(name)}`;
          discordUsers.appendChild(li);
        }
      }
    }
  }catch(e){
    // Fallback if widget not enabled or blocked by browser/extensions
    if (discordOnlineBig) discordOnlineBig.textContent = "—";
    if (discordOnlineSmall) discordOnlineSmall.textContent = "—";
    if (discordMembersSmall) discordMembersSmall.textContent = "—";
    // Keep existing placeholder lists if any
  }
}

// Tiny helper to avoid injecting HTML
function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}


// ===== Robust init (works even when opened locally) =====
function initOceanSite(){
  try{
    // If opened from file://, show the note
    const fileNotice = document.getElementById("fileNotice");
    if (location.protocol === "file:" && fileNotice){
      fileNotice.style.display = "block";
    }

    // Kick off checks (don't rely only on window load)
    checkServerStatus();
    refreshDiscordWidget?.();
  }catch(e){
    // swallow
  }
}
initOceanSite();

// Refresh both on statusbar refresh
sbRefresh?.addEventListener("click", refreshDiscordWidget);
