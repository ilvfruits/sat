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
let examData = null;
let examIndex = 0;
let userAnswers = {};
let timerInterval;
let timeLeft;

async function startExam() {
  const res = await fetch("mock/exam1.json");
  examData = await res.json();

  examIndex = 0;
  userAnswers = {};
  timeLeft = examData.time_limit_minutes * 60;

  document.getElementById("exam").style.display = "block";
  document.getElementById("result").textContent = "";

  startTimer();
  showExamQuestion();
}

function startTimer() {
  updateTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) submitExam();
  }, 1000);
}

function updateTimer() {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  document.getElementById("timer").textContent =
    `Time Left: ${min}:${sec.toString().padStart(2, "0")}`;
}

function showExamQuestion() {
  const q = examData.questions[examIndex];
  document.getElementById("examQuestion").textContent =
    `Q${examIndex + 1}. ${q.question}`;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.style.display = "block";
    btn.style.margin = "5px auto";

    if (userAnswers[examIndex] === choice) {
      btn.style.background = "#cce5ff";
    }

    btn.onclick = () => {
      userAnswers[examIndex] = choice;
      showExamQuestion();
    };

    choicesDiv.appendChild(btn);
  });
}

function nextQuestion() {
  if (examIndex < examData.questions.length - 1) {
    examIndex++;
    showExamQuestion();
  }
}

function prevQuestion() {
  if (examIndex > 0) {
    examIndex--;
    showExamQuestion();
  }
}

function submitExam() {
  clearInterval(timerInterval);

  let score = 0;
  examData.questions.forEach((q, i) => {
    if (userAnswers[i] === q.answer) score++;
  });

  document.getElementById("exam").style.display = "none";
  document.getElementById("result").textContent =
    `Score: ${score} / ${examData.questions.length}`;
}

document.getElementById("daySelect").addEventListener("change", e => {
  loadDay(e.target.value);
});

loadDay("day1");

