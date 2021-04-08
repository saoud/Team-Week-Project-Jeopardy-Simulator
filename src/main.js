import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import CategoriesListService from './services/categories-list-service.js';
import CategoryLookupService from './services/category-lookup-service.js';
import Category from './Category';
import Player from './player';

let categoryIds;
let categories;
let playerOne;
let playerTwo;

function scoreboardShow() {
  $("#playerOneName").text(playerOne.name);
  if (playerOne.score < 0) { $("#playerOneScore").html(`<div class="text-danger">${playerOne.score}<div>`); }
  else { $("#playerOneScore").text(playerOne.score); }
  $("#playerTwoName").text(playerTwo.name);
  if (playerTwo.score < 0) { $("#playerTwoScore").html(`<div class="text-danger">${playerTwo.score}<div>`); }
  else { $("#playerTwoScore").text(playerTwo.score); }
}

function answerLogic(userAnswer, clue) {
  console.log(userAnswer, clue.answer, clue.value);
  if (userAnswer.toLowerCase() === clue.answer.toLowerCase()) {
    if (playerOne.turn === true) {
      playerOne.score += clue.value;
      playerOne.turn = false;
      playerTwo.turn = true;
    } else {
      playerTwo.score += clue.value;
      playerOne.turn = true;
      playerTwo.turn = false;
    }

  } else {
    if (playerOne.turn === true) {
      playerOne.score -= clue.value;
      playerOne.turn = false;
      playerTwo.turn = true;
    } else {
      playerTwo.score -= clue.value;
      playerOne.turn = true;
      playerTwo.turn = false;
    }
  }

  return scoreboardShow();
}

function displayErrors(error) {
  $('.show-errors').text(`${error}`);
}

function generateCategoryTitles() {
  for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
    $("div.categoryTitles").append(`<div class="categoryTitle" data-category-index=${categoryIndex}>${categories[categoryIndex].title.toUpperCase()}</div>`);
  }
}

function generateGridElements() {
  for (let value = 200; value <= 1000; value += 200) {
    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
      $("div.grid-container").append(`<div class="clue" data-category-index=${categoryIndex} data-value=${value}>$${value}</div>`);
    }
  }
}

function createBoard() {
  let playerOneName = window.localStorage.getItem("playerOneName");
  let playerTwoName = window.localStorage.getItem("playerTwoName");
  playerOne = new Player(playerOneName, 0, true);
  playerTwo = new Player(playerTwoName, 0, false);

  generateCategoryTitles();
  generateGridElements();
  scoreboardShow();

  $("div.grid-container").on("click", "div", function (event) {
    //hide the board
    $("#boardContainer").hide();
    $("#scoreboard").hide();
    $("#questionContainer").show();

    console.log(event.target.id);
    const data = event.target.dataset;
    let clue = categories[data.categoryIndex].clues[data.value];

    // This is to clear the value on the square on the board
    $(event.target).html(`<span style="opacity:0;">$$$$$$</span>`).addClass("unclickable");

    $("#questionCard").text(`${clue.question.toUpperCase()}`);
    console.log(clue.answer);
    $(".question-btn").one("click", function (event) {
      // event.stopPropagation();
      event.preventDefault();
      let input = $("#answerBox").val();
      $(".inputContainer").hide();
      $("#answerContainer").show();
      answerLogic(input, clue);
      $("#answerBox").val('');

      $("#answer").html(`${clue.answer.toUpperCase()}`);
      $(".go-back-to-board-btn").one("click", function () {
        $("#answerContainer").hide();
        $(".inputContainer").show();
        $("#questionContainer").hide();
        $("#boardContainer").show();
        $("#scoreboard").show();
      });
    });
  });
}

$(".button").click(function () {
  let playerOneName = $("#playerNameInput").val();
  let playerTwoName = $("#playerTwoNameInput").val();

  window.localStorage.setItem("playerOneName", playerOneName);
  window.localStorage.setItem("playerTwoName", playerTwoName);

});

function getRandomId(categoryList) {
  let randomId;
  do {
    let randomIndex = Math.floor(Math.random() * categoryList.length);
    randomId = categoryList[randomIndex].id;
  } while (categoryIds.has(randomId));
  categoryIds.add(randomId);
  return randomId;
}

function makeCategoryList(categoryListResponse) {
  if (categoryListResponse instanceof Error) {
    throw Error(`Category List API error: ${categoryListResponse.message}`);
  }
  return categoryListResponse;
}

function getRandomCategory(categoryList) {
  let categoryId = getRandomId(categoryList);
  console.log(categoryId);
  return CategoryLookupService.getCategory(categoryId)
    .then(function(categoryResponse) {
      if (categoryResponse instanceof Error) {
        throw Error(`category API error: ${categoryResponse.message}`);
      }
      console.log(`categoryResponse:`);
      console.log(categoryResponse);
      let category = new Category(categoryResponse);
      if (category.clues === null || category.clues === undefined) {
        console.log("Missing clue in category");
        return getRandomCategory(categoryList);
      }
      categories.push(category);
    });
}

function getRandomCategories(categoryList) {
  categories = [];
  categoryIds = new Set();

  return getRandomCategory(categoryList)
    .then(() => getRandomCategory(categoryList))
    .then(() => getRandomCategory(categoryList))
    .then(() => getRandomCategory(categoryList))
    .then(() => getRandomCategory(categoryList));
}

$(document).ready(function () {
  CategoriesListService.getCategoryList()
    .then(makeCategoryList)
    .then(getRandomCategories)
    .then(createBoard)
    .catch(function (error) {
      console.log(error);
      displayErrors(error.message);
    });
});