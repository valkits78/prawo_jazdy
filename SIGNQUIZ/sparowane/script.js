// Funkcja do pobierania nazwy kategorii na podstawie identyfikatora
function getCategoryById(categoryId) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8081/categoryById/' + categoryId, true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        var category = JSON.parse(xhr.responseText);
        resolve(category.name);
      } else {
        reject('Błąd serwera');
      }
    };
    xhr.onerror = function() {
      reject('Błąd połączenia');
    };
    xhr.send();
  });
}

var score = {
  totalQuestions: 0,
  correctAnswers: 0
};
var gameDiv = document.getElementById('quiz');
var descriptionDiv = document.getElementById('pytanie');
var odp1Div = document.getElementById('odp1');
var odp2Div = document.getElementById('odp2');
var odp3Div = document.getElementById('odp3');
var scoreDiv = document.getElementById('dane');
var summaryDiv = document.getElementById('quizEnd');
var summaryTotalQuestionsDiv = document.getElementById('podsumowanie');
var summaryCorrectAnswersDiv = document.getElementById('podsumowanie');
var znakiDiv = document.getElementById('znaki');

// Funkcja do wyświetlania podsumowania
function showSummary() {
  summaryTotalQuestionsDiv.textContent = 'Liczba pytań: ' + score.totalQuestions;
  summaryCorrectAnswersDiv.textContent = 'Liczba poprawnych odpowiedzi: ' + score.correctAnswers;
score.totalQuestions=0;
score.correctAnswers=0;
  gameDiv.style.display = 'none';
  summaryDiv.style.display = 'block';
}

// Funkcja do ukrywania quizu i pokazywania znaków
function showQuiz() {
  znakiDiv.style.display = 'block';
  gameDiv.style.display = 'none';
}

// Funkcja do wyświetlania nowego pytania i odpowiedzi
async function displayQuestionAndAnswers(selectedCategories) {
  var url = 'http://localhost:8081/randomObjects';

  if (selectedCategories.length > 0) {
    url += '?categoryIds=' + selectedCategories.join(',');
  }

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = async function() {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      var result = data[0];

      // Wyczyść poprzednie treści
      descriptionDiv.innerHTML = '';
      odp1Div.innerHTML = '';
      odp2Div.innerHTML = '';
      odp3Div.innerHTML = '';

      // Wyświetl opis
      var description = document.createElement('p');
      description.textContent = result.about;
      descriptionDiv.appendChild(description);

      // Wygeneruj losową kolejność odpowiedzi
      var shuffledNames = await Promise.all(data.map(async function(record) {
        return {
          name: record.linkPhoto,
          category: await getCategoryById(record.signCategoryId)
        };
      }));

      // Tasowanie tablicy z odpowiedziami
      shuffleArray(shuffledNames);

      // Wyświetl odpowiedzi w losowej kolejności
      shuffledNames.forEach(function(record, index) {
        var answerDiv = document.createElement('div');
        answerDiv.classList.add('answer');
        answerDiv.classList.add('odp' + (index + 1));

        var image = document.createElement('img');
        var category = record.category;
        image.src = 'sign/' + category + '/' + record.name;
        image.classList.add('sign-image');
        answerDiv.appendChild(image);

        if (category) {
          var categoryLabel = document.createElement('p');
          categoryLabel.classList.add('sign-category');
          //categoryLabel.textContent = category;
          answerDiv.appendChild(categoryLabel);
        }

        // Dodaj odpowiedź do odpowiedniego diva
        if (index === 0) {
          odp1Div.appendChild(answerDiv);
        } else if (index === 1) {
          odp2Div.appendChild(answerDiv);
        } else if (index === 2) {
          odp3Div.appendChild(answerDiv);
        }

        answerDiv.addEventListener('click', function() {
          if (record.name === result.linkPhoto) {
            score.correctAnswers++; 
          }

          score.totalQuestions++;
          updateScore();

          if (score.totalQuestions === 10) {
            showSummary(); // Wyświetl podsumowanie po 10 odpowiedziach
          } else {
            // Po kliknięciu odpowiedzi, wywołaj funkcję displayQuestionAndAnswers po upływie 1 sekundy (1000ms)
            setTimeout(function() {
              displayQuestionAndAnswers(selectedCategories);
            }, 1000);
          }
        });
      });
    }
  };
  xhr.send();
}

// Funkcja do tasowania tablicy (Fisher-Yates Shuffle)
function shuffleArray(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // Dopóki są elementy do zamiany
  while (currentIndex !== 0) {
    // Wylosuj pozycję
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Zamień bieżący element z losowo wybranym elementem
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Aktualizuj wynik
function updateScore() {
  scoreDiv.textContent = 'Pytania: ' + score.totalQuestions + ' | Poprawne odpowiedzi: ' + score.correctAnswers;
}

// Funkcja do pobierania wybranych kategorii na podstawie checkboxów
function getSelectedCategories() {
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  var selectedCategories = [];
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      selectedCategories.push(parseInt(checkboxes[i].value));
    }
  }
  return selectedCategories;
}

// Funkcja do obsługi kliknięcia diva o id "znaki" po wybraniu kategorii
znakiDiv.addEventListener('click', function() {
  var selectedCategories = getSelectedCategories();
  if (selectedCategories.length > 0) {
    displayQuestionAndAnswers(selectedCategories);
    znakiDiv.style.display = 'none'; // Ukryj div ze znakami po rozpoczęciu quizu
  } else {
    alert("Proszę wybrać co najmniej jedną kategorię.");
  }
});

// Funkcja do rozpoczęcia nowej gry po kliknięciu przycisku "Rozpocznij nową grę"
function resetGame() {
  score.totalQuestions = 0;
  score.correctAnswers = 0;
  updateScore();
  gameDiv.style.display = 'none';
  summaryDiv.style.display = 'none';  
}

//zabawa
function konamiCode() {
  const codeSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let currentCodeIndex = 0;

  function handleKeyPress(event) {
    const keyPressed = event.key;
    if (keyPressed === codeSequence[currentCodeIndex]) {
      currentCodeIndex++;

      if (currentCodeIndex === codeSequence.length) {
        // Wywołanie alertu po wpisaniu pełnej sekwencji
        alert("Oliwia ma racje");

        // Zresetowanie indeksu
        currentCodeIndex = 0;
      }
    } else {
      // Jeśli naciśnięto niewłaściwy klawisz, zaczynamy od początku
      currentCodeIndex = 0;
    }
  }

  // Dodanie event listenera do monitorowania klawiszy
  document.addEventListener("keydown", handleKeyPress);
}

// Wywołanie funkcji
konamiCode();

//zabawa



// Rozpocznij grę po załadowaniu strony
document.addEventListener('DOMContentLoaded', resetGame);
