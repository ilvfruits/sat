let cards = [];
let index = 0;
let flipped = false;
let currentDay = "day1";

let examData = null;
let examIndex = 0;
let userAnswers = {};
let timerInterval = null;
let timeLeft = 0;


/* ---------- FLASHCARDS ---------- */

async function loadDay(day) {
  currentDay = day; // 🔑 FIX 1

  const res = await fetch(`data/${day}.json`);
  cards = await res.json();
  index = 0;
  showCard();
  resetExam();
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

/* ---------- EXAM ---------- */

function resetExam() {
  if (timerInterval) clearInterval(timerInterval);

  const examNum = currentDay.replace("day", "");
  const res = await fetch(`mock/exam${examNum}.json`);

  if (!res.ok) {   // ✅ FIX 2 (correct place)
    alert("Exam not available for this day yet.");
    return;
  }

  examData = await res.json();
  examIndex = 0;
  userAnswers = {};
  timeLeft = examData.time_limit_minutes * 60;
  
  document.getElementById("exam").style.display = "none";
  document.getElementById("result").textContent = "";
}

async function startExam() {

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
  const correctAnswer = q.answer;

  document.getElementById("examQuestion").textContent =
    `Q${examIndex + 1}. ${q.question}`;

  updateScoreBoard();

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  const alreadyAnswered = userAnswers.hasOwnProperty(examIndex);
  const userChoice = userAnswers[examIndex];

  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.className = "choice-btn";

    if (alreadyAnswered) {
      btn.disabled = true;
      btn.classList.add("locked");

      if (choice === correctAnswer) btn.classList.add("correct");
      if (choice === userChoice && userChoice !== correctAnswer) {
        btn.classList.add("wrong");
      }
    } else {
      btn.onclick = () => {
        userAnswers[examIndex] = choice;
        showExamQuestion();
      };
    }

    choicesDiv.appendChild(btn);
  });
}

function updateScoreBoard() {
  let answered = Object.keys(userAnswers).length;
  let correct = 0;

  for (let i in userAnswers) {
    if (userAnswers[i] === examData.questions[i].answer) {
      correct++;
    }
  }

  document.getElementById("scoreBoard").textContent =
    `Answered: ${answered} / ${examData.questions.length} | Correct so far: ${correct}`;
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
  document.getElementById("result").innerHTML =
    `<strong>Final Score:</strong> ${score} / ${examData.questions.length}`;
}

/* ---------- EVENTS ---------- */

document.getElementById("daySelect").addEventListener("change", e => {
  loadDay(e.target.value);
});

loadDay(currentDay);


