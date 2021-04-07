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
  if (playerOne.score < 0) { $("#playerOneScore").html(`<div class="text-danger">${playerOne.score}<div>`) }
  else { $("#playerOneScore").text(playerOne.score); }
  $("#playerTwoName").text(playerTwo.name);
  if (playerTwo.score < 0) { $("#playerTwoScore").html(`<div class="text-danger">${playerTwo.score}<div>`) }
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

function getCategoryIds(list) {
  let catIds = [];
  let randomIndices = [];
  while (randomIndices.length < 5) {
    let randomIndex = Math.floor(Math.random() * 100);
    if (randomIndices.indexOf(randomIndex) === -1) {
      randomIndices.push(randomIndex);
    }
  }
  console.log(randomIndices);
  for (let randomIndex of randomIndices) {
    catIds.push(list[randomIndex].id);
  }

  return catIds;
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

function makeCategoryList(categoryListResponse) {
  if (categoryListResponse instanceof Error) {
    throw Error(`Category List API error: ${categoryListResponse.message}`);
  }
  return categoryListResponse;
}

function makeRandomCategories(categoryListResponse) {
  categories = [];
  categoryIds = getCategoryIds(categoryListResponse);
  console.log(categoryIds);
  //where we put the catergories ids go
  return CategoryLookupService.getCategory(categoryIds[0])
    .then(function (categoryResponse1) {
      if (categoryResponse1 === undefined) {
        console.log("categoryResponse1 is undefined");
        return;
      }
      if (categoryResponse1 instanceof Error) {
        throw Error(`category API error: ${categoryResponse1.message}`);
      }
      let category1 = new Category(categoryResponse1);
      console.log(`categoryResponse1:`);
      console.log(categoryResponse1);
      if (category1.clues === null || category1.clues === undefined) {
        console.log("Invalid clue from category1");
        return makeRandomCategories(categoryListResponse);
      }
      categories.push(category1);
      return CategoryLookupService.getCategory(categoryIds[1]);
    }).then(function (categoryResponse2) {
      if (categoryResponse2 === undefined) {
        console.log("categoryResponse2 is undefined");
        return;
      }
      if (categoryResponse2 instanceof Error) {
        throw Error(`category API error: ${categoryResponse2.message}`);
      }
      console.log(`categoryResponse2:`);
      console.log(categoryResponse2);
      let category2 = new Category(categoryResponse2);
      if (category2.clues === null || category2.clues === undefined) {
        console.log("Invalid clue from category2");
        return makeRandomCategories(categoryListResponse);
      }
      categories.push(category2);
      return CategoryLookupService.getCategory(categoryIds[2]);
    }).then(function (categoryResponse3) {
      if (categoryResponse3 === undefined) {
        console.log("categoryResponse3 is undefined");
        return;
      }
      if (categoryResponse3 instanceof Error) {
        throw Error(`category API error: ${categoryResponse3.message}`);
      }
      console.log(`categoryResponse3:`);
      console.log(categoryResponse3);
      let category3 = new Category(categoryResponse3);
      if (category3.clues === null || category3.clues === undefined) {
        console.log("Invalid clue from category3");
        return makeRandomCategories(categoryListResponse);
      }
      categories.push(category3);
      return CategoryLookupService.getCategory(categoryIds[3]);
    }).then(function (categoryResponse4) {
      if (categoryResponse4 === undefined) {
        console.log("categoryResponse4 is undefined");
        return;
      }
      if (categoryResponse4 instanceof Error) {
        throw Error(`category API error: ${categoryResponse4.message}`);
      }
      console.log(`categoryResponse4:`);
      console.log(categoryResponse4);
      let category4 = new Category(categoryResponse4);
      if (category4.clues === null || category4.clues === undefined) {
        console.log("Invalid clue from category4");
        return makeRandomCategories(categoryListResponse);
      }
      categories.push(category4);
      return CategoryLookupService.getCategory(categoryIds[4]);
    }).then(function (categoryResponse5) {
      if (categoryResponse5 === undefined) {
        console.log("categoryResponse5 is undefined");
        return;
      }
      if (categoryResponse5 instanceof Error) {
        throw Error(`category API error: ${categoryResponse5.message}`);
      }
      console.log(`categoryResponse5:`);
      console.log(categoryResponse5);
      let category5 = new Category(categoryResponse5);
      if (category5.clues === null || category5.clues === undefined) {
        console.log("Invalid clue from category5");
        return makeRandomCategories(categoryListResponse);
      }
      categories.push(category5);
    });
}

$(document).ready(function () {
  CategoriesListService.getCategoryList()
    .then(makeCategoryList)
    .then(makeRandomCategories)
    .then(createBoard)
    .catch(function (error) {
      console.log(error);
      displayErrors(error.message);
    });
});
