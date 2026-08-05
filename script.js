/* =====================================================
   MATHMIND AI
   COMPLETE JAVASCRIPT WITH DESCRIPTIVE + MCQ MODE
===================================================== */


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let selectedTopic = "";
let selectedDifficulty = "";
let selectedQuestionFormat = "descriptive";

let studentName = "";

let timerEnabled = false;
let timeLeft = 30;
let timerInterval = null;

let currentQuestion = 0;

const totalQuestions = 20;

let score = 0;

let streak = 0;
let bestStreak = 0;

let currentAnswer = 0;

let currentQuestionText = "";

let currentHint = "";

let currentExplanation = "";

let currentQuestionIsWordProblem = false;

let questionAnswered = false;

let quizResults = [];

let currentMCQOptions = [];


/* =====================================================
   HELPER FUNCTIONS
===================================================== */

function randomNumber(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


function gcd(a, b) {

    a = Math.abs(a);

    b = Math.abs(b);

    while (b !== 0) {

        const temporary = b;

        b = a % b;

        a = temporary;

    }

    return a;

}


function simplifyFraction(
    numerator,
    denominator
) {

    const divisor =
        gcd(
            numerator,
            denominator
        );

    return {

        numerator:
            numerator / divisor,

        denominator:
            denominator / divisor

    };

}


function formatNumber(number) {

    if (
        Number.isInteger(number)
    ) {

        return number.toString();

    }

    return Number(
        number.toFixed(4)
    ).toString();

}


function shuffleArray(array) {

    for (
        let i =
            array.length - 1;

        i > 0;

        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        const temporary =
            array[i];


        array[i] =
            array[randomIndex];


        array[randomIndex] =
            temporary;

    }

    return array;

}


function answersAreEqual(
    first,
    second
) {

    return (
        Math.abs(
            Number(first) -
            Number(second)
        ) < 0.0001
    );

}


function getChallengeDifficulty() {

    if (
        currentQuestion < 5
    ) {

        return "easy";

    }


    if (
        currentQuestion < 10
    ) {

        return "medium";

    }


    if (
        currentQuestion < 15
    ) {

        return "hard";

    }


    return "expert";

}


/* =====================================================
   START QUIZ
===================================================== */

function startQuiz() {

    studentName =
        document
        .getElementById(
            "student-name"
        )
        .value
        .trim();


    selectedTopic =
        document
        .getElementById(
            "topic"
        )
        .value;


    selectedDifficulty =
        document
        .getElementById(
            "difficulty"
        )
        .value;


    selectedQuestionFormat =
        document
        .getElementById(
            "question-format"
        )
        .value;


    timerEnabled =
        document
        .getElementById(
            "timer-choice"
        )
        .value === "yes";


    if (
        studentName === ""
    ) {

        alert(
            "Please enter your name."
        );

        return;

    }


    if (
        selectedTopic === ""
    ) {

        alert(
            "Please select a topic."
        );

        return;

    }


    if (
        selectedTopic !==
        "challenge" &&
        selectedDifficulty === ""
    ) {

        alert(
            "Please select a difficulty."
        );

        return;

    }


    currentQuestion = 0;

    score = 0;

    streak = 0;

    bestStreak = 0;

    quizResults = [];


    document
        .getElementById(
            "welcome-screen"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "result-screen"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "quiz-screen"
        )
        .classList
        .remove("hidden");


    document
        .getElementById(
            "welcome-message"
        )
        .textContent =
        "Good luck, " +
        studentName +
        "!";


    if (
        timerEnabled
    ) {

        document
            .getElementById(
                "timer-box"
            )
            .classList
            .remove("hidden");

    }

    else {

        document
            .getElementById(
                "timer-box"
            )
            .classList
            .add("hidden");

    }


    if (
        selectedTopic ===
        "challenge"
    ) {

        document
            .getElementById(
                "challenge-level"
            )
            .classList
            .remove("hidden");

    }

    else {

        document
            .getElementById(
                "challenge-level"
            )
            .classList
            .add("hidden");

    }


    updateStats();

    generateQuestion();

}


/* =====================================================
   UPDATE STATS
===================================================== */

function updateStats() {

    document
        .getElementById(
            "score"
        )
        .textContent =
        score;


    document
        .getElementById(
            "streak"
        )
        .textContent =
        streak;


    document
        .getElementById(
            "best-streak"
        )
        .textContent =
        bestStreak;


    document
        .getElementById(
            "question-number"
        )
        .textContent =
        Math.min(
            currentQuestion + 1,
            totalQuestions
        );


    const progress =

        (
            currentQuestion /
            totalQuestions
        ) * 100;


    document
        .getElementById(
            "progress-fill"
        )
        .style
        .width =
        progress + "%";

}


/* =====================================================
   GENERATE QUESTION
===================================================== */

function generateQuestion() {

    clearInterval(
        timerInterval
    );


    questionAnswered = false;

    currentQuestionIsWordProblem =
        false;


    const answerInput =
        document
        .getElementById(
            "answer"
        );


    answerInput.value = "";

    answerInput.disabled =
        false;


    document
        .getElementById(
            "feedback"
        )
        .textContent =
        "";


    document
        .getElementById(
            "feedback"
        )
        .className =
        "feedback";


    document
        .getElementById(
            "explanation"
        )
        .textContent =
        "";


    document
        .getElementById(
            "explanation"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "hint-box"
        )
        .textContent =
        "";


    document
        .getElementById(
            "hint-box"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "mcq-options"
        )
        .innerHTML =
        "";


    let activeDifficulty =
        selectedDifficulty;


    if (
        selectedTopic ===
        "challenge"
    ) {

        activeDifficulty =
            getChallengeDifficulty();


        document
            .getElementById(
                "challenge-level-text"
            )
            .textContent =

            activeDifficulty
            .charAt(0)
            .toUpperCase()

            +

            activeDifficulty
            .slice(1);

    }


    /*
       Expert uses hard-level
       question generation.
    */

    if (
        activeDifficulty ===
        "expert"
    ) {

        activeDifficulty =
            "hard";

    }


    let activeTopic =
        selectedTopic;


    if (
        selectedTopic ===
        "mixed" ||

        selectedTopic ===
        "challenge"
    ) {

        const topics = [

            "addition",

            "subtraction",

            "multiplication",

            "division",

            "fractions",

            "decimals",

            "percentages",

            "ratio",

            "factors"

        ];


        activeTopic =

            topics[
                randomNumber(
                    0,
                    topics.length - 1
                )
            ];

    }


    const useWordProblem =

        Math.random() < 0.35;


    if (
        useWordProblem
    ) {

        generateWordProblem(
            activeTopic,
            activeDifficulty
        );

    }

    else {

        generateNormalQuestion(
            activeTopic,
            activeDifficulty
        );

    }


    document
        .getElementById(
            "question"
        )
        .textContent =
        currentQuestionText;


    if (
        currentQuestionIsWordProblem
    ) {

        document
            .getElementById(
                "question-type"
            )
            .textContent =
            "📖 Word Problem";

    }

    else {

        document
            .getElementById(
                "question-type"
            )
            .textContent =
            "🧮 Maths Question";

    }


    setupQuestionFormat();


    updateStats();


    if (
        timerEnabled
    ) {

        startTimer();

    }


    if (
        selectedQuestionFormat ===
        "descriptive"
    ) {

        setTimeout(
            function () {

                answerInput.focus();

            },
            100
        );

    }

}


/* =====================================================
   DESCRIPTIVE OR MCQ DISPLAY
===================================================== */

function setupQuestionFormat() {

    const descriptiveArea =
        document
        .getElementById(
            "descriptive-answer-area"
        );


    const mcqArea =
        document
        .getElementById(
            "mcq-answer-area"
        );


    if (
        selectedQuestionFormat ===
        "mcq"
    ) {

        descriptiveArea
            .classList
            .add("hidden");


        mcqArea
            .classList
            .remove("hidden");


        createMCQOptions();

    }

    else {

        descriptiveArea
            .classList
            .remove("hidden");


        mcqArea
            .classList
            .add("hidden");

    }

}


/* =====================================================
   CREATE FOUR MCQ OPTIONS
===================================================== */

function createMCQOptions() {

    const options = [

        Number(
            currentAnswer
        )

    ];


    let attempts = 0;


    while (
        options.length < 4 &&
        attempts < 100
    ) {

        attempts++;


        const answer =
            Number(
                currentAnswer
            );


        let difference;


        if (
            Math.abs(answer) < 10
        ) {

            difference =
                randomNumber(
                    1,
                    5
                );

        }

        else if (
            Math.abs(answer) < 100
        ) {

            difference =
                randomNumber(
                    2,
                    20
                );

        }

        else if (
            Math.abs(answer) < 1000
        ) {

            difference =
                randomNumber(
                    10,
                    100
                );

        }

        else {

            difference =
                randomNumber(
                    50,
                    Math.max(
                        100,
                        Math.round(
                            Math.abs(answer) *
                            0.15
                        )
                    )
                );

        }


        const direction =

            Math.random() < 0.5

            ?

            -1

            :

            1;


        let wrongAnswer =

            answer +

            (
                difference *
                direction
            );


        if (
            answer % 1 !== 0
        ) {

            wrongAnswer =
                Number(
                    wrongAnswer
                    .toFixed(2)
                );

        }

        else {

            wrongAnswer =
                Math.round(
                    wrongAnswer
                );

        }


        if (
            wrongAnswer < 0
        ) {

            wrongAnswer =
                Math.abs(
                    wrongAnswer
                ) +
                difference;

        }


        let alreadyExists =
            false;


        for (
            let i = 0;

            i < options.length;

            i++
        ) {

            if (
                answersAreEqual(
                    options[i],
                    wrongAnswer
                )
            ) {

                alreadyExists =
                    true;

            }

        }


        if (
            !alreadyExists
        ) {

            options.push(
                wrongAnswer
            );

        }

    }


    currentMCQOptions =
        shuffleArray(
            options
        );


    const container =
        document
        .getElementById(
            "mcq-options"
        );


    container.innerHTML =
        "";


    const letters =

        [
            "A",
            "B",
            "C",
            "D"
        ];


    for (
        let i = 0;

        i <
        currentMCQOptions.length;

        i++
    ) {

        const optionButton =

            document
            .createElement(
                "button"
            );


        optionButton.type =
            "button";


        optionButton.className =
            "mcq-option";


        optionButton.textContent =

            letters[i] +

            ". " +

            formatNumber(
                currentMCQOptions[i]
            );


        optionButton.dataset.value =

            currentMCQOptions[i];


        optionButton.addEventListener(

            "click",

            function () {

                selectMCQAnswer(
                    Number(
                        this.dataset.value
                    ),
                    this
                );

            }

        );


        container.appendChild(
            optionButton
        );

    }

}


/* =====================================================
   CHECK MCQ ANSWER
===================================================== */

function selectMCQAnswer(
    selectedAnswer,
    selectedButton
) {

    if (
        questionAnswered
    ) {

        return;

    }


    questionAnswered =
        true;


    clearInterval(
        timerInterval
    );


    const correct =

        answersAreEqual(
            selectedAnswer,
            currentAnswer
        );


    const allOptions =

        document
        .querySelectorAll(
            ".mcq-option"
        );


    for (
        let i = 0;

        i < allOptions.length;

        i++
    ) {

        allOptions[i]
            .disabled =
            true;


        const optionValue =

            Number(
                allOptions[i]
                .dataset
                .value
            );


        if (
            answersAreEqual(
                optionValue,
                currentAnswer
            )
        ) {

            allOptions[i]
                .classList
                .add(
                    "correct-option"
                );

        }

    }


    if (
        correct
    ) {

        score++;

        streak++;


        if (
            streak >
            bestStreak
        ) {

            bestStreak =
                streak;

        }


        selectedButton
            .classList
            .add(
                "correct-option"
            );


        showFeedback(
            true
        );

    }

    else {

        streak = 0;


        selectedButton
            .classList
            .add(
                "wrong-option"
            );


        showFeedback(
            false
        );

    }


    finishAnswer(
        correct
    );

}


/* =====================================================
   CHECK DESCRIPTIVE ANSWER
===================================================== */

function checkAnswer() {

    if (
        questionAnswered
    ) {

        return;

    }


    if (
        selectedQuestionFormat ===
        "mcq"
    ) {

        return;

    }


    const answerText =

        document
        .getElementById(
            "answer"
        )
        .value
        .trim();


    if (
        answerText === ""
    ) {

        alert(
            "Please enter an answer."
        );

        return;

    }


    questionAnswered =
        true;


    clearInterval(
        timerInterval
    );


    const studentAnswer =

        Number(
            answerText
        );


    const correct =

        answersAreEqual(
            studentAnswer,
            currentAnswer
        );


    if (
        correct
    ) {

        score++;

        streak++;


        if (
            streak >
            bestStreak
        ) {

            bestStreak =
                streak;

        }

    }

    else {

        streak = 0;

    }


    showFeedback(
        correct
    );


    document
        .getElementById(
            "answer"
        )
        .disabled =
        true;


    finishAnswer(
        correct
    );

}


/* =====================================================
   SHOW FEEDBACK
===================================================== */

function showFeedback(
    correct
) {

    const feedbackBox =

        document
        .getElementById(
            "feedback"
        );


    if (
        correct
    ) {

        feedbackBox
            .textContent =

            "✅ Correct! Great work!";


        feedbackBox
            .className =

            "feedback correct";

    }

    else {

        feedbackBox
            .textContent =

            "❌ Not quite. The correct answer is " +

            formatNumber(
                currentAnswer
            ) +

            ".";


        feedbackBox
            .className =

            "feedback wrong";

    }

}


/* =====================================================
   FINISH ANSWER
===================================================== */

function finishAnswer(
    correct
) {

    quizResults.push({

        correct:
            correct,

        topic:
            selectedTopic,

        wordProblem:
            currentQuestionIsWordProblem

    });


    document
        .getElementById(
            "explanation"
        )
        .textContent =
        currentExplanation;


    document
        .getElementById(
            "explanation"
        )
        .classList
        .remove("hidden");


    updateStats();


    setTimeout(
        nextQuestion,
        2500
    );

}


/* =====================================================
   TIMER
===================================================== */

function startTimer() {

    timeLeft = 30;


    document
        .getElementById(
            "timer"
        )
        .textContent =
        timeLeft;


    timerInterval =
        setInterval(

            function () {

                timeLeft--;


                document
                    .getElementById(
                        "timer"
                    )
                    .textContent =
                    timeLeft;


                if (
                    timeLeft <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );


                    timeUp();

                }

            },

            1000

        );

}


/* =====================================================
   TIME UP
===================================================== */

function timeUp() {

    if (
        questionAnswered
    ) {

        return;

    }


    questionAnswered =
        true;


    streak = 0;


    quizResults.push({

        correct:
            false,

        topic:
            selectedTopic,

        wordProblem:
            currentQuestionIsWordProblem

    });


    const feedbackBox =

        document
        .getElementById(
            "feedback"
        );


    feedbackBox
        .textContent =

        "⏰ Time is up! The correct answer is " +

        formatNumber(
            currentAnswer
        ) +

        ".";


    feedbackBox
        .className =

        "feedback wrong";


    document
        .getElementById(
            "explanation"
        )
        .textContent =
        currentExplanation;


    document
        .getElementById(
            "explanation"
        )
        .classList
        .remove("hidden");


    document
        .getElementById(
            "answer"
        )
        .disabled =
        true;


    const allOptions =

        document
        .querySelectorAll(
            ".mcq-option"
        );


    for (
        let i = 0;

        i < allOptions.length;

        i++
    ) {

        allOptions[i]
            .disabled =
            true;


        if (
            answersAreEqual(

                Number(
                    allOptions[i]
                    .dataset
                    .value
                ),

                currentAnswer

            )
        ) {

            allOptions[i]
                .classList
                .add(
                    "correct-option"
                );

        }

    }


    updateStats();


    setTimeout(
        nextQuestion,
        2500
    );

}


/* =====================================================
   NEXT QUESTION
===================================================== */

function nextQuestion() {

    currentQuestion++;


    if (
        currentQuestion >=
        totalQuestions
    ) {

        showResults();

        return;

    }


    generateQuestion();

}


/* =====================================================
   HINT
===================================================== */

function showHint() {

    const hintBox =

        document
        .getElementById(
            "hint-box"
        );


    hintBox.textContent =

        "💡 " +

        currentHint;


    hintBox
        .classList
        .remove("hidden");

}


/* =====================================================
   NORMAL QUESTION ROUTER
===================================================== */

function generateNormalQuestion(
    topic,
    difficulty
) {

    if (
        topic === "addition"
    ) {

        generateAddition(
            difficulty
        );

    }

    else if (
        topic === "subtraction"
    ) {

        generateSubtraction(
            difficulty
        );

    }

    else if (
        topic === "multiplication"
    ) {

        generateMultiplication(
            difficulty
        );

    }

    else if (
        topic === "division"
    ) {

        generateDivision(
            difficulty
        );

    }

    else if (
        topic === "fractions"
    ) {

        generateFractions(
            difficulty
        );

    }

    else if (
        topic === "decimals"
    ) {

        generateDecimals(
            difficulty
        );

    }

    else if (
        topic === "percentages"
    ) {

        generatePercentages(
            difficulty
        );

    }

    else if (
        topic === "ratio"
    ) {

        generateRatio(
            difficulty
        );

    }

    else if (
        topic === "factors"
    ) {

        generateFactors(
            difficulty
        );

    }

}


/* =====================================================
   ADDITION
===================================================== */

function generateAddition(
    difficulty
) {

    let a;

    let b;


    if (
        difficulty === "easy"
    ) {

        a =
            randomNumber(
                100,
                999
            );


        b =
            randomNumber(
                100,
                999
            );

    }

    else if (
        difficulty === "medium"
    ) {

        a =
            randomNumber(
                1000,
                9999
            );


        b =
            randomNumber(
                1000,
                9999
            );

    }

    else {

        a =
            randomNumber(
                10000,
                99999
            );


        b =
            randomNumber(
                10000,
                99999
            );

    }


    currentAnswer =
        a + b;


    currentQuestionText =

        a +

        " + " +

        b +

        " = ?";


    currentHint =

        "Add the numbers column by column.";


    currentExplanation =

        a +

        " + " +

        b +

        " = " +

        currentAnswer;

}


/* =====================================================
   SUBTRACTION
===================================================== */

function generateSubtraction(
    difficulty
) {

    let a;

    let b;


    if (
        difficulty === "easy"
    ) {

        a =
            randomNumber(
                500,
                2000
            );


        b =
            randomNumber(
                100,
                a - 1
            );

    }

    else if (
        difficulty === "medium"
    ) {

        a =
            randomNumber(
                5000,
                20000
            );


        b =
            randomNumber(
                1000,
                a - 1
            );

    }

    else {

        a =
            randomNumber(
                50000,
                200000
            );


        b =
            randomNumber(
                10000,
                a - 1
            );

    }


    currentAnswer =
        a - b;


    currentQuestionText =

        a +

        " − " +

        b +

        " = ?";


    currentHint =

        "Subtract from right to left and borrow when needed.";


    currentExplanation =

        a +

        " − " +

        b +

        " = " +

        currentAnswer;

}


/* =====================================================
   MULTIPLICATION
===================================================== */

function generateMultiplication(
    difficulty
) {

    let a;

    let b;


    if (
        difficulty === "easy"
    ) {

        a =
            randomNumber(
                12,
                99
            );


        b =
            randomNumber(
                2,
                12
            );

    }

    else if (
        difficulty === "medium"
    ) {

        a =
            randomNumber(
                100,
                999
            );


        b =
            randomNumber(
                12,
                99
            );

    }

    else {

        a =
            randomNumber(
                1000,
                9999
            );


        b =
            randomNumber(
                100,
                999
            );

    }


    currentAnswer =
        a * b;


    currentQuestionText =

        a +

        " × " +

        b +

        " = ?";


    currentHint =

        "Break one number into hundreds, tens and ones.";


    currentExplanation =

        a +

        " × " +

        b +

        " = " +

        currentAnswer;

}


/* =====================================================
   DIVISION
===================================================== */

function generateDivision(
    difficulty
) {

    let divisor;

    let answer;


    if (
        difficulty === "easy"
    ) {

        divisor =
            randomNumber(
                2,
                12
            );


        answer =
            randomNumber(
                10,
                99
            );

    }

    else if (
        difficulty === "medium"
    ) {

        divisor =
            randomNumber(
                12,
                50
            );


        answer =
            randomNumber(
                20,
                200
            );

    }

    else {

        divisor =
            randomNumber(
                25,
                150
            );


        answer =
            randomNumber(
                100,
                500
            );

    }


    const dividend =

        divisor *
        answer;


    currentAnswer =
        answer;


    currentQuestionText =

        dividend +

        " ÷ " +

        divisor +

        " = ?";


    currentHint =

        "Think: divisor × answer = dividend.";


    currentExplanation =

        dividend +

        " ÷ " +

        divisor +

        " = " +

        answer;

}


/* =====================================================
   FRACTIONS
===================================================== */

function generateFractions(
    difficulty
) {

    let denominator;

    let numerator1;

    let numerator2;


    denominator =

        randomNumber(
            2,
            difficulty === "easy"
                ? 8
                : 15
        );


    numerator1 =

        randomNumber(
            1,
            denominator - 1
        );


    numerator2 =

        randomNumber(
            1,
            denominator - 1
        );


    if (
        difficulty === "easy"
    ) {

        const numerator =

            numerator1 +
            numerator2;


        currentAnswer =

            numerator /
            denominator;


        currentQuestionText =

            numerator1 +

            "/" +

            denominator +

            " + " +

            numerator2 +

            "/" +

            denominator +

            " = ?";


        currentHint =

            "The denominators are the same, so add the numerators.";


        currentExplanation =

            numerator1 +

            "/" +

            denominator +

            " + " +

            numerator2 +

            "/" +

            denominator +

            " = " +

            numerator +

            "/" +

            denominator;

    }

    else {

        const numerator =

            numerator1 -
            numerator2;


        currentAnswer =

            numerator /
            denominator;


        currentQuestionText =

            numerator1 +

            "/" +

            denominator +

            " − " +

            numerator2 +

            "/" +

            denominator +

            " = ?";


        currentHint =

            "The denominators are the same, so subtract the numerators.";


        currentExplanation =

            numerator1 +

            "/" +

            denominator +

            " − " +

            numerator2 +

            "/" +

            denominator +

            " = " +

            numerator +

            "/" +

            denominator;

    }

}


/* =====================================================
   DECIMALS
===================================================== */

function generateDecimals(
    difficulty
) {

    let a;

    let b;


    if (
        difficulty === "easy"
    ) {

        a =
            randomNumber(
                10,
                99
            ) / 10;


        b =
            randomNumber(
                10,
                99
            ) / 10;


        currentAnswer =

            Number(
                (
                    a + b
                )
                .toFixed(2)
            );


        currentQuestionText =

            formatNumber(a) +

            " + " +

            formatNumber(b) +

            " = ?";


        currentHint =

            "Line up the decimal points before adding.";

    }

    else if (
        difficulty === "medium"
    ) {

        a =
            randomNumber(
                100,
                999
            ) / 10;


        b =
            randomNumber(
                10,
                500
            ) / 10;


        currentAnswer =

            Number(
                (
                    a - b
                )
                .toFixed(2)
            );


        currentQuestionText =

            formatNumber(a) +

            " − " +

            formatNumber(b) +

            " = ?";


        currentHint =

            "Line up the decimal points before subtracting.";

    }

    else {

        const divisor =

            randomNumber(
                2,
                12
            );


        const answer =

            randomNumber(
                10,
                300
            ) / 10;


        const dividend =

            Number(
                (
                    divisor *
                    answer
                )
                .toFixed(2)
            );


        currentAnswer =
            answer;


        currentQuestionText =

            formatNumber(
                dividend
            ) +

            " ÷ " +

            divisor +

            " = ?";


        currentHint =

            "Divide normally and place the decimal carefully.";

    }


    currentExplanation =

        "The correct answer is " +

        formatNumber(
            currentAnswer
        ) +

        ".";

}


/* =====================================================
   PERCENTAGES
===================================================== */

function generatePercentages(
    difficulty
) {

    let percentage;

    let number;


    if (
        difficulty === "easy"
    ) {

        const percentages =

            [
                10,
                20,
                25,
                50
            ];


        percentage =

            percentages[
                randomNumber(
                    0,
                    percentages.length - 1
                )
            ];


        number =

            randomNumber(
                2,
                20
            ) * 100;

    }

    else if (
        difficulty === "medium"
    ) {

        const percentages =

            [
                5,
                10,
                15,
                20,
                25,
                30,
                40
            ];


        percentage =

            percentages[
                randomNumber(
                    0,
                    percentages.length - 1
                )
            ];


        number =

            randomNumber(
                20,
                100
            ) * 20;

    }

    else {

        percentage =

            randomNumber(
                5,
                75
            );


        number =

            randomNumber(
                100,
                1000
            );

    }


    currentAnswer =

        Number(
            (
                percentage /
                100 *
                number
            )
            .toFixed(2)
        );


    currentQuestionText =

        percentage +

        "% of " +

        number +

        " = ?";


    currentHint =

        percentage +

        "% means " +

        percentage +

        "/100.";


    currentExplanation =

        percentage +

        "/100 × " +

        number +

        " = " +

        formatNumber(
            currentAnswer
        );

}


/* =====================================================
   RATIO AND PROPORTION
===================================================== */

function generateRatio(
    difficulty
) {

    const first =

        randomNumber(
            1,
            difficulty === "easy"
                ? 5
                : 12
        );


    const second =

        randomNumber(
            1,
            difficulty === "easy"
                ? 8
                : 15
        );


    const multiplier =

        randomNumber(
            difficulty === "easy"
                ? 2
                : 5,

            difficulty === "easy"
                ? 10
                : 20
        );


    const total =

        (
            first +
            second
        ) *
        multiplier;


    currentAnswer =

        second *
        multiplier;


    currentQuestionText =

        "The ratio of boys to girls is " +

        first +

        ":" +

        second +

        ". If there are " +

        total +

        " students, how many are girls?";


    currentHint =

        "Add the ratio parts, then find the value of one part.";


    currentExplanation =

        "Total parts = " +

        first +

        " + " +

        second +

        " = " +

        (
            first +
            second
        ) +

        "\n\nOne part = " +

        total +

        " ÷ " +

        (
            first +
            second
        ) +

        " = " +

        multiplier +

        "\n\nGirls = " +

        second +

        " × " +

        multiplier +

        " = " +

        currentAnswer;

}


/* =====================================================
   FACTORS AND MULTIPLES
===================================================== */

function generateFactors(
    difficulty
) {

    const type =

        randomNumber(
            1,
            2
        );


    if (
        type === 1
    ) {

        const a =

            randomNumber(
                2,
                difficulty === "easy"
                    ? 12
                    : 30
            );


        const b =

            randomNumber(
                2,
                difficulty === "easy"
                    ? 12
                    : 30
            );


        currentAnswer =

            (
                a *
                b
            );


        currentQuestionText =

            "What is the least common multiple (LCM) of " +

            a +

            " and " +

            b +

            "?";


        currentHint =

            "List multiples of both numbers and find the first common one.";


        currentExplanation =

            "The LCM is " +

            currentAnswer +

            ".";

    }

    else {

        const common =

            randomNumber(
                2,
                10
            );


        const a =

            randomNumber(
                2,
                difficulty === "easy"
                    ? 10
                    : 20
            ) *
            common;


        const b =

            randomNumber(
                2,
                difficulty === "easy"
                    ? 10
                    : 20
            ) *
            common;


        currentAnswer =
            common;


        currentQuestionText =

            "What is the highest common factor (HCF) of " +

            a +

            " and " +

            b +

            "?";


        currentHint =

            "Find the greatest number that divides both numbers.";


        currentExplanation =

            "The HCF is " +

            currentAnswer +

            ".";

    }

}


/* =====================================================
   WORD PROBLEMS
===================================================== */

function generateWordProblem(
    topic,
    difficulty
) {

    currentQuestionIsWordProblem =
        true;


    if (
        topic === "addition"
    ) {

        const a =

            randomNumber(
                500,
                difficulty === "easy"
                    ? 2000
                    : 10000
            );


        const b =

            randomNumber(
                500,
                difficulty === "easy"
                    ? 2000
                    : 10000
            );


        currentAnswer =
            a + b;


        currentQuestionText =

            "A library bought " +

            a +

            " books in January and " +

            b +

            " books in February. How many books did it buy altogether?";


        currentHint =

            "The word 'altogether' means add.";


        currentExplanation =

            a +

            " + " +

            b +

            " = " +

            currentAnswer;

    }

    else if (
        topic === "subtraction"
    ) {

        const total =

            randomNumber(
                5000,
                20000
            );


        const used =

            randomNumber(
                1000,
                total - 100
            );


        currentAnswer =

            total -
            used;


        currentQuestionText =

            "A stadium has " +

            total +

            " seats. If " +

            used +

            " seats are occupied, how many seats are empty?";


        currentHint =

            "Find what remains by subtracting.";


        currentExplanation =

            total +

            " − " +

            used +

            " = " +

            currentAnswer;

    }

    else if (
        topic === "multiplication"
    ) {

        const boxes =

            randomNumber(
                20,
                100
            );


        const items =

            randomNumber(
                10,
                50
            );


        currentAnswer =

            boxes *
            items;


        currentQuestionText =

            "A factory packs " +

            boxes +

            " boxes. Each box contains " +

            items +

            " toys. How many toys are packed altogether?";


        currentHint =

            "Multiply the number of boxes by the toys in each box.";


        currentExplanation =

            boxes +

            " × " +

            items +

            " = " +

            currentAnswer;

    }

    else if (
        topic === "division"
    ) {

        const students =

            randomNumber(
                20,
                80
            );


        const classes =

            randomNumber(
                2,
                10
            );


        const total =

            students *
            classes;


        currentAnswer =
            students;


        currentQuestionText =

            "A school has " +

            total +

            " students divided equally into " +

            classes +

            " classes. How many students are in each class?";


        currentHint =

            "Divide the total students by the number of classes.";


        currentExplanation =

            total +

            " ÷ " +

            classes +

            " = " +

            currentAnswer;

    }

    else if (
        topic === "fractions"
    ) {

        const denominator =

            randomNumber(
                4,
                12
            );


        const numerator =

            randomNumber(
                1,
                denominator - 2
            );


        const total =

            randomNumber(
                10,
                50
            ) *
            denominator;


        currentAnswer =

            (
                numerator /
                denominator
            ) *
            total;


        currentQuestionText =

            "A water tank is " +

            numerator +

            "/" +

            denominator +

            " full. Its capacity is " +

            total +

            " litres. How many litres of water are in the tank?";


        currentHint =

            "Multiply the total capacity by the fraction.";


        currentExplanation =

            numerator +

            "/" +

            denominator +

            " × " +

            total +

            " = " +

            currentAnswer;

    }

    else if (
        topic === "decimals"
    ) {

        const bought =

            randomNumber(
                100,
                300
            ) / 10;


        const sold =

            randomNumber(
                10,
                Math.floor(
                    bought * 10
                ) - 1
            ) / 10;


        currentAnswer =

            Number(
                (
                    bought -
                    sold
                )
                .toFixed(2)
            );


        currentQuestionText =

            "A shopkeeper bought " +

            formatNumber(
                bought
            ) +

            " kg of apples and sold " +

            formatNumber(
                sold
            ) +

            " kg. How many kilograms remain?";


        currentHint =

            "Subtract the amount sold from the amount bought.";


        currentExplanation =

            formatNumber(
                bought
            ) +

            " − " +

            formatNumber(
                sold
            ) +

            " = " +

            formatNumber(
                currentAnswer
            );

    }

    else if (
        topic === "percentages"
    ) {

        const price =

            randomNumber(
                20,
                100
            ) * 100;


        const discount =

            [
                10,
                15,
                20,
                25
            ][
                randomNumber(
                    0,
                    3
                )
            ];


        const discountAmount =

            (
                discount /
                100
            ) *
            price;


        currentAnswer =

            price -
            discountAmount;


        currentQuestionText =

            "A bicycle costs $" +

            price +

            ". A shop gives a " +

            discount +

            "% discount. What is the sale price?";


        currentHint =

            "First find the discount amount, then subtract it from the original price.";


        currentExplanation =

            "Discount = " +

            discount +

            "% of $" +

            price +

            " = $" +

            discountAmount +

            "\n\nSale price = $" +

            price +

            " − $" +

            discountAmount +

            " = $" +

            currentAnswer;

    }

    else if (
        topic === "ratio"
    ) {

        generateRatio(
            difficulty
        );

    }

    else {

        const common =

            randomNumber(
                2,
                12
            );


        const first =

            randomNumber(
                2,
                10
            ) *
            common;


        const second =

            randomNumber(
                2,
                10
            ) *
            common;


        currentAnswer =
            common;


        currentQuestionText =

            "Two bells ring every " +

            first +

            " seconds and " +

            second +

            " seconds. What is the HCF of the two time intervals?";


        currentHint =

            "Find the greatest number that divides both time intervals.";


        currentExplanation =

            "The HCF is " +

            currentAnswer;

    }

}


/* =====================================================
   RESULTS
===================================================== */

function showResults() {

    clearInterval(
        timerInterval
    );


    document
        .getElementById(
            "quiz-screen"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "result-screen"
        )
        .classList
        .remove("hidden");


    document
        .getElementById(
            "final-score"
        )
        .textContent =
        score;


    document
        .getElementById(
            "final-total"
        )
        .textContent =
        totalQuestions;


    const percentage =

        Math.round(

            (
                score /
                totalQuestions
            ) * 100

        );


    document
        .getElementById(
            "final-percentage"
        )
        .textContent =

        percentage +

        "%";


    let feedback = "";


    if (
        percentage === 100
    ) {

        feedback =

            studentName +

            ", outstanding! You answered every question correctly.";

    }

    else if (
        percentage >= 90
    ) {

        feedback =

            "Excellent work, " +

            studentName +

            "! You have a very strong understanding of this level.";

    }

    else if (
        percentage >= 75
    ) {

        feedback =

            "Great work, " +

            studentName +

            "! You understand most of the concepts.";

    }

    else if (
        percentage >= 50
    ) {

        feedback =

            "Good effort, " +

            studentName +

            "! Regular practice will help you become more confident.";

    }

    else {

        feedback =

            studentName +

            ", keep practising. Work slowly and use the hints to understand the method.";

    }


    document
        .getElementById(
            "personal-feedback-text"
        )
        .textContent =
        feedback;


    if (
        percentage >= 75
    ) {

        document
            .getElementById(
                "strength-text"
            )
            .textContent =

            "You showed strong understanding and solved many questions correctly.";


        document
            .getElementById(
                "practice-text"
            )
            .textContent =

            "Try a harder level or Challenge Mode next.";

    }

    else {

        document
            .getElementById(
                "strength-text"
            )
            .textContent =

            "You completed all 20 questions. Your effort and consistency are important strengths.";


        document
            .getElementById(
                "practice-text"
            )
            .textContent =

            "Practise the selected topic again and solve each question step by step.";

    }


    showBadges(
        percentage
    );

}


/* =====================================================
   BADGES
===================================================== */

function showBadges(
    percentage
) {

    const container =

        document
        .getElementById(
            "badges-container"
        );


    container.innerHTML =
        "";


    const badges = [];


    badges.push({

        icon:
            "🌱",

        name:
            "Rising Star",

        description:
            "Completed a full quiz"

    });


    if (
        percentage >= 70
    ) {

        badges.push({

            icon:
                "⭐",

            name:
                "Maths Star",

            description:
                "Scored 70% or more"

        });

    }


    if (
        percentage >= 90
    ) {

        badges.push({

            icon:
                "🏆",

            name:
                "Maths Champion",

            description:
                "Scored 90% or more"

        });

    }


    if (
        score ===
        totalQuestions
    ) {

        badges.push({

            icon:
                "💯",

            name:
                "Perfect Score",

            description:
                "Answered every question correctly"

        });

    }


    if (
        bestStreak >= 10
    ) {

        badges.push({

            icon:
                "🔥",

            name:
                "Streak Master",

            description:
                "Got 10 correct answers in a row"

        });

    }


    if (
        timerEnabled &&
        percentage >= 80
    ) {

        badges.push({

            icon:
                "⚡",

            name:
                "Speed Solver",

            description:
                "Scored 80% or more with the timer"

        });

    }


    if (
        selectedTopic ===
        "challenge" &&

        percentage >= 70
    ) {

        badges.push({

            icon:
                "🚀",

            name:
                "Challenge Hero",

            description:
                "Completed Challenge Mode with 70% or more"

        });

    }


    let wordCorrect = 0;


    for (
        let i = 0;

        i < quizResults.length;

        i++
    ) {

        if (

            quizResults[i]
            .wordProblem &&

            quizResults[i]
            .correct

        ) {

            wordCorrect++;

        }

    }


    if (
        wordCorrect >= 4
    ) {

        badges.push({

            icon:
                "🧠",

            name:
                "Problem Solver",

            description:
                "Solved at least 4 word problems"

        });

    }


    for (
        let i = 0;

        i < badges.length;

        i++
    ) {

        const badge =

            document
            .createElement(
                "div"
            );


        badge.className =
            "badge";


        badge.innerHTML =

            `
            <div class="badge-icon">
                ${badges[i].icon}
            </div>

            <div class="badge-name">
                ${badges[i].name}
            </div>

            <div class="badge-description">
                ${badges[i].description}
            </div>
            `;


        container.appendChild(
            badge
        );

    }

}


/* =====================================================
   RESTART
===================================================== */

function restartQuiz() {

    clearInterval(
        timerInterval
    );


    document
        .getElementById(
            "result-screen"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "welcome-screen"
        )
        .classList
        .remove("hidden");


    window.scrollTo(
        0,
        0
    );

}


/* =====================================================
   BACK TO HOME
===================================================== */

function goBackHome() {

    clearInterval(
        timerInterval
    );


    document
        .getElementById(
            "quiz-screen"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "result-screen"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "welcome-screen"
        )
        .classList
        .remove("hidden");


    window.scrollTo(
        0,
        0
    );

}


/* =====================================================
   ENTER KEY
===================================================== */

document
.getElementById(
    "answer"
)
.addEventListener(

    "keydown",

    function (
        event
    ) {

        if (
            event.key ===
            "Enter"
        ) {

            checkAnswer();

        }

    }

);


/* =====================================================
   CHALLENGE MODE DROPDOWN
===================================================== */

document
.getElementById(
    "topic"
)
.addEventListener(

    "change",

    function () {

        const challengeInfo =

            document
            .getElementById(
                "challenge-info"
            );


        const difficultySelect =

            document
            .getElementById(
                "difficulty"
            );


        if (
            this.value ===
            "challenge"
        ) {

            challengeInfo
                .classList
                .remove("hidden");


            difficultySelect.value =
                "";


            difficultySelect.disabled =
                true;

        }

        else {

            challengeInfo
                .classList
                .add("hidden");


            difficultySelect.disabled =
                false;

        }

    }

);
