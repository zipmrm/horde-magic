// --- GLOBAL VARIABLES ---
var life = 40;
var horde = 2;
var player = 2;
var nontoken = 1;
var turn = 0;
var intturn = 0;
var prepturns = 0;
var diff = 1;
var hto = 1;
var pto = 1;
var Normal = 1;
var Medium = 0;
var Hard = 0;
var random = 0;
var effect = 0;
var poison = 0;
var cantlose = 0;

// Replaced the variable 'name' with 'matchStats' to avoid browser conflicts
var matchStats = {};
matchStats.Random = "No";

// --- INITIAL SETUP ---
hideElement("p3commander");
hideElement("p4commander");

// --- HELPER FUNCTIONS ---

// Saves data locally instead of using Code.org's cloud database
function saveGameResult(data) {
  try {
    var history = JSON.parse(localStorage.getItem("HordeGameHistory") || "[]");
    history.push({
      timestamp: new Date().toLocaleString(),
      gameData: JSON.parse(JSON.stringify(data)) // Deep copy to ensure it's a clean object
    });
    localStorage.setItem("HordeGameHistory", JSON.stringify(history));
    console.log("Game Saved Successfully");
  } catch (e) {
    console.error("Local Storage Error:", e);
  }
}

// Centralized check for win/loss conditions
function checkGameOver() {
  if (cantlose === 0) {
    if (life <= 0 || poison >= 10) {
      setScreen("GameOver");
      matchStats.Result = "Loss";
      saveGameResult(matchStats);
    }
  }
}

// --- EVENT HANDLERS ---

onEvent("medium", "click", function() {
  if (diff == 1) {
    prepturns -= 1;
    intturn -= 2;
    setText("HordeTurns", intturn);
    setText("prepturns", prepturns);
    diff = 2;
    Medium = 1;
    Normal = 0;
    setText("PTHorde", prepturns);
  }
});

onEvent("hard", "click", function() {
  if (diff == 1) {
    prepturns -= 2;
    intturn -= 3;
    setText("HordeTurns", intturn);
    setText("prepturns", prepturns);
    diff = 2;
    Hard = 1;
    Normal = 0;
    setText("PTHorde", prepturns);
  }
});

onEvent("HT", "click", function() {
  if (hto == 1) {
    intturn = randomNumber(1, 10) + 2;
    setText("HordeTurns", intturn);
    hto = 2;
  }
});

onEvent("PT", "click", function() {
  if (pto == 1) {
    prepturns = randomNumber(1, 4) + 1;
    setText("prepturns", prepturns);
    pto = 2;
    setText("PTHorde", prepturns);
  }
});

onEvent("two", "click", function() { life = 40; });
onEvent("three", "click", function() { life = 60; horde = 3; player = 3; });
onEvent("four", "click", function() { life = 80; horde = 4; player = 4; });

onEvent("start", "click", function() {
  if (player == 2) {
    life = 40;
    matchStats.Difficulty = (Normal == 1) ? "Normal" : (Medium == 1) ? "Challenging" : "Insane";
  } else if (player == 3) {
    life = (Normal == 1) ? 60 : (Medium == 1) ? 45 : 30;
    matchStats.Difficulty = (Normal == 1) ? "Normal" : (Medium == 1) ? "Challenging" : "Insane";
    horde = 3;
    showElement("p3commander");
  } else if (player == 4) {
    life = (Normal == 1) ? 80 : (Medium == 1) ? 60 : 40;
    matchStats.Difficulty = (Normal == 1) ? "Normal" : (Medium == 1) ? "Challenging" : "Insane";
    horde = 4;
    showElement("p3commander");
    showElement("p4commander");
  }
  setScreen("DeckNames");
  setText("tokens", nontoken);
  setText("life", life);
});

onEvent("Start1", "click", function() {
  matchStats.commander1 = getText("p1deck");
  matchStats.commander2 = getText("p2commander");
  if (player >= 3) matchStats.commander3 = getText("p3commander");
  if (player == 4) matchStats.commander4 = getText("p4commander");
  
  setScreen("Horde");
  matchStats.Name = getText("Hordename");
});

onEvent("+5", "click", function() { life += 5; setText("life", life); });
onEvent("+1", "click", function() { life += 1; setText("life", life); });
onEvent("-1", "click", function() { life -= 1; setText("life", life); checkGameOver(); });
onEvent("-5", "click", function() { life -= 5; setText("life", life); checkGameOver(); });

onEvent("Hordeturn", "click", function() {
  turn += horde;
  setText("counters", turn);
  if (turn >= intturn) {
    nontoken += 1;
    setText("tokens", nontoken);
    intturn += 5;
  }
  if (random == 1) {
    effect = randomNumber(1, 10);
    var effectsList = [
      "You got lucky, nothing this round", 
      "1 extra spell", "2 extra spells", "3 extra spells",
      "Horde has Deathtouch", "Horde has Trample", "Horde has First Strike",
      "Horde has +1/+1 until end of turn", "Horde has +2/+2 until end of turn",
      "Horde has -1/-1 until end of turn"
    ];
    setText("randomness", effectsList[effect] || effectsList[0]);
  }
});

onEvent("Random2", "click", function() {
  random = 1;
  showElement("randomness");
  showElement("text_area13");
  hideElement("Random2");
  matchStats.Random = "Yes";
});

onEvent("random", "click", function() {
  random = 1;
  showElement("text_area13");
  showElement("randomness");
  hideElement("Random2");
  matchStats.Random = "Yes";
});

onEvent("Poison", "click", function() {
  poison += 1;
  setText("poisontext", poison);
  checkGameOver();
});

onEvent("Cantlose", "click", function() { cantlose = 1; });
onEvent("canlose", "click", function() { cantlose = 0; checkGameOver(); });

onEvent("TookPT", "click", function() {
  prepturns -= 1;
  setText("PTHorde", prepturns);
  if (prepturns === 0) hideElement("TookPT");
});

onEvent("wewin", "click", function() {
  setScreen("Victory");
  matchStats.Result = "Win";
  saveGameResult(matchStats);
});

onEvent("RestartV", "click", function() {
  life = 40;
  horde = 2;
  player = 2;
  nontoken = 1;
  turn = 0;
  intturn = 0;
  prepturns = 0;
  diff = 1;
  hto = 1;
  pto = 1;
  Normal = 1;
  Medium = 0;
  Hard = 0;
  random = 0;
  effect = 0;
  poison = 0;
  cantlose = 0;
  setScreen("screen1");
  showElement("TookPT");
  setText("HordeTurns", intturn);
  setText("prepturns", prepturns);
  setText("tokens", nontoken);
  setText("counters", 0);
  setText("poisontext", poison);
  hideElement("text_area13");
  hideElement("randomness");
  showElement("Random2");
});