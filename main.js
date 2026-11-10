/* A Little Universe for You — no framework or backend needed. */
/* Personalize these two values before sending your gift. */
const BIRTHDAY = {
  recipientName: "teman baikku",
  senderName: "seorang teman"
};

const ART = {
  stars: {
    chapter: "PAINTING NO. 01 · THE SKY",
    title: "The Starry Dreams",
    image: "./assets/painted-sky.svg",
    alt: "Langit berbintang dengan bulan dan bukit watercolor",
    message: "Semoga kamu selalu punya keberanian untuk mengejar hal-hal yang membuat matamu berbinar. Tidak harus tahu semua jawabannya sekarang. Bahkan bintang pun butuh malam untuk terlihat."
  },
  garden: {
    chapter: "PAINTING NO. 02 · THE GARDEN",
    title: "The Secret Garden",
    image: "./assets/painted-garden.svg",
    alt: "Taman bunga watercolor yang hangat",
    message: "Semoga hidup memberimu banyak ruang untuk tumbuh, mencoba, gagal, lalu tumbuh lagi. Dan semoga di sela-sela semua kesibukan, kamu selalu punya waktu menikmati hal-hal sederhana."
  },
  moon: {
    chapter: "PAINTING NO. 03 · THE MOON",
    title: "The Gentle Moon",
    image: "./assets/painted-moon.svg",
    alt: "Bulan lembut keemasan di langit malam",
    message: "Seperti bulan yang punya fase, kamu tidak harus bersinar terang setiap hari. Ada keindahan dalam beristirahat, berubah, dan menjadi dirimu sendiri. Semoga kamu selalu ingat itu."
  }
};

const STARS = {
  courage: "Semoga kamu berani melangkah, bahkan saat jalannya belum terlihat jelas.",
  peace: "Semoga kamu menemukan tenang, di tengah dunia yang kadang terlalu ramai.",
  joy: "Semoga alasan kecil untuk tersenyum selalu datang di waktu yang tepat."
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (selector) => document.querySelector(selector);

// Personalization
document.querySelectorAll("[data-recipient]").forEach((el) => { el.textContent = BIRTHDAY.recipientName; });
document.querySelectorAll("[data-sender]").forEach((el) => { el.textContent = BIRTHDAY.senderName; });

// Animated starfields, with seeded positions for a consistent composition.
let seed = 10261110;
function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}
function fillStars(container, count) {
  if (!container) return;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    const size = random() * 2 + .7;
    star.className = "ambient-star";
    star.style.left = (random() * 100).toFixed(2) + "%";
    star.style.top = (random() * 100).toFixed(2) + "%";
    star.style.width = size.toFixed(1) + "px";
    star.style.height = size.toFixed(1) + "px";
    star.style.setProperty("--twinkle", (3 + random() * 5).toFixed(1) + "s");
    star.style.setProperty("--delay", (-random() * 8).toFixed(1) + "s");
    star.style.setProperty("--opacity", (.3 + random() * .55).toFixed(2));
    fragment.appendChild(star);
  }
  container.appendChild(fragment);
}
fillStars($("#hero-stars"), 85);
fillStars($("#constellation-stars"), 75);

// Scroll reading progress.
const scrollProgress = $("#scroll-progress");
let scrollQueued = false;
function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + "%";
  scrollQueued = false;
}
window.addEventListener("scroll", () => {
  if (!scrollQueued) {
    requestAnimationFrame(updateScrollProgress);
    scrollQueued = true;
  }
}, {passive: true});
updateScrollProgress();

// Reveal chapters only when visible; keep all content accessible without IntersectionObserver.
const reveals = [...document.querySelectorAll(".reveal")];
if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: .1, rootMargin: "0px 0px -25px 0px"});
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("visible"));
}

// Tiny parallax, never required for navigating the page.
const heroFrame = $("#hero-art-wrap");
if (heroFrame && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  const hero = $(".hero");
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
    if (heroFrame.classList.contains("visible")) {
      heroFrame.style.transform = "translate(" + (x * 11).toFixed(1) + "px," + (y * 11).toFixed(1) + "px)";
    }
  }, {passive:true});
  hero.addEventListener("pointerleave", () => { heroFrame.style.transform = ""; });
}

// Gallery notes.
const artDialog = $("#art-dialog");
function openPainting(key) {
  const art = ART[key];
  if (!art || !artDialog) return;
  $("#dialog-image").src = art.image;
  $("#dialog-image").alt = art.alt;
  $("#dialog-chapter").textContent = art.chapter;
  $("#dialog-title").textContent = art.title;
  $("#dialog-message").textContent = art.message;
  if (typeof artDialog.showModal === "function") artDialog.showModal();
}
document.querySelectorAll("[data-art]").forEach((button) => {
  button.addEventListener("click", () => { openPainting(button.dataset.art); playChime(); });
});
if (artDialog) {
  artDialog.addEventListener("click", (event) => {
    if (event.target === artDialog) artDialog.close();
  });
}

// Constellation memory lives only during this visit.
const visitedStars = new Set();
document.querySelectorAll("[data-star]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.star;
    if (!STARS[key]) return;
    visitedStars.add(key);
    button.classList.add("visited");
    $("#star-note-text").textContent = STARS[key];
    $("#star-counter").textContent = visitedStars.size + " OF 3 STARS DISCOVERED";
    playChime();
  });
});

// Unfold the letter.
$("#open-letter").addEventListener("click", () => {
  const envelope = $("#letter-envelope");
  envelope.classList.add("opened");
  $("#letter-hidden").setAttribute("aria-hidden", "false");
  $("#open-letter").disabled = true;
  const greeting = $(".letter-greeting");
  greeting.setAttribute("tabindex", "-1");
  window.setTimeout(() => greeting.focus({preventScroll:true}), reduceMotion ? 0 : 500);
  playChime();
});

// Wish sky. No account, database, or server: browser-local storage only.
const wishForm = $("#wish-form");
const wishInput = $("#wish-input");
const wishFeedback = $("#wish-feedback");
const storageKey = "a-little-universe-wish";
try {
  const existing = localStorage.getItem(storageKey);
  if (existing) {
    wishInput.value = existing;
    wishFeedback.textContent = "Harapanmu masih tersimpan di browser ini. Kamu boleh mengubah dan mengirimnya lagi.";
  }
} catch (_) { /* Private browsing may block storage. The animation still works. */ }
function releaseWish() {
  const field = $("#wish-particles");
  for (let i = 0; i < (reduceMotion ? 1 : 19); i++) {
    const star = document.createElement("span");
    star.className = "flying-wish";
    star.textContent = i % 3 === 0 ? "✧" : "✦";
    const x = Math.round((random() - .5) * 360);
    star.style.left = "calc(50% + " + x + "px)";
    star.style.fontSize = (14 + random() * 22) + "px";
    star.style.setProperty("--drift", Math.round((random() - .5) * 220) + "px");
    star.style.animationDelay = (random() * 1.05).toFixed(2) + "s";
    field.appendChild(star);
    window.setTimeout(() => star.remove(), 4400);
  }
}
wishForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = wishInput.value.trim();
  if (!text) return;
  try {
    localStorage.setItem(storageKey, text);
    wishFeedback.textContent = "Harapanmu sudah terbang ke langit ✦ dan tersimpan di browser ini.";
  } catch (_) {
    wishFeedback.textContent = "Harapanmu sudah terbang ke langit ✦ (penyimpanan browser sedang tidak tersedia).";
  }
  releaseWish();
  playChime();
});

// Save the final painting to a PNG, drawn in the browser without uploading anything.
$("#download-art").addEventListener("click", async () => {
  const button = $("#download-art");
  const status = $("#download-status");
  button.disabled = true;
  status.textContent = "Menyiapkan lukisan...";
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    const painting = new Image();
    const imageLoaded = new Promise((resolve, reject) => {
      painting.onload = resolve;
      painting.onerror = reject;
    });
    painting.src = new URL("./assets/painted-sky.svg", document.baseURI).href;
    await imageLoaded;

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1500;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(painting, 0, 0, canvas.width, canvas.height);
    const shade = ctx.createLinearGradient(0, 0, 0, canvas.height);
    shade.addColorStop(0, "rgba(10,20,48,.12)");
    shade.addColorStop(.40, "rgba(10,20,48,.15)");
    shade.addColorStop(1, "rgba(7,14,37,.90)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.fillStyle = "#eddfc4";
    ctx.font = "600 23px 'DM Sans', sans-serif";
    ctx.fillText("A LITTLE UNIVERSE  ✦  NOVEMBER 10", 600, 116);
    ctx.fillStyle = "#fbf2df";
    ctx.shadowColor = "#101b36";
    ctx.shadowBlur = 22;
    ctx.font = "italic 91px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText("A little universe,", 600, 1150);
    ctx.fillText("just for you.", 600, 1240);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#efd6a8";
    ctx.font = "500 25px 'DM Sans', sans-serif";
    const recipient = BIRTHDAY.recipientName;
    const message = "Selamat ulang tahun, " + recipient + "!";
    if (ctx.measureText(message).width > 1050) ctx.font = "500 19px 'DM Sans', sans-serif";
    ctx.fillText(message, 600, 1322);
    ctx.font = "italic 28px 'Cormorant Garamond', Georgia, serif";
    ctx.fillStyle = "#f4ebda";
    ctx.fillText("May your days be filled with little wonders.", 600, 1382);

    const download = document.createElement("a");
    download.download = "a-little-universe-for-you.png";
    download.href = canvas.toDataURL("image/png");
    document.body.appendChild(download);
    download.click();
    download.remove();
    status.textContent = "Lukisannya berhasil disiapkan. Selamat ulang tahun ✦";
  } catch (error) {
    console.error("Painting download:", error);
    status.textContent = "Belum bisa menyimpan gambar. Coba buka melalui GitHub Pages dan ulangi.";
  } finally {
    button.disabled = false;
  }
});

// Optional synthesised ambient pad (off until user explicitly chooses sound).
let audioContext = null;
let ambientGain = null;
let ambientOscillators = [];
let soundEnabled = false;
const soundButton = $("#sound-toggle");
const AudioConstructor = window.AudioContext || window.webkitAudioContext;

async function startAmbience() {
  if (!AudioConstructor) {
    $("#sound-label").textContent = "unavailable";
    soundButton.disabled = true;
    return;
  }
  if (!audioContext) {
    audioContext = new AudioConstructor();
    ambientGain = audioContext.createGain();
    ambientGain.gain.value = 0;
    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 750;
    ambientGain.connect(filter);
    filter.connect(audioContext.destination);
    [130.81, 196, 261.63, 329.63].forEach((hz, index) => {
      const osc = audioContext.createOscillator();
      osc.type = "sine";
      osc.frequency.value = hz;
      osc.detune.value = index % 2 === 0 ? -3 : 3;
      osc.connect(ambientGain);
      osc.start();
      ambientOscillators.push(osc);
    });
  }
  await audioContext.resume();
  soundEnabled = true;
  ambientGain.gain.setTargetAtTime(.009, audioContext.currentTime, 2);
  soundButton.setAttribute("aria-pressed", "true");
  soundButton.setAttribute("aria-label", "Matikan suara ambience");
  $("#sound-label").textContent = "sound on";
}
function stopAmbience() {
  if (ambientGain && audioContext) ambientGain.gain.setTargetAtTime(0, audioContext.currentTime, .25);
  soundEnabled = false;
  soundButton.setAttribute("aria-pressed", "false");
  soundButton.setAttribute("aria-label", "Nyalakan suara ambience");
  $("#sound-label").textContent = "sound off";
}
function playChime() {
  if (!soundEnabled || !audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(659.25, now);
  oscillator.frequency.exponentialRampToValueAtTime(880, now + .35);
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.exponentialRampToValueAtTime(.015, now + .025);
  gain.gain.exponentialRampToValueAtTime(.0001, now + 1.2);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 1.25);
}
soundButton.addEventListener("click", async () => {
  if (soundEnabled) stopAmbience();
  else {
    try { await startAmbience(); }
    catch (error) {
      console.error("Audio unavailable:", error);
      $("#sound-label").textContent = "unavailable";
      soundButton.disabled = true;
    }
  }
});
document.addEventListener("visibilitychange", () => {
  if (ambientGain && audioContext) {
    ambientGain.gain.setTargetAtTime(document.hidden ? 0 : (soundEnabled ? .009 : 0), audioContext.currentTime, .2);
  }
});
