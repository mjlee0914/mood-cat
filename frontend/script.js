// =====================================================================
// ~*~ MOOD CAT ~*~
// 흐름: ①② 랜딩 = 춤추는 고양이 + CLICK HERE TO ENTER + 노트북 고양이 말풍선(대사)
//        → ENTER: 그 자리에 [NAH I'M OUT] + [구라치는 yeah let's dig in] + 쿠키 알림창
//        ├─ yeah let's dig in → ③ 무드 검색
//        └─ NAH I'M OUT (3번 도망) → ④ "WHERE DO YOU THINK YOU'RE GOING?" → 결국 ③
// 언어: 영어 / 한국어 (맨 위에서 선택, 처음엔 브라우저 언어로 자동)
// =====================================================================

// ===== BE 주소 =====
// 내 컴퓨터에서 열었으면 로컬 서버, 아니면(GitHub Pages) 배포된 서버로 요청
const API_BASE = ["localhost", "127.0.0.1"].includes(location.hostname)
  ? "http://127.0.0.1:8000"
  : "https://mood-cat-api.onrender.com"; // TODO: Render 배포 후 실제 주소로 바꾸기

const MOOD_EMOJI = {
  go_home: "🏠", poop: "💩", hungry: "🍙", sleepy: "😴",
  angry: "😾", sad: "😿", anxious: "🙀", hurt: "💔",
  embarrassed: "😳", happy: "😸", neutral: "🐱",
};

// 컴퓨터 설정에서 "동작 줄이기"를 켠 사람에게는 움직이는 효과를 끄기
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (selector) => document.querySelector(selector);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomBetween = (min, max) => min + Math.random() * (max - min);


// =====================================================================
// 번역 사전 (영어 / 한국어)
// - HTML의 data-i18n="키" 요소는 applyLanguage()가 글자를 바꿔 끼워요
// - 나머지(대사, 상태 메시지, 알림창...)는 JS에서 t("키")로 꺼내 써요
// - 글자 속 \n 은 줄바꿈 (CSS의 white-space: pre-line 덕분에 보여요)
// =====================================================================
const I18N = {
  en: {
    title: "Cat Meme Generator",
    enter: "CLICK HERE\nTO ENTER",
    soundHint: "🔊 turn your sound on",
    exitBtn: "NAH I'M OUT",
    digInBtn: "yeah let's dig in",
    cloud: "thx 4 ur\nattention",
    madeBy: "★ made by:",
    repoLink: "★ go to repo:",
    exitTitle: "WHERE DO YOU THINK\nYOU'RE GOING?",
    stayBtn: "ok ok i'll stay 😿",
    inputLabel: "How do you feel?",
    counterBefore: "You have been catified for",
    counterAfter: "seconds",
    copyright: "© 2007 Mood Cat. GIFs Powered by GIPHY. Cat memes belong to their original creators.",
    takeIt: "plz share w/ ur friends!!",

    lines: [
      "Hi, I'm an anonymous aspiring developer.",
      "I spent the weekend trying out what I learned at bootcamp on this mini project.",
      "Thank you for visiting this janky little website.",
    ],
    dodge: [
      "Nah nah nah. Not that one.",
      "Bro really tried it again.",
      "Aight fine. Go ahead. I dare you.",
    ],
    prefill: "delete this and type ur mood",
    examples: ["I totally bombed my exam :(", "I'm starving", "I want to go home", "I'm so sleepy"],
    loading: "Summoning a cat... plz wait",
    error: "No cat showed up... the server must be napping 😿 Please try again in a moment.",
    notDeleted: "bro u didn't even delete it 💀",
    fakeBtn: "lol that's not the button 💀 (it's the other cat)",
    nag: (s) => `⏰ HURRY UP!! ur cat is waiting ${s}s`,
    tooSlow: "TOO SLOW 💀",
    burst: (emoji, mood) => `${emoji}\nSO\n${mood}!!`,
    cookieAsk: "🍪 This website uses cookies to make ur cat sadder.\n(we don't actually use cookies lol)\n\nAccept cookies?",
    cookieComebacks: ["lmao nice try 🍪", "i said press OK. 😾", "too bad. ur cookies are mine now 😼🍪"],
  },

  ko: {
    title: "고양이 짤 생성기",
    enter: "여기를 클릭해서\n입장하세요",
    soundHint: "🔊 소리 켜고 들어오세요",
    exitBtn: "응 안 해",
    digInBtn: "해볼게요 드가자",
    cloud: "많은 관심\n감사해용",
    madeBy: "★ 만든 사람:",
    repoLink: "★ 레포 가기:",
    exitTitle: "어딜\n도망가?",
    stayBtn: "알겠어요 있을게요 😿",
    inputLabel: "지금 기분",
    counterBefore: "고양이랑 논 시간:",
    counterAfter: "초",
    copyright: "© 2007 Mood Cat. GIFs Powered by GIPHY. 고양이 짤 저작권은 원작자에게 있습니다.",
    takeIt: "냥붕이들은 퍼가!!",

    lines: [
      "안녕하세요 익명의 개발자지망생입니다",
      "주말동안 부캠에서 배운거 이 미니프로젝트로 써먹어 봤습니다",
      "밤티나는 사이트 이용해주셔서 감사합니다",
    ],
    dodge: [
      "아니아니아니. 그거 말고.",
      "또 누르네 이 사람.",
      "그래 눌러봐라. 해봐.",
    ],
    prefill: "이거 지우고 지금 기분을 입력하세요",
    examples: ["시험 망했어 ㅠㅠ", "배고파 죽겠다", "집에 가고 싶다", "졸려 죽겠어"],
    loading: "고양이 부르는 중... 잠시만 기다려 주세요",
    error: "고양이가 안 와요... 서버가 낮잠 자나 봐요 😿 잠시 후 다시 눌러 주세요.",
    notDeleted: "지우지도 않았잖아요 💀",
    fakeBtn: "ㅋㅋ 그 버튼 아님 💀 (다른 고양이가 진짜임)",
    nag: (s) => `⏰ 빨리빨리!! 고양이가 기다리는 중 ${s}초`,
    tooSlow: "너무 느림 💀",
    burst: (emoji, mood) => `${emoji}\n와 너무\n${mood}하다!!`,
    cookieAsk: "🍪 이 웹사이트는 고양이를 더 슬프게 만들기 위해 쿠키를 사용합니다.\n(사실 쿠키 안 씀 ㅋㅋ)\n\n쿠키를 허용하시겠습니까?",
    cookieComebacks: ["ㅋㅋ 어딜", "확인 누르라고 했다 😾", "됐고 동의한 걸로 침 ㅅㄱ 😼🍪"],
  },
};

// 처음 언어: 지난번에 고른 언어 → 없으면 브라우저 언어(한국어면 ko, 아니면 en)
let currentLang = "en";
try {
  currentLang = localStorage.getItem("moodcat-lang")
    ?? (navigator.language?.toLowerCase().startsWith("ko") ? "ko" : "en");
} catch {
  currentLang = navigator.language?.toLowerCase().startsWith("ko") ? "ko" : "en";
}
if (!I18N[currentLang]) currentLang = "en";

const t = (key) => I18N[currentLang][key];


// ===== 화면 요소 =====
const root = document.documentElement;
const form = $("#mood-form");
const input = $("#mood-input");
const submitBtn = $("#submit-btn");
const statusEl = $("#status");
const result = $("#result");
const catWrap = $("#cat-wrap");
const catGif = $("#cat-gif");
const moodBadge = $("#mood-badge");
const caption = $("#caption");
const timerEl = $("#timer");
const soundToggle = $("#sound-toggle");
const langSelect = $("#lang-select");
const flash = $("#flash");
const page = $("#page");
const exampleButtons = document.querySelectorAll(".examples button");


// =====================================================================
// 화면 전환: 화면(.screen)은 한 번에 하나만 보이게
// =====================================================================
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.hidden = screen.id !== id;
  });
  scrollTo(0, 0);
}


// =====================================================================
// 타자기 효과 (말풍선, 자막, 캡션 모두 이걸 써요)
// =====================================================================
const typingIds = new WeakMap();   // 요소마다 "지금 몇 번째 타이핑인지" 번호표

// 글자 나누기: "😿"나 "👩‍💻" 같은 이모지도 한 글자로
function splitIntoChars(text) {
  if (window.Intl?.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (part) => part.segment);
  }
  return Array.from(text);
}

// 다 치면 true, 중간에 새 타이핑이 시작돼서 멈추면 false
async function typeText(el, text, speed = 45) {
  const myId = (typingIds.get(el) ?? 0) + 1;
  typingIds.set(el, myId);

  if (reducedMotion) {
    el.textContent = text;
    return true;
  }

  el.textContent = "";
  el.classList.add("typing");

  for (const char of splitIntoChars(text)) {
    if (typingIds.get(el) !== myId) return false;   // 그 사이 새 타이핑이 시작됐으면 그만
    el.textContent += char;
    await sleep(/[.,!?…~]/.test(char) ? 220 : speed);   // 문장 부호 뒤에서 잠깐 쉬기
  }

  el.classList.remove("typing");
  return true;
}


// =====================================================================
// 소리: "야옹", "쾅" (Web Audio로 직접 합성, 음원 파일 없음)
// =====================================================================
let audioCtx = null;
let soundOn = true;

try {
  soundOn = localStorage.getItem("moodcat-sound") !== "off";  // 지난번 선택 기억
} catch { /* 저장소를 못 쓰는 환경이면 기본값(켜짐) */ }

function renderSoundToggle() {
  soundToggle.textContent = soundOn ? "SOUND ON" : "SOUND OFF";
  soundToggle.setAttribute("aria-pressed", String(soundOn));
}

// 브라우저는 사용자가 클릭하기 전에는 소리를 막아요 → 클릭할 때 오디오를 "깨우기"
function unlockAudio() {
  if (!soundOn) return;
  audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

// 감정마다 목소리 높이를 다르게 (1 = 보통)
const MOOD_PITCH = {
  happy: 1.3, anxious: 1.2, hungry: 1.1, embarrassed: 1.15, go_home: 1,
  neutral: 1, poop: 0.95, angry: 0.9, hurt: 0.8, sad: 0.75, sleepy: 0.7,
};

function meow(mood) {
  if (!soundOn || !audioCtx) return;
  const time = audioCtx.currentTime;
  const p = MOOD_PITCH[mood] ?? 1;

  const osc = audioCtx.createOscillator();      // 소리의 재료 (떨리는 파형)
  const filter = audioCtx.createBiquadFilter();  // 입 모양처럼 소리 색깔 바꾸기
  const gain = audioCtx.createGain();            // 볼륨

  osc.type = "sawtooth";
  filter.type = "bandpass";
  filter.Q.value = 3;

  // "미 → 야 → 옹": 음이 올라갔다가 천천히 내려가요
  osc.frequency.setValueAtTime(380 * p, time);
  osc.frequency.linearRampToValueAtTime(720 * p, time + 0.12);
  osc.frequency.exponentialRampToValueAtTime(330 * p, time + 0.55);

  filter.frequency.setValueAtTime(900, time);
  filter.frequency.linearRampToValueAtTime(2200, time + 0.15);
  filter.frequency.linearRampToValueAtTime(700, time + 0.55);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.25, time + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.6);

  osc.connect(filter).connect(gain).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + 0.65);
}

// "쾅!": 무작위 소음(지지직)을 점점 낮고 작게 → 멀리서 터지는 소리
function boom() {
  if (!soundOn || !audioCtx) return;
  const time = audioCtx.currentTime;
  const seconds = 1.3;
  const length = Math.floor(audioCtx.sampleRate * seconds);

  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
  }

  const noise = audioCtx.createBufferSource();
  const lowpass = audioCtx.createBiquadFilter();   // 높은 소리를 깎아서 "쿠웅" 하게
  const gain = audioCtx.createGain();

  noise.buffer = buffer;
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(1000, time);
  lowpass.frequency.exponentialRampToValueAtTime(70, time + seconds);
  gain.gain.setValueAtTime(0.6, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + seconds);

  noise.connect(lowpass).connect(gain).connect(audioCtx.destination);
  noise.start(time);
}

// =====================================================================
// 배경음악: 직접 작곡한 8비트 루프 (Web Audio로 합성, 음원 파일 없음 → 저작권 걱정 0)
// - 멜로디(네모파 삑삑) + 베이스(세모파 둥둥) + 하이햇(치익)
// - "스케줄러": 25ms마다 깨어나서, 앞으로 0.12초 안에 울릴 음을 미리 예약해 둬요
//   (setTimeout으로 매 음을 바로 치면 박자가 들쭉날쭉해져요)
// =====================================================================
const BPM = 132;
const EIGHTH = 60 / BPM / 2;   // 8분음표 하나의 길이(초)

// 음 이름 → 주파수 ("C5" → 523.25Hz). null = 쉼표
const NOTE_INDEX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function noteToFreq(note) {
  const semitone = NOTE_INDEX[note[0]] + (Number(note.slice(1)) + 1) * 12;   // MIDI 번호
  return 440 * 2 ** ((semitone - 69) / 12);
}

// 4마디 × 8분음표 8개 = 32칸 (밤티하게 신나는 C장조 멜로디)
const MELODY = [
  "E5", "G5", "C6", "G5",  "A5", "G5", "E5", null,
  "F5", "A5", "C6", "A5",  "G5", null, "E5", "D5",
  "E5", "G5", "C6", "E6",  "D6", "C6", "A5", "G5",
  "F5", "E5", "D5", "G4",  "C5", null, "C5", null,
];

// 베이스: 4분음표마다 (8칸에 4번) 한 번씩
const BASS = [
  "C3", "C3", "G2", "G2",
  "F2", "F2", "C3", "C3",
  "A2", "A2", "E2", "E2",
  "F2", "G2", "C3", "C3",
];

const bgm = { wanted: false, playing: false, step: 0, nextTime: 0, timer: null, bus: null, noise: null };

function playTone(type, freq, time, duration, volume) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, time);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);   // 톡 끊기는 8비트 소리
  osc.connect(gain).connect(bgm.bus);
  osc.start(time);
  osc.stop(time + duration);
}

function playHat(time) {
  const src = audioCtx.createBufferSource();
  const highpass = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  src.buffer = bgm.noise;
  highpass.type = "highpass";
  highpass.frequency.value = 7000;
  gain.gain.setValueAtTime(0.25, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
  src.connect(highpass).connect(gain).connect(bgm.bus);
  src.start(time);
  src.stop(time + 0.05);
}

function scheduleBgm() {
  // 알림창(confirm, alert)이 떠 있는 동안엔 JS가 멈춰서 예약도 밀려요.
  // 닫히고 나서 밀린 음을 한꺼번에 쏟아내지 않게, 박자를 "지금"으로 다시 맞추기
  if (bgm.nextTime < audioCtx.currentTime - 0.1) bgm.nextTime = audioCtx.currentTime + 0.05;

  while (bgm.nextTime < audioCtx.currentTime + 0.12) {
    const step = bgm.step;
    const time = bgm.nextTime;

    if (MELODY[step]) playTone("square", noteToFreq(MELODY[step]), time, EIGHTH * 0.9, 0.18);
    if (step % 2 === 0) playTone("triangle", noteToFreq(BASS[step / 2]), time, EIGHTH * 1.8, 0.5);
    if (step % 2 === 1) playHat(time);   // 엇박마다 치익

    bgm.nextTime += EIGHTH;
    bgm.step = (step + 1) % MELODY.length;   // 끝나면 처음부터 반복
  }
}

function startBgm() {
  if (!bgm.wanted || !soundOn || !audioCtx || bgm.playing) return;

  if (!bgm.bus) {
    bgm.bus = audioCtx.createGain();   // 배경음악 전체 볼륨 (야옹, 쾅보다 작게)
    bgm.bus.gain.value = 0.12;
    bgm.bus.connect(audioCtx.destination);

    // 하이햇용 소음은 한 번만 만들어 두고 계속 재사용
    bgm.noise = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
    const data = bgm.noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }

  bgm.playing = true;
  bgm.step = 0;
  bgm.nextTime = audioCtx.currentTime + 0.05;
  bgm.timer = setInterval(scheduleBgm, 25);
}

function stopBgm() {
  clearInterval(bgm.timer);
  bgm.playing = false;
}

soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  try { localStorage.setItem("moodcat-sound", soundOn ? "on" : "off"); } catch {}
  renderSoundToggle();
  if (soundOn) {
    unlockAudio();
    meow("happy");
    startBgm();   // ENTER를 누른 적이 있으면 배경음악도 다시
  } else {
    stopBgm();
  }
});

renderSoundToggle();


// =====================================================================
// 마우스 효과: 🔥 꼬리, 💥 클릭
// =====================================================================
const POP_ICONS = ["💥", "🔥", "🐾", "💥"];

function popAt(x, y) {
  if (reducedMotion) return;
  const pop = document.createElement("span");
  pop.className = "pop";
  pop.textContent = POP_ICONS[Math.floor(Math.random() * POP_ICONS.length)];
  pop.style.setProperty("--x", `${x}px`);
  pop.style.setProperty("--y", `${y}px`);
  pop.style.setProperty("--r", `${Math.round(randomBetween(-30, 30))}deg`);
  pop.style.setProperty("--dx", `${Math.round(randomBetween(-30, 30))}px`);
  pop.addEventListener("animationend", () => pop.remove());  // 끝나면 지워서 쌓이지 않게
  document.body.appendChild(pop);
}

// 마우스를 따라오는 무지개 리본 꼬리
const trailCanvas = $("#trail");
const ctx = trailCanvas.getContext("2d");
const TRAIL_COLORS = ["#ff4d4d", "#ffa64d", "#ffe066", "#5ce65c", "#4da6ff", "#9966ff"];   // 빨주노초파보
const BAND = 4;          // 무지개 한 줄의 두께(px)
const MAX_POINTS = 26;   // 꼬리 길이 (프레임 수)

const pointer = { x: 0, y: 0, active: false };
let trailPoints = [];

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  trailCanvas.width = innerWidth * dpr;
  trailCanvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawTrail() {
  if (pointer.active) trailPoints.unshift({ x: pointer.x, y: pointer.y });
  else trailPoints.pop();
  if (trailPoints.length > MAX_POINTS) trailPoints.length = MAX_POINTS;

  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.lineCap = "round";    // 선 끝을 둥글게
  ctx.lineJoin = "round";   // 꺾이는 곳도 둥글게
  ctx.lineWidth = BAND;

  // 점과 점 사이를 선으로 이어서 리본 만들기 (색마다 위아래로 조금씩 띄워서 6줄)
  for (let i = 0; i < trailPoints.length - 1; i++) {
    const a = trailPoints[i];
    const b = trailPoints[i + 1];
    ctx.globalAlpha = 1 - i / trailPoints.length;   // 끝으로 갈수록 투명하게

    TRAIL_COLORS.forEach((color, c) => {
      const offset = (c - (TRAIL_COLORS.length - 1) / 2) * BAND;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y + offset);
      ctx.lineTo(b.x, b.y + offset);
      ctx.stroke();
    });
  }
  ctx.globalAlpha = 1;

  requestAnimationFrame(drawTrail);   // 다음 프레임에 또 그리기 (1초에 약 60번)
}

if (!reducedMotion) {
  resizeCanvas();
  addEventListener("resize", resizeCanvas);
  requestAnimationFrame(drawTrail);
}

addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});

document.addEventListener("pointerleave", () => { pointer.active = false; });
addEventListener("pointerup", (event) => {
  if (event.pointerType === "touch") pointer.active = false;
});

addEventListener("pointerdown", (event) => {
  unlockAudio();
  popAt(event.clientX, event.clientY);
});


// =====================================================================
// ①② 랜딩: 말풍선 대사 (바로 시작) → ENTER → 선택 버튼 + 쿠키 알림창
// =====================================================================
const landingLine = $("#landing-line");
const choices = $("#choices");

// 노트북 고양이 이미지 파일이 없으면 깨진 그림 대신 그냥 숨기기 (말풍선은 그대로)
// 스크립트가 실행되기 "전에" 이미 실패했을 수도 있어서, 지금 상태도 한 번 확인해요
const whiskersImg = $("#whiskers-img");
const hideBrokenImg = () => { whiskersImg.hidden = true; };
whiskersImg.addEventListener("error", hideBrokenImg);
if (whiskersImg.complete && whiskersImg.naturalWidth === 0) hideBrokenImg();

// 말풍선 대사: 글자만 나오는 거라 클릭 없이도 바로 시작 OK
async function playLandingScene() {
  const lines = t("lines");
  for (const [index, line] of lines.entries()) {
    const finished = await typeText(landingLine, line);
    if (!finished) return;   // 그 사이 다른 대사(도망가는 버튼, 언어 변경)가 끼어들면 그만
    if (index < lines.length - 1) await sleep(900);
  }
}

// ENTER: 입구 버튼 자리에 "나가기 버튼 + 구라치는 버튼"이 나타나요
$("#enter-btn").addEventListener("click", () => {
  unlockAudio();   // 소리는 클릭한 순간에만 허락돼서 여기서 깨워요
  meow("happy");
  bgm.wanted = true;
  startBgm();      // 🎵 배경음악 시작 (SOUND OFF면 안 나와요)
  $("#enter-area").hidden = true;
  choices.hidden = false;
  setTimeout(showCookie, 1200);   // 버튼이 나오자마자 쿠키 알림창으로 가로막기 😈
});


// ===== 열받는 UI ①: 도망가는 "NAH I'M OUT" (3번 도망가고 나서야 잡힘) =====
const exitBtn = $("#exit-btn");
const MAX_DODGES = 3;
let dodges = 0;

function dodge() {
  if (dodges >= MAX_DODGES) return false;
  const maxX = Math.min(140, innerWidth / 2 - 90);   // 폰에서 화면 밖으로 도망가지 않게
  exitBtn.style.setProperty("--dx", `${Math.round(randomBetween(-maxX, maxX))}px`);
  exitBtn.style.setProperty("--dy", `${Math.round(randomBetween(-90, 90))}px`);
  typeText(landingLine, t("dodge")[dodges]);
  dodges++;
  return true;
}

// 마우스: 버튼 위에 올리기만 해도 도망 / 터치: 눌렀을 때 도망
exitBtn.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") dodge();
});

exitBtn.addEventListener("click", () => {
  if (dodge()) return;   // 아직 도망 중이면 클릭 무시
  boom();
  showScreen("exit");
});

$("#dig-in-btn").addEventListener("click", goToSearch);
$("#stay-btn").addEventListener("click", goToSearch);


// ===== 열받는 UI ②: 브라우저 "진짜" 알림창으로 쿠키 동의 받기 (2007년 감성) =====
// confirm(): [확인] → true, [취소] → false. 페이지가 멈추고 사용자가 누를 때까지 기다려요.
// 취소를 누르면 혼내고 다시 물어봐요. 단, 영원히 가두면 안 되니까 최대 3번까지만.
function showCookie() {
  if ($("#landing").hidden) return;   // 이미 다른 화면으로 갔으면 안 물어봄

  for (const comeback of t("cookieComebacks")) {
    if (confirm(t("cookieAsk"))) return;
    alert(comeback);
  }
  meow("angry");   // 건방지게 한 번 더
}


// =====================================================================
// ③ 무드 검색 화면
// =====================================================================
function goToSearch() {
  showScreen("page");
  meow("happy");
  // 열받는 UI ③: 입력창에 "지워야 하는 글자"를 미리 넣어 두기
  if (!input.value) input.value = t("prefill");
  startNag();
}

// 지금 입력창 글자가 (어느 언어든) "미리 넣어 둔 글자"인지
const isPrefill = (text) => Object.values(I18N).some((lang) => lang.prefill === text);


// ===== 열받는 UI ④: 재촉하는 타이머 (첫 검색이 성공하면 멈춤) =====
const nag = $("#nag");
let nagRunning = false;
let firstResultDone = false;

async function startNag() {
  if (nagRunning || firstResultDone) return;
  nagRunning = true;
  await sleep(4000);   // 들어오자마자는 봐줌

  while (!firstResultDone && !page.hidden) {
    nag.hidden = false;
    for (let s = 10; s >= 0 && !firstResultDone; s--) {
      nag.textContent = t("nag")(s);
      await sleep(1000);
    }
    if (firstResultDone) break;
    nag.textContent = t("tooSlow");
    await sleep(2000);
    nag.hidden = true;
    await sleep(8000);   // 잠깐 쉬었다가 또 재촉
  }

  nag.hidden = true;
  nagRunning = false;
}


// ===== 열받는 UI ⑤: 가짜 SUBMIT 버튼 =====
$("#fake-submit").addEventListener("click", () => {
  statusEl.textContent = t("fakeBtn");
});


// ===== 결과 등장 애니메이션 (GSAP) =====
function animateEntrance() {
  if (reducedMotion || !window.gsap) return;  // GSAP을 못 불러와도 앱은 그대로 동작

  gsap.fromTo(flash, { opacity: 0.95 }, { opacity: 0, duration: 0.7, ease: "power2.out" });   // 번쩍!
  gsap.to(page, { keyframes: { x: [0, -14, 12, -8, 6, -3, 0] }, duration: 0.5, ease: "none" });  // 쿵쿵
  gsap.fromTo(catGif,
    { scale: 0, rotation: -15 },
    { scale: 1, rotation: 0, duration: 0.7, ease: "back.out(2.2)" });
  gsap.fromTo(moodBadge,
    { scale: 0 },
    { scale: 1, duration: 0.5, ease: "back.out(3)", delay: 0.3 });
}


// ===== BE 요청 + 결과 보여주기 =====
async function fetchMoodCat(text) {
  const res = await fetch(`${API_BASE}/mood`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // { text, mood, caption, image_url }
}

// 짤을 미리 다 받아 두기 → 빈 상자가 먼저 튀어나오는 걸 막아요
function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = url;
  });
}

let lastMood = null;   // 언어를 바꾸면 폭발 별 글자도 다시 쓰려고 기억

function renderBurst(mood) {
  const moodText = mood.replace("_", " ").toUpperCase();
  const burstText = document.createElement("span");
  burstText.textContent = t("burst")(MOOD_EMOJI[mood] ?? "🐱", moodText);
  moodBadge.replaceChildren(burstText);   // textContent처럼 안전하게 (HTML로 해석 안 함)
}

function showResult(data) {
  catGif.src = data.image_url;
  catGif.alt = `${data.mood} cat GIF`;
  catWrap.className = `cat-wrap mood-${data.mood}`;   // 감정별 움직임 (style.css)
  lastMood = data.mood;
  renderBurst(data.mood);   // 폭발 별: "와 너무 SAD하다!!" / "SO SAD!!"
  result.hidden = false;
  typeText(caption, data.caption);   // 캡션은 LLM이 입력 언어를 따라가서 번역 필요 없어요
}

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // 폼의 기본 동작(페이지 새로고침) 막기

  const text = input.value.trim();
  if (!text) return;
  if (isPrefill(text)) {
    statusEl.textContent = t("notDeleted");
    return;
  }

  unlockAudio();  // 클릭한 "그 순간"에 깨워 둬야 나중에 소리를 낼 수 있어요
  submitBtn.disabled = true;
  submitBtn.textContent = "...";
  statusEl.textContent = t("loading");
  statusEl.classList.add("loading");

  try {
    const data = await fetchMoodCat(text);
    await loadImage(data.image_url);
    showResult(data);
    animateEntrance();
    boom();                                    // 쾅!
    setTimeout(() => meow(data.mood), 450);    // ...그리고 태연하게 야옹
    statusEl.textContent = "";
    input.value = "";  // 성공하면 입력창 비우기 (실패하면 그대로 둬서 바로 다시 시도할 수 있게)
    firstResultDone = true;   // 재촉 타이머 그만
  } catch (error) {
    console.error(error);
    statusEl.textContent = t("error");
  } finally {
    statusEl.classList.remove("loading");
    submitBtn.disabled = false;
    submitBtn.textContent = "MEOW!";
  }
});

// 추천 검색어: 누르면 바로 검색
exampleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.text;
    form.requestSubmit(); // submit 버튼을 누른 것처럼 실행
  });
});

// 머문 시간 카운터 (2007년 방문자 카운터처럼 6자리)
const startedAt = Date.now();
setInterval(() => {
  timerEl.textContent = String(Math.floor((Date.now() - startedAt) / 1000)).padStart(6, "0");
}, 1000);


// =====================================================================
// 언어 바꾸기
// =====================================================================
function applyLanguage(lang) {
  currentLang = I18N[lang] ? lang : "en";
  root.lang = currentLang;
  langSelect.value = currentLang;
  try { localStorage.setItem("moodcat-lang", currentLang); } catch {}

  // HTML에 이름표(data-i18n)가 붙은 글자들
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  // 추천 검색어: 보이는 글자 + 눌렀을 때 넣을 문장
  t("examples").forEach((text, i) => {
    if (!exampleButtons[i]) return;
    exampleButtons[i].textContent = text;
    exampleButtons[i].dataset.text = text;
  });

  // 입력창에 "미리 넣어 둔 글자"가 그대로 있으면 그것도 바꾸기
  if (isPrefill(input.value)) input.value = t("prefill");

  // 지금 보이는 화면의 대사도 새 언어로 다시
  if (!$("#landing").hidden) playLandingScene();
  if (lastMood && !result.hidden) renderBurst(lastMood);
}

langSelect.addEventListener("change", () => applyLanguage(langSelect.value));

applyLanguage(currentLang);   // 처음 한 번 (이 안에서 랜딩 대사도 시작돼요)
