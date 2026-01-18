let cards = [];
let index = 0;
let flipped = false;

async function loadDay(day) {
  const res = await fetch(`data/${day}.json`);
  cards = await res.json();
  index = 0;
  showCard();
}

function showCard() {
  const c = cards[index];
  document.getElementById("word").textContent = c.word;
  document.getElementById("pos").textContent = c.pos;
  document.getElementById("meaning").textContent = c.meaning_cn;

  document.getElementById("definition").textContent = c.definition;
  document.getElementById("example").textContent = c.example;

  document.querySelectorAll(".hidden").forEach(e => e.style.display = "none");
  flipped = false;
}

function flipCard() {
  flipped = !flipped;
  document.querySelectorAll(".hidden").forEach(
    e => e.style.display = flipped ? "block" : "none"
  );
}

function nextCard() {
  index = (index + 1) % cards.length;
  showCard();
}

function prevCard() {
  index = (index - 1 + cards.length) % cards.length;
  showCard();
}

function shuffleCards() {
  cards.sort(() => Math.random() - 0.5);
  index = 0;
  showCard();
}

document.getElementById("daySelect").addEventListener("change", e => {
  loadDay(e.target.value);
});

loadDay("day1");
