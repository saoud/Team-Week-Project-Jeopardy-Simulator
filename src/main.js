import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import CategoriesListService from './services/categories-list-service.js';
import CategoryLookupService from './services/category-lookup-service.js';
import Category from './Category';
import Player from './player';

let categoryIds = [];
let categories = [];
let playerOne = new Player("Laurie", 0, true);
let playerTwo = new Player("Saoud", 0, false);

function scoreboardShow() {
  $("#playerOneName").text(playerOne.name);
  $("#playerOneScore").text(playerOne.score);
  $("#playerTwoName").text(playerTwo.name);
  $("#playerTwoScore").text(playerTwo.score);
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

function getCategoryIds(list) {
  let randomIndices = [];
  while (randomIndices.length < 5) {
    let randomIndex = Math.floor(Math.random() * 100);
    if (randomIndices.indexOf(randomIndex) === -1) {
      randomIndices.push(randomIndex);
    }
  }
  for (let randomIndex of randomIndices) {
    categoryIds.push(list[randomIndex].id);
  }
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
  generateCategoryTitles();
  generateGridElements();

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

$(document).ready(function () {
  CategoriesListService.getCategoryList()
    .then(function (categoryListResponse) {
      if (categoryListResponse instanceof Error) {
        throw Error(`Category List API error: ${categoryListResponse.message}`);
      }
      getCategoryIds(categoryListResponse);
      //where we put the catergories ids go
      return CategoryLookupService.getCategory(categoryIds[0]);
    })
    .then(function (categoryResponse1) {
      if (categoryResponse1 instanceof Error) {
        throw Error(`category API error: ${categoryResponse1.message}`);
      }
      let category1 = new Category(categoryResponse1);
      categories.push(category1);
      return CategoryLookupService.getCategory(categoryIds[1]);
    }).then(function (categoryResponse2) {
      if (categoryResponse2 instanceof Error) {
        throw Error(`category API error: ${categoryResponse2.message}`);
      }
      let category2 = new Category(categoryResponse2);
      categories.push(category2);
      return CategoryLookupService.getCategory(categoryIds[2]);
    }).then(function (categoryResponse3) {
      if (categoryResponse3 instanceof Error) {
        throw Error(`category API error: ${categoryResponse3.message}`);
      }
      let category3 = new Category(categoryResponse3);
      categories.push(category3);
      return CategoryLookupService.getCategory(categoryIds[3]);
    }).then(function (categoryResponse4) {
      if (categoryResponse4 instanceof Error) {
        throw Error(`category API error: ${categoryResponse4.message}`);
      }
      let category4 = new Category(categoryResponse4);
      categories.push(category4);
      return CategoryLookupService.getCategory(categoryIds[4]);
    }).then(function (categoryResponse5) {
      if (categoryResponse5 instanceof Error) {
        throw Error(`category API error: ${categoryResponse5.message}`);
      }
      let category5 = new Category(categoryResponse5);
      categories.push(category5);
      createBoard();
    }).catch(function (error) {
      displayErrors(error.message);
    });




});