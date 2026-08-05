/* =====================================================
   MATHMIND AI - COMPLETE JAVASCRIPT
===================================================== */


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let selectedTopic = "";
let selectedDifficulty = "";

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

let currentHint = "";

let currentExplanation = "";

let currentQuestionIsWordProblem = false;

let questionAnswered = false;

let quizResults = [];


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

        let temporary = b;

        b = a % b;

        a = temporary;

    }

    return a;

}


function simplifyFraction(numerator, denominator) {

    const divisor = gcd(
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


function getChallengeDifficulty() {

    if (currentQuestion < 5) {

        return "easy";

    }

    if (currentQuestion < 10) {

        return "medium";

    }

    if (currentQuestion < 15) {

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


    timerEnabled =
        document
        .getElementById(
            "timer-choice"
        )
        .value === "yes";


    if (studentName === "") {

        alert(
            "Please enter your name."
        );

        return;

    }


    if (selectedTopic === "") {

        alert(
            "Please select a topic."
        );

        return;

    }


    /*
       Challenge Mode automatically
       controls the difficulty.
    */

    if (
        selectedTopic !== "challenge" &&
        selectedDifficulty === ""
    ) {

        alert(
            "Please select a difficulty."
        );

        return;

    }


    /*
       Reset quiz values
    */

    currentQuestion = 0;

    score = 0;

    streak = 0;

    bestStreak = 0;

    quizResults = [];


    /*
       Change screens
    */

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


    /*
       Welcome message
    */

    document
        .getElementById(
            "welcome-message"
        )
        .textContent =
        "Good luck, " +
        studentName +
        "!";


    /*
       Timer
    */

    if (timerEnabled) {

        document
            .getElementById(
                "timer-box"
            )
            .classList
            .remove("hidden");

    } else {

        document
            .getElementById(
                "timer-box"
            )
            .classList
            .add("hidden");

    }


    /*
       Challenge level
    */

    if (
        selectedTopic === "challenge"
    ) {

        document
            .getElementById(
                "challenge-level"
            )
            .classList
            .remove("hidden");

    } else {

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
        .textContent = score;


    document
        .getElementById(
            "streak"
        )
        .textContent = streak;


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
        currentQuestion + 1;


    const progress =
        (
            currentQuestion /
            totalQuestions
        ) * 100;


    document
        .getElementById(
            "progress-fill"
        )
        .style.width =
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


    currentQuestionIsWordProblem = false;


    document
        .getElementById(
            "answer"
        )
        .value = "";


    document
        .getElementById(
            "answer"
        )
        .disabled = false;


    document
        .getElementById(
            "feedback"
        )
        .textContent = "";


    document
        .getElementById(
            "explanation"
        )
        .textContent = "";


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
        .textContent = "";


    document
        .getElementById(
            "hint-box"
        )
        .classList
        .add("hidden");


    /*
       Difficulty
    */

    let activeDifficulty =
        selectedDifficulty;


    if (
        selectedTopic === "challenge"
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
            .toUpperCase() +
            activeDifficulty
            .slice(1);

    }


    /*
       Select topic
    */

    let activeTopic =
        selectedTopic;


    if (
        selectedTopic === "mixed" ||
        selectedTopic === "challenge"
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


    /*
       Word problem probability
    */

    const useWordProblem =
        Math.random() < 0.35;


    if (
        useWordProblem
    ) {

        generateWordProblem(
            activeTopic,
            activeDifficulty
        );

    } else {

        generateNormalQuestion(
            activeTopic,
            activeDifficulty
        );

    }


    /*
       Show question
    */

    const questionElement =
        document
        .getElementById(
            "question"
        );


    questionElement
        .textContent =
        currentQuestionText;


    if (
        currentQuestionIsWordProblem
    ) {

        questionElement
            .classList
            .add(
                "word-problem"
            );


        document
            .getElementById(
                "question-type"
            )
            .textContent =
            "📖 Word Problem";

    } else {

        questionElement
            .classList
            .remove(
                "word-problem"
            );


        document
            .getElementById(
                "question-type"
            )
            .textContent =
            "🧮 Maths Question";

    }


    updateStats();


    /*
       Start timer
    */

    if (timerEnabled) {

        startTimer();

    }


    /*
       Focus answer
    */

    setTimeout(
        function () {

            document
            .getElementById(
                "answer"
            )
            .focus();

        },
        100
    );

}


/* =====================================================
   QUESTION VARIABLES
===================================================== */


let currentQuestionText = "";


/* =====================================================
   NORMAL QUESTIONS
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
        divisor * answer;


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

    let denominator1;
    let denominator2;

    let numerator1;
    let numerator2;


    if (
        difficulty === "easy"
    ) {

        denominator1 =
            randomNumber(
                2,
                8
            );

        denominator2 =
            denominator1;


        numerator1 =
            randomNumber(
                1,
                denominator1 - 1
            );

        numerator2 =
            randomNumber(
                1,
                denominator2 - 1
            );


        const numerator =
            numerator1 +
            numerator2;


        const simplified =
            simplifyFraction(
                numerator,
                denominator1
            );


        currentAnswer =
            simplified.numerator /
            simplified.denominator;


        currentQuestionText =
            numerator1 +
            "/" +
            denominator1 +
            " + " +
            numerator2 +
            "/" +
            denominator2 +
            " = ?";


        currentHint =
            "The denominators are the same, so add the numerators.";


        currentExplanation =
            numerator1 +
            "/" +
            denominator1 +
            " + " +
            numerator2 +
            "/" +
            denominator2 +
            " = " +
            numerator +
            "/" +
            denominator1;

    }


    else {

        denominator1 =
            randomNumber(
                3,
                difficulty === "medium"
                    ? 10
                    : 15
            );


        denominator2 =
            randomNumber(
                3,
                difficulty === "medium"
                    ? 10
                    : 15
            );


        numerator1 =
            randomNumber(
                1,
                denominator1 - 1
            );


        numerator2 =
            randomNumber(
                1,
                denominator2 - 1
            );


        const numerator =
            (
                numerator1 *
                denominator2
            ) +
            (
                numerator2 *
                denominator1
            );


        const denominator =
            denominator1 *
            denominator2;


        const simplified =
            simplifyFraction(
                numerator,
                denominator
            );


        currentAnswer =
            simplified.numerator /
            simplified.denominator;


        currentQuestionText =
            numerator1 +
            "/" +
            denominator1 +
            " + " +
            numerator2 +
            "/" +
            denominator2 +
            " = ?";


        currentHint =
            "Find a common denominator before adding.";


        currentExplanation =
            "Use a common denominator.\n\n" +
            numerator1 +
            "/" +
            denominator1 +
            " + " +
            numerator2 +
            "/" +
            denominator2 +
            " = " +
            simplified.numerator +
            "/" +
            simplified.denominator;

    }

}


/* =====================================================
   DECIMALS
===================================================== */


function generateDecimals(
    difficulty
) {

    const operation =
        randomNumber(
            1,
            4
        );


    let a;
    let b;


    if (
        difficulty === "easy"
    ) {

        a =
            randomNumber(
                10,
                999
            ) / 10;

        b =
            randomNumber(
                10,
                999
            ) / 10;

    }


    else {

        a =
            randomNumber(
                100,
                9999
            ) / 100;

        b =
            randomNumber(
                10,
                999
            ) / 100;

    }


    /*
       Addition
    */

    if (
        operation === 1
    ) {

        currentAnswer =
            Number(
                (
                    a + b
                )
                .toFixed(4)
            );


        currentQuestionText =
            formatNumber(a) +
            " + " +
            formatNumber(b) +
            " = ?";


        currentHint =
            "Line up the decimal points.";


    }


    /*
       Subtraction
    */

    else if (
        operation === 2
    ) {

        if (
            b > a
        ) {

            let temporary = a;

            a = b;

            b = temporary;

        }


        currentAnswer =
            Number(
                (
                    a - b
                )
                .toFixed(4)
            );


        currentQuestionText =
            formatNumber(a) +
            " − " +
            formatNumber(b) +
            " = ?";


        currentHint =
            "Keep the decimal points in one column.";

    }


    /*
       Multiplication
    */

    else if (
        operation === 3
    ) {

        currentAnswer =
            Number(
                (
                    a * b
                )
                .toFixed(4)
            );


        currentQuestionText =
            formatNumber(a) +
            " × " +
            formatNumber(b) +
            " = ?";


        currentHint =
            "Multiply normally, then count decimal places.";

    }


    /*
       Division
    */

    else {

        let divisor =
            difficulty === "easy"
                ? randomNumber(2, 10)
                : randomNumber(2, 25);


        let answer =
            randomNumber(
                10,
                difficulty === "easy"
                    ? 99
                    : 300
            ) / 10;


        let dividend =
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

        const percentages = [

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

        const percentages = [

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
   RATIO
===================================================== */


function generateRatio(
    difficulty
) {

    let first;
    let second;
    let multiplier;


    if (
        difficulty === "easy"
    ) {

        first =
            randomNumber(
                1,
                5
            );

        second =
            randomNumber(
                1,
                8
            );

        multiplier =
            randomNumber(
                2,
                10
            );

    }


    else {

        first =
            randomNumber(
                2,
                12
            );

        second =
            randomNumber(
                2,
                15
            );

        multiplier =
            randomNumber(
                5,
                20
            );

    }


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
        "\n\n" +
        "One part = " +
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

        let a =
            randomNumber(
                2,
                difficulty === "easy"
                    ? 12
                    : 30
            );


        let b =
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

        let a =
            randomNumber(
                2,
                difficulty === "easy"
                    ? 10
                    : 20
            );


        let b =
            randomNumber(
                2,
                difficulty === "easy"
                    ? 10
                    : 20
            );


        let common =
            randomNumber(
                2,
                10
            );


        a *= common;

        b *= common;


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


    /*
       Addition
    */

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


    /*
       Subtraction
    */

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
            total - used;


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


    /*
       Multiplication
    */

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


    /*
       Division
    */

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


    /*
       Fractions
    */

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


    /*
       Decimals
    */

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


    /*
       Percentages
    */

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
            "A bicycle costs ₹" +
            price +
            ". A shop gives a " +
            discount +
            "% discount. What is the sale price?";


        currentHint =
            "First find the discount amount, then subtract it from the original price.";


        currentExplanation =
            "Discount = " +
            discount +
            "% of ₹" +
            price +
            " = ₹" +
            discountAmount +
            "\n\nSale price = ₹" +
            price +
            " − ₹" +
            discountAmount +
            " = ₹" +
            currentAnswer;

    }


    /*
       Ratio
    */

    else if (
        topic === "ratio"
    ) {

        generateRatio(
            difficulty
        );

        currentQuestionIsWordProblem =
            true;

    }


    /*
       Factors
    */

    else {

        const a =
            randomNumber(
                2,
                10
            ) *
            6;


        const b =
            randomNumber(
                2,
                10
            ) *
            6;


        currentAnswer =
            6;


        currentQuestionText =
            "Two bells ring every " +
            a +
            " seconds and " +
            b +
            " seconds. What is the HCF of the two time intervals?";


        currentHint =
            "Find the greatest number that divides both time intervals.";


        currentExplanation =
            "The HCF is " +
            currentAnswer;

    }

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


    questionAnswered = true;


    streak = 0;


    quizResults.push({

        correct: false,

        topic:
            selectedTopic,

        wordProblem:
            currentQuestionIsWordProblem

    });


    document
        .getElementById(
            "feedback"
        )
        .textContent =
        "⏰ Time is up!";


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
        .disabled = true;


    updateStats();


    setTimeout(
        nextQuestion,
        2500
    );

}


/* =====================================================
   CHECK ANSWER
===================================================== */


function checkAnswer() {

    if (
        questionAnswered
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


    questionAnswered = true;


    clearInterval(
        timerInterval
    );


    let studentAnswer =
        Number(
            answerText
        );


    const correct =
        Math.abs(
            studentAnswer -
            currentAnswer
        ) <
        0.0001;


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


        document
            .getElementById(
                "feedback"
            )
            .textContent =
            "✅ Correct! Great work!";


    } else {

        streak = 0;


        document
            .getElementById(
                "feedback"
            )
            .textContent =
            "❌ Not quite. The correct answer is " +
            formatNumber(
                currentAnswer
            ) +
            ".";

    }


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


    document
        .getElementById(
            "answer"
        )
        .disabled = true;


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
   PERSONALIZED RESULTS
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


    /*
       Personalized message
    */

    let feedback = "";


    if (
        percentage === 100
    ) {

        feedback =
            studentName +
            ", outstanding! You answered every question correctly. You have shown excellent mathematical understanding.";

    }


    else if (
        percentage >= 90
    ) {

        feedback =
            "Excellent work, " +
            studentName +
            "! You have a very strong understanding of this level. Try Challenge Mode next.";

    }


    else if (
        percentage >= 75
    ) {

        feedback =
            "Great work, " +
            studentName +
            "! You understand most of the concepts. Review the questions you missed and try to improve your score.";

    }


    else if (
        percentage >= 50
    ) {

        feedback =
            "Good effort, " +
            studentName +
            "! You understand some concepts, but regular practice will help you become more confident.";

    }


    else {

        feedback =
            studentName +
            ", keep practising. Work slowly, read each question carefully, and use the hints when needed.";

    }


    document
        .getElementById(
            "personal-feedback-text"
        )
        .textContent =
        feedback;


    /*
       Strength and practice
    */

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
            "Try harder questions or Challenge Mode to improve further.";

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
            "Practise the selected topic again, solve questions step by step, and use hints to understand the method.";

    }


    /*
       Badges
    */

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


    container.innerHTML = "";


    let badges = [];


    /*
       Quiz completed
    */

    badges.push({

        icon: "🌱",

        name:
            "Rising Star",

        description:
            "Completed a full quiz"

    });


    /*
       70 percent
    */

    if (
        percentage >= 70
    ) {

        badges.push({

            icon: "⭐",

            name:
                "Maths Star",

            description:
                "Scored 70% or more"

        });

    }


    /*
       90 percent
    */

    if (
        percentage >= 90
    ) {

        badges.push({

            icon: "🏆",

            name:
                "Maths Champion",

            description:
                "Scored 90% or more"

        });

    }


    /*
       Perfect score
    */

    if (
        score ===
        totalQuestions
    ) {

        badges.push({

            icon: "💯",

            name:
                "Perfect Score",

            description:
                "Answered every question correctly"

        });

    }


    /*
       Streak
    */

    if (
        bestStreak >= 10
    ) {

        badges.push({

            icon: "🔥",

            name:
                "Streak Master",

            description:
                "Got 10 correct answers in a row"

        });

    }


    /*
       Timer badge
    */

    if (
        timerEnabled &&
        percentage >= 80
    ) {

        badges.push({

            icon: "⚡",

            name:
                "Speed Solver",

            description:
                "Scored 80% or more with the timer"

        });

    }


    /*
       Challenge badge
    */

    if (
        selectedTopic ===
        "challenge" &&
        percentage >= 70
    ) {

        badges.push({

            icon: "🚀",

            name:
                "Challenge Hero",

            description:
                "Completed Challenge Mode with 70% or more"

        });

    }


    /*
       Word problem badge
    */

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

            icon: "🧠",

            name:
                "Problem Solver",

            description:
                "Solved at least 4 word problems"

        });

    }


    /*
       Display badges
    */

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
    function (event) {

        if (
            event.key === "Enter"
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