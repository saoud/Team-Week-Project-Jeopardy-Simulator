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
let playerOne = new Player("Saoud", 0, true);
let playerTwo = new Player("Laurie", 0, false);

function scoreboardShow() {
  $(".playerOneName").text(playerOne.name);
  $(".playerOneScore").text(playerOne.score);
  $(".playerTwoName").text(playerTwo.name);
  $(".playerTwoScore").text(playerTwo.score);
}

function answerLogic(userAnswer, specificCat) {
  console.log(userAnswer, specificCat.answer, specificCat.value);
  if (userAnswer.toLowerCase() === specificCat.answer.toLowerCase()) {
    if (playerOne.turn === true) {
      playerOne.score += specificCat.value;
      playerOne.turn = false;
      playerTwo.turn = true;
    } else {
      playerTwo.score += specificCat.value;
      playerOne.turn = true;
      playerTwo.turn = false;
    }

  } else {
    if (playerOne.turn === true) {
      playerOne.score -= specificCat.value;
      playerOne.turn = false;
      playerTwo.turn = true;
    } else {
      playerTwo.score -= specificCat.value;
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

function createBoard() {
  let category1 = categories[0];
  let category2 = categories[1];
  $('.catOneTitle').text(category1.title.toUpperCase());
  $('.catTwoTitle').text(category2.title.toUpperCase());

  $("div.grid-container").on("click", "div", function (event) {
    //hide the board
    $("#boardContainer").hide();
    $("#questionContainer").slideDown();

    console.log(event.target.id);

    let specificCat;
    if (event.target.id === "catOne200") { specificCat = category1.clues[200]; }
    if (event.target.id === "catOne400") { specificCat = category1.clues[400]; }
    if (event.target.id === "catOne600") { specificCat = category1.clues[600]; }
    if (event.target.id === "catOne800") { specificCat = category1.clues[800]; }
    if (event.target.id === "catOne1000") { specificCat = category1.clues[1000]; }
    if (event.target.id === "catTwo200") { specificCat = category2.clues[200]; }
    if (event.target.id === "catTwo400") { specificCat = category2.clues[400]; }
    if (event.target.id === "catTwo600") { specificCat = category2.clues[600]; }
    if (event.target.id === "catTwo800") { specificCat = category2.clues[800]; }
    if (event.target.id === "catTwo1000") { specificCat = category2.clues[1000]; }

    // This is to clear the value on the square on the board
    $("#" + event.target.id).text("").addClass("unclickable");

    $("#questionCard").text(`${specificCat.question}`);
    console.log(specificCat.answer);
    $(".question-btn").one("click", function (event) {
      // event.stopPropagation();
      event.preventDefault();
      let input = $("#answerBox").val();
      $(".inputContainer").hide();
      $("#answerContainer").show();
      answerLogic(input, specificCat);
      $("#answerBox").val('');

      $("#answer").html(`${specificCat.answer}`);
      $(".go-back-to-board-btn").one("click", function () {
        $("#answerContainer").hide();
        $(".inputContainer").show();
        $("#questionContainer").hide();
        $("#boardContainer").show();
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
      createBoard();
    }).catch(function (error) {
      displayErrors(error.message);
    });
});

// for (let i=0;i<categories.length;i++) {
//   for (const [key, value] of Object.entries(categories[i].clues)) {
//     console.log(`${key}: ${value.question}`);
//   }
// }

// $('#catOne').html(`<div value='200'>$${category1.clues[200].value}</div>`);
// $(`#${category1.clues[200].id}`).click(function() {
//   alert( "Handler for .click() called." );
// });

// function clueFinder (clueObject) {

//   for (let i=0; i<categories.length;i++) {
//     for (const [key, value] of Object.entries(categories[i].clues)) {
//       // console.log(`the key is ${key}, the value is ${value}`)

//        }
//   }
// }