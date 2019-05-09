const API_ID = '26a5fadf';
const API_KEY = '627df20ed4f67c17b87c832eba1c3f37';


$(document).ready(function () {
  $('#table-container').hide();
});


$('#submit-plan').click(function (event) {
  event.preventDefault();
  $('#table-rows *').remove();

  var allowedIng = '';
  var excludedIng = '';
  var cuisines = '';

  // Create allowed ingredients URL parameter
  if ($('#plan-ingredients').val() !== '') {
    allowedIng = '&allowedIngredient[]=';
    allowedIng = allowedIng + $('#plan-ingredients').val().replace('\n', '&allowedIngredient[]=');
  }

  // Create excluded ingredients URL parameter
  if ($('#excluded-ingredients').val() !== '') {
    excludedIng = '&excludedIngredient[]=';
    excludedIng = excludedIng + $('#excluded-ingredients').val().replace('\n', '&excludedIngredient[]=');
  }

  // Create cuisine URL parameter
  if ($('option:selected').val() !== 'NONE') {
    $.each($('option:selected'), function (index, item) {
      cuisines = cuisines + '&allowedCuisine[]=' + $(item).val();
    });
  }

  // Create the full URL
  var numMeals = 7;
  var baseRequest = 'http://api.yummly.com/v1/api/recipes?_app_id=' + API_ID + '&_app_key=' + API_KEY + '&requirePictures=true&q=';
  baseRequest = baseRequest + allowedIng + cuisines + excludedIng + '&maxResult=' + numMeals;

  // load meal plan table with recipes
  $.getJSON(baseRequest, function (search) {
    // search.matches is an array of recipes as JSON objects
    for (var i = 0; i < numMeals; i++) {
      $('#recipe-list-table').append(
        `<tr>
          <td>${search.matches[i].recipeName}</td>
          <td><button class="add-recipe-button" recipe-id="${search.matches[i].id}">Add</button></td>
        <tr>`
      )
    }
    console.log(search.matches);
  });

  $('#plan-form-container').hide();
  $('#table-container').show();
});

$(document).on('click', '#new-plan-button', function(event) {
  $('#plan-form-container').show();
  $('#table-container').hide();
});

// save recipe when clicking recipe modal's save button
$(document).on('click', '.add-recipe-button', function (event) {
  var recipeID = $(this).attr('recipe-id');
  saveRecipe(recipeID);
});


// save all recipes to shopping list when clicking save-all button
$(document).on('click', '#add-all-button', function (event) {
  $('.add-recipe-button').each(function() {
    var recipeID = $(this).attr('recipe-id');

    saveRecipe(recipeID);
  });
});


// save recipe to local storage
function saveRecipe (recipeID) {
  // initialize client-side list
  var recipeList;
  if (localStorage.getItem('localRecipeList')) {
    recipeList = JSON.parse(localStorage.getItem('localRecipeList'));
  } else {
    recipeList = {};
  }
    console.log(recipeList);
  // add recipe to list with number of servings

  $.ajaxSetup({
    async: false
  });

  var requestURL = `http://api.yummly.com/v1/api/recipe/${recipeID}?_app_id=${API_ID}&_app_key=${API_KEY}`;
  $.getJSON(requestURL, function (recipePage) {
    var servings = recipePage.numberOfServings;
    if (!recipeList[recipeID]) {
      recipeList[recipeID] = servings;
    } else {
      recipeList[recipeID] += servings;
    }
    localStorage.setItem('localRecipeList', JSON.stringify(recipeList));
  });

  $.ajaxSetup({
    async: true
  });
}
