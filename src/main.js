import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import CategoriesListService from './services/categories-list-service.js';
import CategoryLookupService from './services/category-lookup-service.js';

let input = 11578;
let input2 = 11604;

function displayErrors(error) {
  $('.show-errors').text(`${error}`);
}

$(document).ready(function () {


  CategoriesListService.getCategoryList()
    .then(function (categoryListResponse) {
      if (categoryListResponse instanceof Error) {
        throw Error(`Category List API error: ${categoryListResponse.message}`);
      }
      console.log(categoryListResponse);
      //where we put the catergories ids go
      return CategoryLookupService.getCategory(input);
    })
    .then(function (categoryResponse1) {
      if (categoryResponse1 instanceof Error) {
        throw Error(`category API error: ${categoryResponse1.message}`);
      }
      console.log(categoryResponse1);
      return CategoryLookupService.getCategory(input2);
    }).then(function (categoryResponse2) {
      if (categoryResponse2 instanceof Error) {
        throw Error(`category API error: ${categoryResponse2.message}`);
      }
      console.log(categoryResponse2);
    }).catch(function (error) {
      displayErrors(error.message);
    });
});
