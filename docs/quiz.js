let questions = [];
let currentIndex = 0;

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const explanationEl = document.getElementById("explanation");
const nextBtn = document.getElementById("nextBtn");

// Get ?set=grade3
const params = new URLSearchParams(window.location.search);
const setName = params.get("set");

fetch(`data/${setName}.json`)
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  })
  .catch(() => {
    questionEl.textContent = "❌ Question set not found.";
  });

function showQuestion() {
  const q = questions[currentIndex];
  questionEl.textContent = `Q${currentIndex + 1}. ${q.question}`;
  choicesEl.innerHTML = "";
  explanationEl.classList.add("hidden");
  nextBtn.classList.add("hidden");

  q.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => selectAnswer(btn, index);
    choicesEl.appendChild(btn);
  });
}

function selectAnswer(button, index) {
  const q = questions[currentIndex];
  const buttons = choicesEl.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add("correct");
    if (i === index && i !== q.correctIndex) btn.classList.add("wrong");
  });

  explanationEl.textContent = q.explanation;
  explanationEl.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
}

nextBtn.onclick = () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    questionEl.textContent = "🎉 Quiz completed!";
    choicesEl.innerHTML = "";
    explanationEl.classList.add("hidden");
    nextBtn.classList.add("hidden");
  }
};

function goHome() {
  window.location.href = "index.html";
}
