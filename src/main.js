import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import CategoriesListService from './services/categories-list-service.js';
import CategoryLookupService from './services/category-lookup-service.js';
import Category from './Category';
import Player from './player'

let categoryIds = [];
let categories = [];
let playerOne = new Player("Saoud", 0, true);
let playerTwo = new Player("Laurie", 0, false);

function scoreboardShow () {
  $(".playerOneName").text(playerOne.name)
  $(".playerOneScore").text(playerOne.score)
  $(".playerTwoName").text(playerTwo.name)
  $(".playerTwoScore").text(playerTwo.score)
}

function answerLogic(userAnswer, specificCat) {
  console.log(userAnswer, specificCat.answer, specificCat.value)
  if (userAnswer === specificCat.answer) {
    playerOne.score += specificCat.value
  } else {
    playerOne.score -= specificCat.value
    }
    
  scoreboardShow();
}


function displayErrors(error) {
  $('.show-errors').text(`${error}`);
}

function getCategoryIds(list) {
  console.log(list)
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
  scoreboardShow()
  let category1 = categories[0];
  let category2 = categories[1];
  $('.catOneTitle').text(category1.title.toUpperCase());
  $('.catTwoTitle').text(category2.title.toUpperCase());

  
  
  $("div.grid-container").on("click", "div", function() {
    //hide the board
    $("#boardContainer").hide();
    $("#questionContainer").show();

    console.log(this.id)
    
    let specificCat;
    if (this.id === "catOne200") {specificCat = category1.clues[200]}
    if (this.id === "catOne400") {specificCat = category1.clues[400]}
    if (this.id === "catOne600") {specificCat = category1.clues[600]}
    if (this.id === "catOne800") {specificCat = category1.clues[800]}
    if (this.id === "catOne1000") {specificCat = category1.clues[1000]}
    if (this.id === "catTwo200") {specificCat = category2.clues[200]}
    if (this.id === "catTwo400") {specificCat = category2.clues[400]}
    if (this.id === "catTwo600") {specificCat = category2.clues[600]}
    if (this.id === "catTwo800") {specificCat = category2.clues[800]}
    if (this.id === "catTwo1000") {specificCat = category2.clues[1000]}
    // This is to clear the value on the square on the board
    $("#" + this.id).text(" ");
    console.log(specificCat)
  
    $("#questionCard").text(`${specificCat.question}`)
    $(".question-btn").click(function () {
      let input = $("#answerBox").val();
      $(".inputContainer").hide();
      $("#answerContainer").show();
      answerLogic(input, specificCat);
      console.log(playerOne)
      
      $("#answer").html(`${specificCat.answer}`);
      $(".go-back-to-board-btn").click(function () {
        $("#answerContainer").hide();
        $(".inputContainer").show();
        $("#questionContainer").hide();
        $("#boardContainer").show();
      
      })


    })
      
  });
}

$(document).ready(function () {
  
  
  CategoriesListService.getCategoryList()
  .then(function (categoryListResponse) {
    if (categoryListResponse instanceof Error) {
      throw Error(`Category List API error: ${categoryListResponse.message}`);
    }
    getCategoryIds(categoryListResponse)
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
    
    console.log(categories[0]);
    console.log(categories[1]);
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