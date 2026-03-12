const scenarios = [
  {
    id: 1,
    title: "Situation 1",
    phase: "Evacuate",
    focus: "Follow the route",
    image: "assets/scene-1.svg",
    shortPrompt: "A precautionary closure starts fast. Your items can wait.",
    briefing:
      "When a building restriction is announced, the safest action is to leave promptly using the route you were given.",
    scenario:
      "You are working in a shared office space at the City Services building when your supervisor announces that certain areas of the building are being closed as a precaution. Employees are instructed to leave the building using a specific exit and to avoid passing through the mailroom. You realize your phone charger and personal notebook are still at your desk.",
    question: "What is the safest action to take?",
    choices: [
      "Return to your desk briefly to collect your personal items",
      "Leave the building using the instructed route without delay",
      "Wait to see if the restrictions are lifted",
      "Use a different exit that seems closer to your workspace"
    ],
    correctIndex: 1,
    explanation:
      "The safest choice is to leave immediately using the instructed route. During a precautionary closure, delaying, re-entering, or improvising a new path can increase risk."
  },
  {
    id: 2,
    title: "Situation 2",
    phase: "Avoid",
    focus: "Do not inspect",
    image: "assets/scene-2.svg",
    shortPrompt: "An unmarked container and a faint odor are enough to stop and report.",
    briefing:
      "If something unusual is in a restricted path, do not move it or investigate it. Keep distance and report it through the proper channel.",
    scenario:
      "As you move toward the exit, you notice a small container sitting on the floor near a doorway that is normally kept clear. The container is unmarked and does not appear to be part of any routine work. You also notice a faint odor in the area. Other employees are beginning to pass nearby as they leave the building.",
    question: "What should you do?",
    choices: [
      "Move the container out of the walkway so others can pass safely",
      "Carry the container to a storage area to remove it from the hallway",
      "Avoid the area and report the location of the container to a supervisor or designated contact",
      "Inspect the container more closely to determine whether it is dangerous"
    ],
    correctIndex: 2,
    explanation:
      "The safest action is to avoid the area and report it. Unmarked items with unusual cues should not be touched, moved, or examined by employees."
  },
  {
    id: 3,
    title: "Situation 3",
    phase: "Wait",
    focus: "Official guidance",
    image: "assets/scene-3.svg",
    shortPrompt: "Feeling fine does not replace instructions after a possible exposure.",
    briefing:
      "After a possible exposure, self-directed cleanup can interfere with response guidance. Official instructions come first.",
    scenario:
      "Later that day, you receive a message from your supervisor stating that you may have been near an area of concern earlier in the incident. You do not feel ill, but you are unsure whether you were exposed. You are tempted to take a hot shower and wash your clothes in your home laundry immediately before waiting for further guidance.",
    question: "What is the most appropriate action?",
    choices: [
      "Wash everything right away using household cleaning products",
      "Continue normal activities since no symptoms are present",
      "Follow official instructions and wait for further guidance",
      "Take that hot shower and disregard any further instructions"
    ],
    correctIndex: 2,
    explanation:
      "The most appropriate action is to wait for and follow official instructions. A lack of symptoms does not confirm safety, and improvised cleanup is not a substitute for formal guidance."
  },
  {
    id: 4,
    title: "Situation 4",
    phase: "Communicate",
    focus: "Trust official sources",
    image: "assets/scene-4.svg",
    shortPrompt: "Conflicting updates spread quickly. Official messaging is the anchor.",
    briefing:
      "After an incident, accurate communication matters. Avoid rumor-sharing and rely on official messages from leadership or designated responders.",
    scenario:
      "While working from home the next day, you see coworkers sharing updates about the incident in a group text and on social media. Some of the information does not match what was included in official messages from city leadership.",
    question: "What is the next best course of action?",
    choices: [
      "Share inaccurate information so others stay confused",
      "Ask coworkers which details they think are correct",
      "Rely on official communications and avoid speculation",
      "Post your own summary to clarify the situation"
    ],
    correctIndex: 2,
    explanation:
      "The safest next step is to rely on official communications and avoid speculation. Conflicting informal updates can spread confusion during an incident."
  }
];

const scenarioImage = document.getElementById("scenarioImage");
const scenarioTag = document.getElementById("scenarioTag");
const scenarioPromptShort = document.getElementById("scenarioPromptShort");
const briefingText = document.getElementById("briefingText");
const storyChipPhase = document.getElementById("storyChipPhase");
const storyChipFocus = document.getElementById("storyChipFocus");
const scenarioText = document.getElementById("scenarioText");
const questionText = document.getElementById("questionText");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const scoreValue = document.getElementById("scoreValue");
const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");
const scenarioCard = document.getElementById("scenarioCard");
const resultCard = document.getElementById("resultCard");
const resultHeadline = document.getElementById("resultHeadline");
const resultSummary = document.getElementById("resultSummary");
const resultGrid = document.getElementById("resultGrid");
const restartButton = document.getElementById("restartButton");

const letters = ["A", "B", "C", "D"];

let currentIndex = 0;
let score = 0;
let selectedChoice = null;
let isAnswered = false;
let answers = Array.from({ length: scenarios.length }, () => null);
let audioContext = null;
let masterGainNode = null;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
    masterGainNode = audioContext.createGain();
    masterGainNode.gain.value = 0.14;
    masterGainNode.connect(audioContext.destination);
  }

  return audioContext;
}

function unlockAudio() {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === "suspended") {
    context.resume().catch(() => {});
  }
}

function playTone({
  frequency = 440,
  endFrequency = frequency,
  duration = 0.08,
  type = "triangle",
  volume = 0.1,
  delay = 0
}) {
  const context = getAudioContext();
  if (!context || context.state !== "running" || !masterGainNode) return;

  const startTime = context.currentTime + delay;
  const endTime = startTime + duration;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), endTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

  oscillator.connect(gainNode);
  gainNode.connect(masterGainNode);
  oscillator.start(startTime);
  oscillator.stop(endTime);
}

function playUiSound(type) {
  switch (type) {
    case "select":
      playTone({ frequency: 410, endFrequency: 500, duration: 0.05, type: "triangle", volume: 0.08 });
      playTone({ frequency: 610, endFrequency: 720, duration: 0.04, type: "sine", volume: 0.05, delay: 0.025 });
      break;
    case "correct":
      playTone({ frequency: 480, endFrequency: 570, duration: 0.07, type: "triangle", volume: 0.09 });
      playTone({ frequency: 650, endFrequency: 790, duration: 0.09, type: "triangle", volume: 0.08, delay: 0.05 });
      playTone({ frequency: 860, endFrequency: 980, duration: 0.11, type: "sine", volume: 0.06, delay: 0.1 });
      break;
    case "incorrect":
      playTone({ frequency: 300, endFrequency: 220, duration: 0.09, type: "sawtooth", volume: 0.06 });
      playTone({ frequency: 210, endFrequency: 170, duration: 0.1, type: "triangle", volume: 0.05, delay: 0.05 });
      break;
    case "next":
      playTone({ frequency: 420, endFrequency: 510, duration: 0.05, type: "triangle", volume: 0.07 });
      playTone({ frequency: 560, endFrequency: 670, duration: 0.06, type: "sine", volume: 0.045, delay: 0.04 });
      break;
    case "back":
      playTone({ frequency: 380, endFrequency: 320, duration: 0.05, type: "triangle", volume: 0.06 });
      playTone({ frequency: 300, endFrequency: 250, duration: 0.06, type: "sine", volume: 0.04, delay: 0.035 });
      break;
    case "results":
      playTone({ frequency: 520, endFrequency: 630, duration: 0.08, type: "triangle", volume: 0.08 });
      playTone({ frequency: 700, endFrequency: 850, duration: 0.1, type: "triangle", volume: 0.07, delay: 0.06 });
      playTone({ frequency: 920, endFrequency: 1120, duration: 0.14, type: "sine", volume: 0.055, delay: 0.14 });
      break;
    case "reset":
      playTone({ frequency: 350, endFrequency: 430, duration: 0.05, type: "triangle", volume: 0.06 });
      playTone({ frequency: 470, endFrequency: 560, duration: 0.06, type: "sine", volume: 0.04, delay: 0.04 });
      break;
    default:
      break;
  }
}

function renderScenario() {
  const scenario = scenarios[currentIndex];
  const savedAnswer = answers[currentIndex];

  selectedChoice = savedAnswer?.selectedIndex ?? null;
  isAnswered = savedAnswer?.isCorrect !== undefined;

  scenarioImage.src = scenario.image;
  scenarioImage.alt = `${scenario.title} placeholder artwork`;
  scenarioTag.textContent = scenario.title;
  scenarioPromptShort.textContent = scenario.shortPrompt;
  briefingText.textContent = scenario.briefing;
  storyChipPhase.textContent = scenario.phase;
  storyChipFocus.textContent = scenario.focus;
  scenarioText.textContent = scenario.scenario;
  questionText.textContent = scenario.question;
  progressLabel.textContent = `${scenario.title} of ${scenarios.length}`;
  progressFill.style.width = `${((currentIndex + 1) / scenarios.length) * 100}%`;
  scoreValue.textContent = score;

  choicesEl.innerHTML = "";

  scenario.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.dataset.letter = letters[index];
    button.innerHTML = `<span class="choice-title">${choice}</span>`;

    if (selectedChoice === index) {
      button.classList.add("selected");
    }

    if (isAnswered) {
      if (index === scenario.correctIndex) {
        button.classList.add("correct");
      } else if (selectedChoice === index) {
        button.classList.add("incorrect");
      }

      button.disabled = true;
    }

    button.addEventListener("click", () => {
      if (isAnswered) return;

      selectedChoice = index;
      nextButton.disabled = false;
      playUiSound("select");

      Array.from(choicesEl.children).forEach((child, childIndex) => {
        child.classList.toggle("selected", childIndex === index);
      });
    });

    choicesEl.appendChild(button);
  });

  prevButton.disabled = currentIndex === 0;
  nextButton.textContent = isAnswered
    ? currentIndex === scenarios.length - 1
      ? "View Results"
      : "Next Situation"
    : "Check Answer";
  nextButton.disabled = !isAnswered && selectedChoice === null;

  if (isAnswered) {
    const wasCorrect = savedAnswer.isCorrect;
    feedbackEl.textContent = `${wasCorrect ? "Safest choice." : "Review this step."} ${scenario.explanation}`;
    feedbackEl.className = `feedback ${wasCorrect ? "correct" : "incorrect"}`;
  } else {
    feedbackEl.textContent = "Choose one response and check it to see why that action is the safest next step.";
    feedbackEl.className = "feedback";
  }
}

function checkAnswer() {
  const scenario = scenarios[currentIndex];
  const isCorrect = selectedChoice === scenario.correctIndex;
  const previous = answers[currentIndex];

  if (!previous) {
    answers[currentIndex] = { selectedIndex: selectedChoice, isCorrect };
    if (isCorrect) score += 1;
  } else {
    if (previous.isCorrect && !isCorrect) score -= 1;
    if (!previous.isCorrect && isCorrect) score += 1;
    answers[currentIndex] = { selectedIndex: selectedChoice, isCorrect };
  }

  isAnswered = true;
  playUiSound(isCorrect ? "correct" : "incorrect");
  renderScenario();
}

function showResults() {
  scenarioCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  scoreValue.textContent = score;
  playUiSound("results");
  window.parent.postMessage({ type: "complete" }, "*");

  resultHeadline.textContent =
    score === scenarios.length
      ? "You chose the safest action in every situation."
      : `You chose ${score} of ${scenarios.length} safest actions.`;

  resultSummary.textContent =
    "This story reinforces four priorities: follow directed routes, do not handle suspicious items, wait for official exposure guidance, and trust official communications over rumors.";

  resultGrid.innerHTML = "";

  scenarios.forEach((scenario, index) => {
    const answer = answers[index];
    const item = document.createElement("article");
    item.className = `result-item ${answer?.isCorrect ? "correct" : "incorrect"}`;
    item.innerHTML = `
      <strong>${scenario.title}: ${answer?.isCorrect ? "Safest choice made" : "Review needed"}</strong>
      <div class="result-item-body">
        <p>${scenario.explanation}</p>
        <img class="result-thumb" src="${scenario.image}" alt="${scenario.title} thumbnail">
      </div>
    `;
    resultGrid.appendChild(item);
  });
}

function resetInteraction() {
  currentIndex = 0;
  score = 0;
  selectedChoice = null;
  isAnswered = false;
  answers = Array.from({ length: scenarios.length }, () => null);
  resultCard.classList.add("hidden");
  scenarioCard.classList.remove("hidden");
  playUiSound("reset");
  renderScenario();
}

nextButton.addEventListener("click", () => {
  if (!isAnswered) {
    checkAnswer();
    return;
  }

  if (currentIndex === scenarios.length - 1) {
    showResults();
    return;
  }

  currentIndex += 1;
  playUiSound("next");
  renderScenario();
});

prevButton.addEventListener("click", () => {
  if (currentIndex === 0) return;

  currentIndex -= 1;
  playUiSound("back");
  renderScenario();
});

restartButton.addEventListener("click", resetInteraction);

window.addEventListener("pointerdown", unlockAudio, { once: true });
window.addEventListener("keydown", unlockAudio, { once: true });

renderScenario();
