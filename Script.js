// var questions = [{
//         question: 'What is the baby of a moth known as?',
//         choices: ['baby', 'infant', 'kit', 'larva'],
//         correctAnswer: 3
//     },
//     {
//         question: 'What is the adult of a kid called?',
//         choices: ['calf', 'doe', 'goat', 'chick'],
//         correctAnswer: 2
//     },
//     {
//         question: 'What is the young of buffalo called?',
//         choices: ['calf', 'baby', 'pup', 'cow'],
//         correctAnswer: 0
//     },
//     {
//         question: 'What is a baby alligator called?',
//         choices: ['baby', 'gator', 'hatchling', 'calf'],
//         correctAnswer: 1
//     },
//     {
//         question: 'What is a baby goose called?',
//         choices: ['gooser', 'gosling', 'gup', 'pup'],
//         correctAnswer: 1
//     }
// ];

// var currentQuestion = 0;
// var correctAnswers = 0;
// var quizOver = false;

// window.addEventListener('DOMContentLoaded', function(e) {
//     displayCurrentQuestion();

//     var quizMessage = document.querySelector('.quizMessage');

//     quizMessage.style.display = 'none';

//     document.querySelector('.nextButton').addEventListener('click', function() {

//         if (!quizOver) {
//             var radioBtnsChecked = document.querySelector('input[type=radio]:checked');

//             if (radioBtnsChecked === null) {
//                 quizMessage.innerText = 'Please select an answer';
//                 quizMessage.style.display = 'block';
//             } else {
//                 console.log(radioBtnsChecked.value);
//                 quizMessage.style.display = 'none';
//                 if (parseInt(radioBtnsChecked.value) === questions[currentQuestion].correctAnswer) {
//                     correctAnswers++;
//                 }

//                 currentQuestion++;

//                 if (currentQuestion < questions.length) {
//                     displayCurrentQuestion();
//                 } else {
//                     displayScore();
//                     document.querySelector('.nextButton').innerText = 'Play Again?';
//                     quizOver = true;
//                 }
//             }
//         } else {
//             quizOver = false;
//             document.querySelector('.nextButton').innerText = 'Next Question';
//             resetQuiz();
//             displayCurrentQuestion();
//             hideScore();
//         }
//     });
// });

// function displayCurrentQuestion() {
//     console.log('In display current Questions');

//     var question = questions[currentQuestion].question;
//     var questionClass = document.querySelector('.quizContainer > .question');
//     var choiceList = document.querySelector('.quizContainer > .choiceList');
//     var numChoices = questions[currentQuestion].choices.length;

//     //Set the questionClass text to the current question
//     questionClass.innerText = question;

//     //Remove all current <li> elements (if any)
//     choiceList.innerHTML = '';

//     var choice;
//     for (i = 0; i < numChoices; i++) {
//         choice = questions[currentQuestion].choices[i];
//         var li = document.createElement('li');
//         li.innerHTML = '<li><input type="radio" value="' + i + '" name="dynradio" />' + choice + '</li>'
//         choiceList.appendChild(li);

//     }
// }

// function resetQuiz() {
//     currentQuestion = 0;
//     correctAnswers = 0;
//     hideScore();
// }

// function displayScore() {
//     document.querySelector('.quizContainer > .result').innerText = 'You scored: ' + correctAnswers + ' out of ' + questions.length;
//     document.querySelector('.quizContainer > .result').style.display = 'block';
// }

// function hideScore() {
//     document.querySelector('.result').style.display = 'none';
// }
// https: //developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event

const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

fetch(
        'https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple'
    )
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 20;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('/end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};