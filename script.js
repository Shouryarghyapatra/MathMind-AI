//=====================================================
// MATHMIND AI
// SCRIPT.JS
// PART 1
// GLOBAL VARIABLES & INITIALIZATION
//=====================================================

"use strict";

//=====================================================
// QUIZ SETTINGS
//=====================================================

const TOTAL_QUESTIONS = 20;
const QUESTION_TIME = 30;
const XP_PER_CORRECT = 10;

//=====================================================
// QUIZ STATE
//=====================================================

let currentQuestion = null;

let currentQuestionNumber = 0;

let score = 0;

let streak = 0;

let bestStreak = 0;

let xp = 0;

let level = 1;

let timer = QUESTION_TIME;

let timerInterval = null;

let selectedTopic = "";

let selectedDifficulty = "";

let questionFormat = "descriptive";

let timerEnabled = false;

let studentName = "";

let challengeMode = false;

let mixedMode = false;

let quizFinished = false;

let answered = false;

//=====================================================
// ARRAYS
//=====================================================

let askedQuestions = [];

let earnedBadges = [];

//=====================================================
// DOM ELEMENTS
//=====================================================

const welcomeScreen =
document.getElementById("welcome-screen");

const quizScreen =
document.getElementById("quiz-screen");

const resultScreen =
document.getElementById("result-screen");

//=====================================================

const studentInput =
document.getElementById("student-name");

const topicSelect =
document.getElementById("topic");

const difficultySelect =
document.getElementById("difficulty");

const timerChoice =
document.getElementById("timer-choice");

const formatSelect =
document.getElementById("question-format");

//=====================================================

const questionElement =
document.getElementById("question");

const questionNumberElement =
document.getElementById("question-number");

const progressFill =
document.getElementById("progress-fill");

//=====================================================

const scoreElement =
document.getElementById("score");

const streakElement =
document.getElementById("streak");

const bestStreakElement =
document.getElementById("best-streak");

//=====================================================

const answerInput =
document.getElementById("answer");

const feedbackElement =
document.getElementById("feedback");

const explanationElement =
document.getElementById("explanation");

const hintBox =
document.getElementById("hint-box");

//=====================================================

const descriptiveArea =
document.getElementById("descriptive-answer-area");

const mcqArea =
document.getElementById("mcq-answer-area");

const mcqOptions =
document.getElementById("mcq-options");

//=====================================================

const timerBox =
document.getElementById("timer-box");

const timerText =
document.getElementById("timer");

//=====================================================

const challengeLevel =
document.getElementById("challenge-level");

const challengeText =
document.getElementById("challenge-level-text");

//=====================================================
// RESULT SCREEN
//=====================================================

const finalScore =
document.getElementById("final-score");

const finalTotal =
document.getElementById("final-total");

const finalPercentage =
document.getElementById("final-percentage");

const personalFeedback =
document.getElementById("personal-feedback-text");

const strengthText =
document.getElementById("strength-text");

const practiceText =
document.getElementById("practice-text");

const badgeContainer =
document.getElementById("badges-container");

//=====================================================
// TOPIC REGISTRY
//=====================================================

const questionGenerators = {

    addition:
        window.generateAdditionQuestion,

    subtraction:
        window.generateSubtractionQuestion,

    multiplication:
        window.generateMultiplicationQuestion,

    division:
        window.generateDivisionQuestion,

    fractions:
        window.generateFractionsQuestion,

    decimals:
        window.generateDecimalsQuestion,

    percentages:
        window.generatePercentagesQuestion,

    ratio:
        window.generateRatioQuestion,

    factors:
        window.generateFactorsQuestion,

    algebra:
        window.generateAlgebraQuestion

};

//=====================================================
// MIXED MODE TOPICS
//=====================================================

const mixedTopics = [

    "addition",

    "subtraction",

    "multiplication",

    "division",

    "fractions",

    "decimals",

    "percentages",

    "ratio",

    "factors",

    "algebra"

];

//=====================================================
// CHALLENGE LEVELS
//=====================================================

const challengeLevels = [

    "easy",

    "easy",

    "easy",

    "easy",

    "easy",

    "medium",

    "medium",

    "medium",

    "medium",

    "medium",

    "hard",

    "hard",

    "hard",

    "hard",

    "hard",

    "expert",

    "expert",

    "expert",

    "expert",

    "expert"

];

//=====================================================
// RANDOM INTEGER
//=====================================================

function rand(min,max){

    return Math.floor(

        Math.random()*

        (max-min+1)

    )+min;

}

//=====================================================
// SHUFFLE ARRAY
//=====================================================

function shuffle(array){

    return [...array].sort(

        ()=>Math.random()-0.5

    );

}

//=====================================================
// RESET QUIZ
//=====================================================

function resetQuiz(){

    currentQuestion=null;

    currentQuestionNumber=0;

    score=0;

    streak=0;

    bestStreak=0;

    xp=0;

    level=1;

    timer=QUESTION_TIME;

    answered=false;

    quizFinished=false;

    askedQuestions=[];

    earnedBadges=[];

}

//=====================================================
// END PART 1
//=====================================================
//=====================================================
// PART 2
// START QUIZ & NAVIGATION
//=====================================================

//=====================================================
// START QUIZ
//=====================================================

function startQuiz(){

    studentName = studentInput.value.trim();

    if(studentName===""){

        alert("Please enter your name.");

        return;

    }

    selectedTopic = topicSelect.value;

    if(selectedTopic===""){

        alert("Please choose a topic.");

        return;

    }

    selectedDifficulty = difficultySelect.value;

    if(selectedDifficulty===""){

        alert("Please choose a difficulty.");

        return;

    }

    questionFormat = formatSelect.value;

    timerEnabled = timerChoice.value==="yes";

    mixedMode = selectedTopic==="mixed";

    challengeMode = selectedTopic==="challenge";

    resetQuiz();

    welcomeScreen.classList.add("hidden");

    resultScreen.classList.add("hidden");

    quizScreen.classList.remove("hidden");

    document.getElementById("welcome-message").textContent =
    `Good Luck, ${studentName}!`;

    if(timerEnabled){

        timerBox.classList.remove("hidden");

    }

    else{

        timerBox.classList.add("hidden");

    }

    if(challengeMode){

        challengeLevel.classList.remove("hidden");

    }

    else{

        challengeLevel.classList.add("hidden");

    }

    updateDashboard();

    loadQuestion();

}

//=====================================================
// GO HOME
//=====================================================

function goBackHome(){

    stopTimer();

    welcomeScreen.classList.remove("hidden");

    quizScreen.classList.add("hidden");

    resultScreen.classList.add("hidden");

}

//=====================================================
// RESTART QUIZ
//=====================================================

function restartQuiz(){

    stopTimer();

    resetQuiz();

    startQuiz();

}

//=====================================================
// UPDATE DASHBOARD
//=====================================================

function updateDashboard(){

    scoreElement.textContent = score;

    streakElement.textContent = streak;

    bestStreakElement.textContent = bestStreak;

    questionNumberElement.textContent =
    currentQuestionNumber + 1;

    const progress =
    (currentQuestionNumber / TOTAL_QUESTIONS) * 100;

    progressFill.style.width =
    progress + "%";

}

//=====================================================
// START TIMER
//=====================================================

function startTimer(){

    if(!timerEnabled){

        return;

    }

    stopTimer();

    timer = QUESTION_TIME;

    timerText.textContent = timer;

    timerInterval = setInterval(()=>{

        timer--;

        timerText.textContent = timer;

        if(timer<=0){

            stopTimer();

            checkAnswer(true);

        }

    },1000);

}

//=====================================================
// STOP TIMER
//=====================================================

function stopTimer(){

    if(timerInterval){

        clearInterval(timerInterval);

        timerInterval = null;

    }

}

//=====================================================
// GET CHALLENGE DIFFICULTY
//=====================================================

function getChallengeDifficulty(){

    if(currentQuestionNumber<5){

        return "easy";

    }

    if(currentQuestionNumber<10){

        return "medium";

    }

    if(currentQuestionNumber<15){

        return "hard";

    }

    return "expert";

}

//=====================================================
// GET RANDOM TOPIC
//=====================================================

function getRandomTopic(){

    return mixedTopics[
        rand(0,mixedTopics.length-1)
    ];

}

//=====================================================
// END PART 2
//=====================================================
//=====================================================
// PART 3A
// LOAD QUESTIONS
//=====================================================

//=====================================================
// LOAD QUESTION
//=====================================================

function loadQuestion(){

    stopTimer();

    answered = false;

    feedbackElement.innerHTML = "";

    explanationElement.innerHTML = "";

    explanationElement.classList.add("hidden");

    hintBox.innerHTML = "";

    hintBox.classList.add("hidden");

    answerInput.value = "";

    mcqOptions.innerHTML = "";

    //-------------------------------------------------
    // QUIZ FINISHED?
    //-------------------------------------------------

    if(currentQuestionNumber >= TOTAL_QUESTIONS){

        showResults();

        return;

    }

    //-------------------------------------------------
    // SELECT TOPIC
    //-------------------------------------------------

    let topic = selectedTopic;

    if(mixedMode){

        topic = getRandomTopic();

    }

    //-------------------------------------------------
    // SELECT DIFFICULTY
    //-------------------------------------------------

    let difficulty = selectedDifficulty;

    if(challengeMode){

        difficulty = getChallengeDifficulty();

        challengeText.textContent =
        difficulty.toUpperCase();

    }

    //-------------------------------------------------
    // GET GENERATOR
    //-------------------------------------------------

    const generator = questionGenerators[topic];

    if(!generator){

        alert("Generator not found for " + topic);

        return;

    }

    //-------------------------------------------------
    // GENERATE QUESTION
    //-------------------------------------------------

    currentQuestion = generator(difficulty);

    //-------------------------------------------------
    // AVOID DUPLICATES
    //-------------------------------------------------

    let attempts = 0;

    while(

        askedQuestions.includes(currentQuestion.question)

        &&

        attempts < 50

    ){

        currentQuestion = generator(difficulty);

        attempts++;

    }

    askedQuestions.push(

        currentQuestion.question

    );

    //-------------------------------------------------
    // UPDATE DASHBOARD
    //-------------------------------------------------

    updateDashboard();

    //-------------------------------------------------
    // DISPLAY QUESTION
    //-------------------------------------------------

    displayQuestion();

    //-------------------------------------------------
    // TIMER
    //-------------------------------------------------

    if(timerEnabled){

        startTimer();

    }

}
//=====================================================
// PART 3B
// DISPLAY QUESTION
//=====================================================

//=====================================================
// DISPLAY QUESTION
//=====================================================

function displayQuestion(){

    //-------------------------------------------------
    // QUESTION NUMBER
    //-------------------------------------------------

    questionNumberElement.textContent =
    currentQuestionNumber + 1;

    //-------------------------------------------------
    // QUESTION TEXT
    //-------------------------------------------------

    questionElement.textContent =
    currentQuestion.question;

    //-------------------------------------------------
    // QUESTION TYPE
    //-------------------------------------------------

    const typeBox =
    document.getElementById("question-type");

    if(typeBox){

        let label = "";

        if(currentQuestion.type==="word"){

            label = "📖 Word Problem";

        }

        else{

            label = "🧮 Direct Question";

        }

        label +=
        " • " +
        currentQuestion.difficulty.toUpperCase();

        typeBox.textContent = label;

    }

    //-------------------------------------------------
    // CLEAR PREVIOUS
    //-------------------------------------------------

    feedbackElement.innerHTML = "";

    explanationElement.innerHTML = "";

    explanationElement.classList.add("hidden");

    hintBox.innerHTML = "";

    hintBox.classList.add("hidden");

    mcqOptions.innerHTML = "";

    answerInput.value = "";

    //-------------------------------------------------
    // MCQ MODE
    //-------------------------------------------------

    if(questionFormat==="mcq"){

        descriptiveArea.classList.add("hidden");

        mcqArea.classList.remove("hidden");

        renderMCQ();

    }

    //-------------------------------------------------
    // DESCRIPTIVE MODE
    //-------------------------------------------------

    else{

        mcqArea.classList.add("hidden");

        descriptiveArea.classList.remove("hidden");

        answerInput.focus();

    }

}

//=====================================================
// RENDER MCQ
//=====================================================

function renderMCQ(){

    if(!currentQuestion.options){

        currentQuestion.options = [

            currentQuestion.answer,

            currentQuestion.answer + 1,

            currentQuestion.answer - 1,

            currentQuestion.answer + 2

        ];

    }

    currentQuestion.options.forEach(option=>{

        const button =
        document.createElement("button");

        button.className = "mcq-option";

        button.textContent = option;

        button.onclick = ()=>{

            if(answered){

                return;

            }

            answerInput.value = option;

            checkAnswer();

        };

        mcqOptions.appendChild(button);

    });

}

//=====================================================
// HIGHLIGHT SELECTED MCQ
//=====================================================

function highlightCorrectAnswer(){

    const buttons =
    mcqOptions.querySelectorAll("button");

    buttons.forEach(button=>{

        if(

            String(button.textContent)===

            String(currentQuestion.answer)

        ){

            button.classList.add("correct");

        }

    });

}

//=====================================================
// DISABLE MCQs
//=====================================================

function disableMCQButtons(){

    const buttons =
    mcqOptions.querySelectorAll("button");

    buttons.forEach(button=>{

        button.disabled = true;

    });

}

//=====================================================
// ENABLE MCQs
//=====================================================

function enableMCQButtons(){

    const buttons =
    mcqOptions.querySelectorAll("button");

    buttons.forEach(button=>{

        button.disabled = false;

    });

}

//=====================================================
// NEXT QUESTION
//=====================================================

function nextQuestion(){

    stopTimer();

    currentQuestionNumber++;

    loadQuestion();

}

//=====================================================
// ENTER KEY SUPPORT
//=====================================================

answerInput.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        if(answered){

            return;

        }

        checkAnswer();

    }

});

//=====================================================
// END PART 3B
//=====================================================
//=====================================================
// PART 4A
// CHECK ANSWER & UPDATE SCORE
//=====================================================

function checkAnswer(timeUp = false){

    if(answered){

        return;

    }

    answered = true;

    stopTimer();

    let userAnswer;

    if(timeUp){

        userAnswer = "__TIME_UP__";

    }

    else{

        userAnswer = answerInput.value.trim();

        if(questionFormat==="mcq"){

            disableMCQButtons();

        }

    }

    const correctAnswer = String(currentQuestion.answer).trim();

    const isCorrect =
        String(userAnswer).toLowerCase() ===
        correctAnswer.toLowerCase();

    //-------------------------------------------------
    // CORRECT ANSWER
    //-------------------------------------------------

    if(isCorrect){

        score++;

        streak++;

        xp += XP_PER_CORRECT;

        if(streak > bestStreak){

            bestStreak = streak;

        }

        level = Math.floor(xp / 100) + 1;

        feedbackElement.innerHTML =
        "<div class='correct-feedback'>✅ Correct!</div>";

        feedbackElement.classList.remove("shake");

        feedbackElement.classList.add("pulse");

    }

    //-------------------------------------------------
    // WRONG ANSWER
    //-------------------------------------------------

    else{

        streak = 0;

        feedbackElement.innerHTML =
        `<div class="wrong-feedback">
        ❌ Incorrect.<br>
        Correct Answer: <strong>${currentQuestion.answer}</strong>
        </div>`;

        feedbackElement.classList.remove("pulse");

        feedbackElement.classList.add("shake");

        if(questionFormat==="mcq"){

            highlightCorrectAnswer();

        }

    }

    //-------------------------------------------------
    // UPDATE DASHBOARD
    //-------------------------------------------------

    updateDashboard();

    //-------------------------------------------------
    // SHOW EXPLANATION
    //-------------------------------------------------

    showExplanation();

    //-------------------------------------------------
    // NEXT QUESTION AFTER 2.5 SECONDS
    //-------------------------------------------------

    setTimeout(()=>{

        currentQuestionNumber++;

        loadQuestion();

    },2500);

}

//=====================================================
// SHOW EXPLANATION
//=====================================================

function showExplanation(){

    explanationElement.classList.remove("hidden");

    if(currentQuestion.explanation){

        explanationElement.innerHTML =

        `<h3>Explanation</h3>
         <p>${currentQuestion.explanation}</p>`;

    }

    else{

        explanationElement.innerHTML =

        `<h3>Explanation</h3>
         <p>No explanation available.</p>`;

    }

}

//=====================================================
// SHOW HINT
//=====================================================

function showHint(){

    hintBox.classList.remove("hidden");

    if(currentQuestion.hint){

        hintBox.innerHTML =

        `<strong>Hint:</strong><br>
        ${currentQuestion.hint}`;

    }

    else{

        hintBox.innerHTML =

        "💡 Try solving step by step.";

    }

}

//=====================================================
// UPDATE SCORE DISPLAY
//=====================================================

function updateDashboard(){

    scoreElement.textContent = score;

    streakElement.textContent = streak;

    bestStreakElement.textContent = bestStreak;

    questionNumberElement.textContent =
    currentQuestionNumber + 1;

    progressFill.style.width =
    ((currentQuestionNumber) /
    TOTAL_QUESTIONS) * 100 + "%";

}
//=====================================================
// PART 4B
// RESULT SCREEN
//=====================================================

function showResults(){

    stopTimer();

    quizFinished = true;

    quizScreen.classList.add("hidden");

    resultScreen.classList.remove("hidden");

    //--------------------------------------------------
    // SCORE
    //--------------------------------------------------

    finalScore.textContent = score;

    finalTotal.textContent = TOTAL_QUESTIONS;

    const percentage = Math.round(

        (score / TOTAL_QUESTIONS) * 100

    );

    finalPercentage.textContent =

        percentage + "%";

    //--------------------------------------------------
    // FEEDBACK
    //--------------------------------------------------

    if(percentage>=90){

        personalFeedback.textContent=

        "Outstanding work! You have excellent mathematical skills.";

    }

    else if(percentage>=75){

        personalFeedback.textContent=

        "Great job! Keep practising to become even better.";

    }

    else if(percentage>=50){

        personalFeedback.textContent=

        "Good effort. A little more practice will improve your score.";

    }

    else{

        personalFeedback.textContent=

        "Don't worry! Every expert started as a beginner. Keep practising.";

    }

    //--------------------------------------------------
    // STRENGTH
    //--------------------------------------------------

    if(bestStreak>=10){

        strengthText.textContent=

        "Excellent consistency. You maintained a long correct-answer streak.";

    }

    else if(score>=15){

        strengthText.textContent=

        "Strong understanding of this topic.";

    }

    else{

        strengthText.textContent=

        "You attempted every question. That's a great habit!";

    }

    //--------------------------------------------------
    // PRACTICE
    //--------------------------------------------------

    if(percentage>=85){

        practiceText.textContent=

        "Try Challenge Mode next.";

    }

    else if(percentage>=60){

        practiceText.textContent=

        "Revise medium difficulty questions.";

    }

    else{

        practiceText.textContent=

        "Start with Easy mode and practise daily.";

    }

    //--------------------------------------------------
    // BADGES
    //--------------------------------------------------

    badgeContainer.innerHTML="";

    if(score===20){

        addBadge("🏆","Perfect Score");

    }

    if(bestStreak>=5){

        addBadge("🔥","Hot Streak");

    }

    if(percentage>=90){

        addBadge("⭐","Math Genius");

    }

    if(timerEnabled){

        addBadge("⏰","Beat The Clock");

    }

    if(challengeMode){

        addBadge("🚀","Challenge Player");

    }

}

///////////////////////////////////////////////////////
// ADD BADGE
///////////////////////////////////////////////////////

function addBadge(icon,title){

    const badge=document.createElement("div");

    badge.className="badge";

    badge.innerHTML=`

        <div class="badge-icon">

            ${icon}

        </div>

        <div class="badge-title">

            ${title}

        </div>

    `;

    badgeContainer.appendChild(badge);

}
//=====================================================
// PART 5
// XP • LEVELS • BADGES • STATISTICS
//=====================================================

//=====================================================
// PLAYER STATS
//=====================================================

let totalCorrect = 0;
let totalWrong = 0;
let totalAnswered = 0;
let combo = 0;
let highestCombo = 0;

//=====================================================
// UPDATE PLAYER STATS
//=====================================================

function updatePlayerStats(correct){

    totalAnswered++;

    if(correct){

        totalCorrect++;

        combo++;

        xp += XP_PER_CORRECT;

        if(combo > highestCombo){

            highestCombo = combo;

        }

    }

    else{

        totalWrong++;

        combo = 0;

    }

    level = Math.floor(xp / 100) + 1;

}

//=====================================================
// CALCULATE ACCURACY
//=====================================================

function getAccuracy(){

    if(totalAnswered===0){

        return 0;

    }

    return Math.round(

        (totalCorrect / totalAnswered) * 100

    );

}

//=====================================================
// XP REQUIRED FOR NEXT LEVEL
//=====================================================

function xpForNextLevel(){

    return level * 100;

}

//=====================================================
// XP REMAINING
//=====================================================

function xpRemaining(){

    return xpForNextLevel() - xp;

}

//=====================================================
// SHOW LEVEL POPUP
//=====================================================

function showLevelUp(){

    const popup=document.createElement("div");

    popup.className="level-popup";

    popup.innerHTML=`

        <h2>🎉 Level Up!</h2>

        <h3>Level ${level}</h3>

    `;

    document.body.appendChild(popup);

    setTimeout(()=>{

        popup.remove();

    },2500);

}

//=====================================================
// CHECK LEVEL UP
//=====================================================

let previousLevel = 1;

function checkLevel(){

    if(level > previousLevel){

        previousLevel = level;

        showLevelUp();

    }

}

//=====================================================
// BADGE SYSTEM
//=====================================================

function unlockBadges(){

    if(score===5){

        addBadge("🥉","5 Correct");

    }

    if(score===10){

        addBadge("🥈","10 Correct");

    }

    if(score===15){

        addBadge("🥇","15 Correct");

    }

    if(score===20){

        addBadge("👑","Perfect Score");

    }

    if(highestCombo>=5){

        addBadge("🔥","Combo Master");

    }

    if(getAccuracy()>=90){

        addBadge("🎯","Accuracy Expert");

    }

    if(level>=5){

        addBadge("⭐","Level 5");

    }

}

//=====================================================
// LIVE STATS
//=====================================================

function updateLiveStats(){

    const accuracy=getAccuracy();

    console.log(

        "Accuracy:",accuracy+"%",

        "| XP:",xp,

        "| Level:",level,

        "| Combo:",combo

    );

}

//=====================================================
// PLAYER SUMMARY
//=====================================================

function getPlayerSummary(){

    return{

        score:score,

        level:level,

        xp:xp,

        accuracy:getAccuracy(),

        combo:highestCombo,

        badges:earnedBadges

    };

}

//=====================================================
// SAVE PROGRESS
//=====================================================

function saveProgress(){

    const data={

        xp,

        level,

        highestCombo,

        totalCorrect,

        totalWrong,

        totalAnswered,

        bestStreak

    };

    localStorage.setItem(

        "mathmind-progress",

        JSON.stringify(data)

    );

}

//=====================================================
// LOAD PROGRESS
//=====================================================

function loadProgress(){

    const data=

    JSON.parse(

        localStorage.getItem(

            "mathmind-progress"

        )

    );

    if(!data){

        return;

    }

    xp=data.xp || 0;

    level=data.level || 1;

    highestCombo=data.highestCombo || 0;

    totalCorrect=data.totalCorrect || 0;

    totalWrong=data.totalWrong || 0;

    totalAnswered=data.totalAnswered || 0;

    bestStreak=data.bestStreak || 0;

}

//=====================================================
// RESET PLAYER STATS
//=====================================================

function resetPlayerStats(){

    totalCorrect=0;

    totalWrong=0;

    totalAnswered=0;

    combo=0;

    highestCombo=0;

}

//=====================================================
// END PART 5
//=====================================================
//=====================================================
// PART 6
// TIMER • PROGRESS • QUESTION FLOW
//=====================================================

//=====================================================
// UPDATE PROGRESS BAR
//=====================================================

function updateProgressBar(){

    const progress =
        (currentQuestionNumber / TOTAL_QUESTIONS) * 100;

    progressFill.style.width = progress + "%";

}

//=====================================================
// UPDATE QUESTION COUNTER
//=====================================================

function updateQuestionCounter(){

    questionNumberElement.textContent =
    Math.min(currentQuestionNumber + 1, TOTAL_QUESTIONS);

}

//=====================================================
// UPDATE ALL UI
//=====================================================

function refreshUI(){

    updateDashboard();

    updateProgressBar();

    updateQuestionCounter();

}

//=====================================================
// RESET QUESTION SCREEN
//=====================================================

function resetQuestionUI(){

    answered = false;

    answerInput.value = "";

    feedbackElement.innerHTML = "";

    explanationElement.innerHTML = "";

    explanationElement.classList.add("hidden");

    hintBox.innerHTML = "";

    hintBox.classList.add("hidden");

    mcqOptions.innerHTML = "";

}

//=====================================================
// START QUESTION
//=====================================================

function startQuestion(){

    resetQuestionUI();

    refreshUI();

    if(timerEnabled){

        startTimer();

    }

}

//=====================================================
// GO TO NEXT QUESTION
//=====================================================

function nextQuestion(){

    stopTimer();

    currentQuestionNumber++;

    if(currentQuestionNumber >= TOTAL_QUESTIONS){

        showResults();

        return;

    }

    loadQuestion();

}

//=====================================================
// SKIP QUESTION
//=====================================================

function skipQuestion(){

    streak = 0;

    totalWrong++;

    totalAnswered++;

    nextQuestion();

}

//=====================================================
// TIMER WARNING
//=====================================================

function timerWarning(){

    if(timer <= 5){

        timerText.style.color = "red";

    }

    else{

        timerText.style.color = "";

    }

}

//=====================================================
// OVERRIDE START TIMER
//=====================================================

function startTimer(){

    if(!timerEnabled){

        return;

    }

    stopTimer();

    timer = QUESTION_TIME;

    timerText.textContent = timer;

    timerWarning();

    timerInterval = setInterval(()=>{

        timer--;

        timerText.textContent = timer;

        timerWarning();

        if(timer <= 0){

            stopTimer();

            checkAnswer(true);

        }

    },1000);

}

//=====================================================
// ENABLE ENTER KEY
//=====================================================

document.addEventListener("keydown",function(e){

    if(

        quizScreen.classList.contains("hidden")

    ){

        return;

    }

    if(questionFormat==="descriptive"){

        if(e.key==="Enter"){

            if(!answered){

                checkAnswer();

            }

        }

    }

});

//=====================================================
// AUTO FOCUS
//=====================================================

function focusInput(){

    if(questionFormat==="descriptive"){

        answerInput.focus();

    }

}

//=====================================================
// LOADING ANIMATION
//=====================================================

function animateQuestion(){

    questionElement.classList.remove("fade-in");

    void questionElement.offsetWidth;

    questionElement.classList.add("fade-in");

}

//=====================================================
// OVERRIDE DISPLAY QUESTION
//=====================================================

const originalDisplayQuestion = displayQuestion;

displayQuestion = function(){

    originalDisplayQuestion();

    animateQuestion();

    focusInput();

};

//=====================================================
// SHOW SCORE DURING QUIZ
//=====================================================

function updateLiveHeader(){

    scoreElement.textContent = score;

    streakElement.textContent = streak;

    bestStreakElement.textContent = bestStreak;

}

//=====================================================
// END PART 6
//=====================================================
//=====================================================
// PART 7
// ADVANCED RESULT ANALYSIS
//=====================================================

//===============================================
// TOPIC PERFORMANCE
//===============================================

let topicStats = {};

function initializeTopic(topic){

    if(!topicStats[topic]){

        topicStats[topic]={

            correct:0,
            wrong:0

        };

    }

}

function recordTopicResult(topic,isCorrect){

    initializeTopic(topic);

    if(isCorrect){

        topicStats[topic].correct++;

    }

    else{

        topicStats[topic].wrong++;

    }

}

//===============================================
// ACCURACY
//===============================================

function calculateAccuracy(){

    if(totalAnswered===0){

        return 0;

    }

    return Math.round(

        totalCorrect*100/totalAnswered

    );

}

//===============================================
// STRONGEST TOPIC
//===============================================

function getStrongestTopic(){

    let best="None";

    let highest=-1;

    for(const topic in topicStats){

        const score=topicStats[topic].correct;

        if(score>highest){

            highest=score;

            best=topic;

        }

    }

    return best;

}

//===============================================
// WEAKEST TOPIC
//===============================================

function getWeakestTopic(){

    let weak="None";

    let highestWrong=-1;

    for(const topic in topicStats){

        const score=topicStats[topic].wrong;

        if(score>highestWrong){

            highestWrong=score;

            weak=topic;

        }

    }

    return weak;

}

//===============================================
// PERFORMANCE MESSAGE
//===============================================

function generatePerformanceMessage(){

    const accuracy=calculateAccuracy();

    if(accuracy>=95){

        return "Outstanding! You have mastered this quiz.";

    }

    if(accuracy>=85){

        return "Excellent work! Keep challenging yourself.";

    }

    if(accuracy>=70){

        return "Great effort. A little more practice will make you even stronger.";

    }

    if(accuracy>=50){

        return "Good attempt. Revise the weak areas and try again.";

    }

    return "Keep practising. Every attempt makes you better.";

}

//===============================================
// UPDATE RESULT DETAILS
//===============================================

function updateResultDetails(){

    if(document.getElementById("strength-text")){

        strengthText.textContent=

        "Strongest Topic: "+getStrongestTopic();

    }

    if(document.getElementById("practice-text")){

        practiceText.textContent=

        "Needs Practice: "+getWeakestTopic();

    }

    if(document.getElementById("personal-feedback-text")){

        personalFeedback.textContent=

        generatePerformanceMessage();

    }

}

//===============================================
// QUIZ SUMMARY
//===============================================

function getQuizSummary(){

    return{

        student:studentName,

        score:score,

        total:TOTAL_QUESTIONS,

        accuracy:calculateAccuracy(),

        level:level,

        xp:xp,

        bestStreak:bestStreak,

        strongest:getStrongestTopic(),

        weakest:getWeakestTopic()

    };

}

//===============================================
// PRINT SUMMARY
//===============================================

function printSummary(){

    console.table(

        getQuizSummary()

    );

}

//===============================================
// SHARE MESSAGE
//===============================================

function getShareMessage(){

    const s=getQuizSummary();

    return `${s.student} scored ${s.score}/${s.total} (${s.accuracy}%) on MathMind AI!`;

}

//===============================================
// COPY RESULT
//===============================================

function copyResult(){

    navigator.clipboard.writeText(

        getShareMessage()

    );

}

//===============================================
// CALL THIS INSIDE showResults()
//===============================================

// updateResultDetails();
// printSummary();


//=====================================================
// END PART 7
//=====================================================
//=====================================================
// PART 8
// LOCAL STORAGE • LIFETIME STATS • SETTINGS
//=====================================================

//=====================================================
// LIFETIME STATISTICS
//=====================================================

let lifetimeStats={

    quizzesPlayed:0,

    totalQuestions:0,

    totalCorrect:0,

    totalXP:0,

    highestLevel:1

};

//=====================================================
// LOAD LIFETIME STATS
//=====================================================

function loadLifetimeStats(){

    const saved=

    localStorage.getItem("mathmind-lifetime");

    if(saved){

        lifetimeStats=JSON.parse(saved);

    }

}

//=====================================================
// SAVE LIFETIME STATS
//=====================================================

function saveLifetimeStats(){

    localStorage.setItem(

        "mathmind-lifetime",

        JSON.stringify(lifetimeStats)

    );

}

//=====================================================
// UPDATE LIFETIME STATS
//=====================================================

function updateLifetimeStats(){

    lifetimeStats.quizzesPlayed++;

    lifetimeStats.totalQuestions+=TOTAL_QUESTIONS;

    lifetimeStats.totalCorrect+=score;

    lifetimeStats.totalXP+=xp;

    if(level>lifetimeStats.highestLevel){

        lifetimeStats.highestLevel=level;

    }

    saveLifetimeStats();

}

//=====================================================
// GET LIFETIME ACCURACY
//=====================================================

function getLifetimeAccuracy(){

    if(lifetimeStats.totalQuestions===0){

        return 0;

    }

    return Math.round(

        lifetimeStats.totalCorrect*100/

        lifetimeStats.totalQuestions

    );

}

//=====================================================
// DAILY STREAK
//=====================================================

function updateDailyStreak(){

    const today=

    new Date().toDateString();

    const last=

    localStorage.getItem("mathmind-last-day");

    let streak=

    Number(localStorage.getItem("mathmind-daily"))||0;

    if(last!==today){

        streak++;

        localStorage.setItem(

            "mathmind-last-day",

            today

        );

        localStorage.setItem(

            "mathmind-daily",

            streak

        );

    }

}

//=====================================================
// GET DAILY STREAK
//=====================================================

function getDailyStreak(){

    return Number(

        localStorage.getItem("mathmind-daily")

    )||1;

}

//=====================================================
// RESET ALL SAVED DATA
//=====================================================

function resetAllProgress(){

    if(confirm("Reset all saved progress?")){

        localStorage.removeItem(

            "mathmind-progress"

        );

        localStorage.removeItem(

            "mathmind-lifetime"

        );

        localStorage.removeItem(

            "mathmind-last-day"

        );

        localStorage.removeItem(

            "mathmind-daily"

        );

        alert("Progress Cleared!");

    }

}

//=====================================================
// EXPORT RESULT
//=====================================================

function exportResult(){

    const summary=getQuizSummary();

    const text=`

Student : ${summary.student}

Score : ${summary.score}/${summary.total}

Accuracy : ${summary.accuracy}%

Level : ${summary.level}

XP : ${summary.xp}

Strongest Topic : ${summary.strongest}

Needs Practice : ${summary.weakest}

Generated by MathMind AI

`;

    const blob=

    new Blob(

        [text],

        {type:"text/plain"}

    );

    const url=

    URL.createObjectURL(blob);

    const a=

    document.createElement("a");

    a.href=url;

    a.download="MathMind_Result.txt";

    a.click();

    URL.revokeObjectURL(url);

}

//=====================================================
// SETTINGS
//=====================================================

const settings={

    sound:true,

    animation:true,

    autoNext:true

};

function saveSettings(){

    localStorage.setItem(

        "mathmind-settings",

        JSON.stringify(settings)

    );

}

function loadSettings(){

    const s=

    localStorage.getItem(

        "mathmind-settings"

    );

    if(s){

        Object.assign(

            settings,

            JSON.parse(s)

        );

    }

}

//=====================================================
// SHOW LIFETIME STATS
//=====================================================

function showLifetimeStats(){

    console.table({

        Quizzes:lifetimeStats.quizzesPlayed,

        Questions:lifetimeStats.totalQuestions,

        Correct:lifetimeStats.totalCorrect,

        Accuracy:getLifetimeAccuracy()+"%",

        XP:lifetimeStats.totalXP,

        HighestLevel:lifetimeStats.highestLevel,

        DailyStreak:getDailyStreak()

    });

}

//=====================================================
// END PART 8
//=====================================================
//=====================================================
// PART 9
// ANIMATIONS • SOUND • UTILITIES
//=====================================================

//=====================================================
// SOUND EFFECTS
//=====================================================

const sounds={

    correct:new Audio("sounds/correct.mp3"),

    wrong:new Audio("sounds/wrong.mp3"),

    finish:new Audio("sounds/finish.mp3")

};

function playSound(type){

    if(!settings.sound) return;

    if(sounds[type]){

        sounds[type].currentTime=0;

        sounds[type].play().catch(()=>{});

    }

}

//=====================================================
// CONFETTI
//=====================================================

function launchConfetti(){

    if(!settings.animation) return;

    for(let i=0;i<120;i++){

        const piece=document.createElement("div");

        piece.className="confetti";

        piece.style.left=Math.random()*100+"vw";

        piece.style.animationDelay=Math.random()*2+"s";

        piece.style.backgroundColor=

        `hsl(${Math.random()*360},80%,60%)`;

        document.body.appendChild(piece);

        setTimeout(()=>{

            piece.remove();

        },4000);

    }

}

//=====================================================
// SHAKE EFFECT
//=====================================================

function shakeElement(element){

    element.classList.add("shake");

    setTimeout(()=>{

        element.classList.remove("shake");

    },500);

}

//=====================================================
// PULSE EFFECT
//=====================================================

function pulseElement(element){

    element.classList.add("pulse");

    setTimeout(()=>{

        element.classList.remove("pulse");

    },500);

}

//=====================================================
// RANDOM MOTIVATION
//=====================================================

const motivationalQuotes=[

"Every expert was once a beginner.",

"Practice makes progress.",

"Mistakes help you learn.",

"You are smarter than you think.",

"One question at a time.",

"Keep solving. Keep growing.",

"Mathematics is the language of logic.",

"Great job! Never stop learning."

];

function randomMotivation(){

    return motivationalQuotes[

        rand(0,motivationalQuotes.length-1)

    ];

}

//=====================================================
// SHOW TOAST
//=====================================================

function showToast(message){

    const toast=document.createElement("div");

    toast.className="toast";

    toast.innerHTML=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },50);

    setTimeout(()=>{

        toast.remove();

    },3000);

}

//=====================================================
// CELEBRATE
//=====================================================

function celebrate(){

    playSound("finish");

    launchConfetti();

    showToast("🎉 Fantastic Work!");

}

//=====================================================
// SCORE GRADE
//=====================================================

function getGrade(){

    const accuracy=calculateAccuracy();

    if(accuracy>=95) return "A+";

    if(accuracy>=90) return "A";

    if(accuracy>=80) return "B";

    if(accuracy>=70) return "C";

    if(accuracy>=60) return "D";

    return "E";

}

//=====================================================
// ESTIMATED SKILL
//=====================================================

function getSkillLevel(){

    const accuracy=calculateAccuracy();

    if(accuracy>=90) return "Expert";

    if(accuracy>=75) return "Advanced";

    if(accuracy>=60) return "Intermediate";

    if(accuracy>=40) return "Beginner";

    return "Starter";

}

//=====================================================
// RESULT CARD
//=====================================================

function createResultCard(){

    return{

        student:studentName,

        grade:getGrade(),

        skill:getSkillLevel(),

        score:score,

        total:TOTAL_QUESTIONS,

        accuracy:calculateAccuracy(),

        xp:xp,

        level:level

    };

}

//=====================================================
// SHOW RESULT IN CONSOLE
//=====================================================

function printResultCard(){

    console.table(

        createResultCard()

    );

}

//=====================================================
// CALL AFTER QUIZ FINISH
//=====================================================

// celebrate();
//
// printResultCard();


//=====================================================
// END PART 9
//=====================================================
//=====================================================
// PART 10
// FINAL INITIALIZATION
//=====================================================

//=====================================================
// STARTUP CHECKS
//=====================================================

function startupChecks(){

    console.log("===================================");

    console.log("MathMind AI Initializing...");

    console.log("Questions Loaded:", typeof window.generateQuestion==="function");

    console.log("Addition:", typeof window.generateAdditionQuestion==="function");

    console.log("Subtraction:", typeof window.generateSubtractionQuestion==="function");

    console.log("Multiplication:", typeof window.generateMultiplicationQuestion==="function");

    console.log("Division:", typeof window.generateDivisionQuestion==="function");

    console.log("Fractions:", typeof window.generateFractionsQuestion==="function");

    console.log("Decimals:", typeof window.generateDecimalsQuestion==="function");

    console.log("Percentages:", typeof window.generatePercentagesQuestion==="function");

    console.log("Ratio:", typeof window.generateRatioQuestion==="function");

    console.log("Factors:", typeof window.generateFactorsQuestion==="function");

    console.log("Algebra:", typeof window.generateAlgebraQuestion==="function");

    console.log("===================================");

}

//=====================================================
// RESET UI
//=====================================================

function initializeUI(){

    quizScreen.classList.add("hidden");

    resultScreen.classList.add("hidden");

    welcomeScreen.classList.remove("hidden");

    feedbackElement.innerHTML="";

    explanationElement.innerHTML="";

    hintBox.innerHTML="";

    progressFill.style.width="0%";

    scoreElement.textContent="0";

    streakElement.textContent="0";

    bestStreakElement.textContent="0";

}

//=====================================================
// LOAD USER DATA
//=====================================================

function initializeStorage(){

    loadProgress();

    loadLifetimeStats();

    loadSettings();

}

//=====================================================
// REGISTER EVENTS
//=====================================================

function registerEvents(){

    answerInput.addEventListener("keypress",function(e){

        if(e.key==="Enter"){

            if(!answered){

                checkAnswer();

            }

        }

    });

}

//=====================================================
// RESET QUIZ
//=====================================================

function resetQuizData(){

    currentQuestionNumber=0;

    score=0;

    streak=0;

    answered=false;

    quizFinished=false;

    resetPlayerStats();

}

//=====================================================
// RESTART
//=====================================================

function restartQuiz(){

    stopTimer();

    resetQuizData();

    initializeUI();

}

//=====================================================
// BACK HOME
//=====================================================

function goBackHome(){

    stopTimer();

    welcomeScreen.classList.remove("hidden");

    quizScreen.classList.add("hidden");

    resultScreen.classList.add("hidden");

}

//=====================================================
// VERSION
//=====================================================

const APP_VERSION="MathMind AI v1.0";

//=====================================================
// READY
//=====================================================

document.addEventListener("DOMContentLoaded",()=>{

    startupChecks();

    initializeStorage();

    initializeUI();

    registerEvents();

    console.log(APP_VERSION);

    console.log("MathMind AI Ready!");

});

//=====================================================
// EXPORTS
//=====================================================

window.startQuiz=startQuiz;

window.checkAnswer=checkAnswer;

window.restartQuiz=restartQuiz;

window.goBackHome=goBackHome;

window.showHint=showHint;

//=====================================================
// END OF FILE
//=====================================================

console.log("===================================");

console.log("MathMind AI Successfully Loaded");

console.log("Developed by Shouryarghya Patra");

console.log("===================================");
