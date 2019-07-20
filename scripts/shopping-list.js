const API_ID = '26a5fadf';
const API_KEY = '627df20ed4f67c17b87c832eba1c3f37';

$(document).ready(function () {
  loadTables();
});

// populate recipe and ingredient tables
function loadTables () {
  // check if localStorage is intialized or empty
  if (localStorage.localRecipeList.length === 0 || localStorage.localRecipeList === '{}') {
    $('#table-container').hide();
    $('#empty-cart-message').show();
    return;
  } else {
    $('#table-container').show();
    $('#empty-cart-message').hide();
  }

  $('tbody *').remove(); // clear all table rows
  var recipeList = JSON.parse(localStorage.getItem('localRecipeList'));

  // add recipe servings to table
  for (var id in recipeList) {
    $('#recipe-list-table tbody').append(
      `<tr id="recipe-row-${id}">
        <td>${recipeList[id]}</td>
        <td><button class="remove-recipe" recipe-id="${id}">x</button></td>
      <tr>`
    );
  }
  for (var i in recipeList) {
    var requestURL = 'https://api.yummly.com/v1/api/recipe/' + i + '?_app_id=' + API_ID + '&_app_key=' + API_KEY + '&maxResult=20';
    $.getJSON(requestURL, function (recipe) {
      // add recipe name to table
      $(`#recipe-row-${recipe.id}`).prepend(
        `<td>${recipe.name}</td>`
      );
      // add ingredients to table
      recipe.ingredientLines.forEach(function (ingredient) {
        $('#ingredient-list-table tbody').append(
          `<tr id="box">
            <td id="text">${ingredient}</td>
            <td><button class="remove">x</button></td>
          </tr>`
        );
      });
    });
  }
}

// remove ingredient when clicking 'x' button
$(document).on('click', '.remove', function () {
  $(this).parents('tr').remove();
});

// remove recipe when pressing 'x' button
$(document).on('click', '.remove-recipe', function (event) {
  var recipeList = JSON.parse(localStorage.getItem('localRecipeList'));
  var id = $(this).attr('recipe-id');
  delete recipeList[id];
  localStorage.setItem('localRecipeList', JSON.stringify(recipeList));
  loadTables();
});

$(document).on('click', '#clear-all-button', function (event) {
  localStorage.setItem('localRecipeList', '{}');
  loadTables();
});
