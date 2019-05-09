const API_ID = '26a5fadf';
const API_KEY = '627df20ed4f67c17b87c832eba1c3f37';

// Load the JSON recipes file
$(document).ready(function () {
  searchRecipe('', '1');
});

// Search button click funcitonality
$('#search-button').click(function (event) {
  event.preventDefault();
  var input = $('#recipe-search-input').val();
  input = input.toLowerCase().replace(' ', '+');
  searchRecipe(input, $('input[name=optradio]:checked', '#searchOptions').val());
});

function searchRecipe (query, searchParam) {
  var baseRequest = 'http://api.yummly.com/v1/api/recipes?_app_id=' + API_ID + '&_app_key=' + API_KEY + '&requirePictures=true&q=';
  var requestURL;

  // Search by recipe name
  if (searchParam === '1') {
    query = query.replace(' ', '+');
    requestURL = baseRequest + query;
  } else { // Search by ingredients
    query = query.replace('+', '&allowedIngredient[]=');
    query = '&allowedIngredient[]=' + query;
    requestURL = baseRequest + query;
  }

  if ($('option:selected').val() !== 'NONE') {
    requestURL = requestURL + '&allowedCuisine[]=' + $('option:selected').val();
  }

  $('#recipe-card-container').empty(); // clear recipes on page
  // show all recipes that match query
  $.getJSON(requestURL, function (search) {
    $('#search-attribution').empty();
    $('#search-attribution').append(search.attribution.html);
    var recipes = search.matches;
    if (recipes.length === 0) {
      $('#jumbotron').append(`<h5>Search results empty</h5>`);
    }
    for (var i = 0; i < recipes.length; i++) {
      showRecipeCard(recipes[i]);
    }
  });
}

// Show main recipe card with image and name
function showRecipeCard (recipe) {
  var recipeCard =
  `<div class="card m-3 overflow-hidden" data-toggle="modal" recipe-id=${recipe.id} data-target="#recipe-modal-${recipe.id}" style="width: 21rem; height: 21rem;">
      <img src="" class="card-img-top" id="img-${recipe.id}">
      <div class="card-body py-1">
        <div id="card-tags-${recipe.id}" class="row my-2 justify-content-center d-flex flex-nowrap overflow-hidden"></div>
        <div class="row justify-content-center my-1 px-5">
          <h5 class="card-title text-center" style="line-height: 120%;">${recipe.recipeName}</h5>
        </div>
      </div>
    </div>`;

  $('#recipe-card-container').append(recipeCard);

  // fetch recipe page and display modal
  var requestURL = 'http://api.yummly.com/v1/api/recipe/' + recipe.id + '?_app_id=' + API_ID + '&_app_key=' + API_KEY + '&maxResult=20';
  $.getJSON(requestURL, function (recipePage) {
    // console.log(recipePage);
    showRecipeModal(recipePage);
  });
}

// Add pop-up page for recipe card
function showRecipeModal (recipe) {
  // get largest image url
  var keys = Object.keys(recipe.images[0]);
  var image = recipe.images[0][keys[keys.length - 2]];
  // This will be all the info pertaining to each recipe.  It is hidden until a recipe is clicked on.  see html class "data-toggle" "data-target" for how to handle on click
  var recipeModal =
    `<div class="modal fade" id="recipe-modal-${recipe.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div class="text-center">
            <img src="${image}" class="card-img-top img-fluid" style="max-width: 30rem; max-height: 30rem;">
        </div>
        <h4 class="modal-title text-center my-2">${recipe.name}</h4>
        <div id="modal-tags-${recipe.id}" class="row mb-2 justify-content-center d-flex flex-nowrap overflow-hidden"></div>
        <div class="text-center">
          <p>Recipe information by <a href="${recipe.attribution['url']}">Yummly</a></p>
        </div>
        <hr>
        <h5 id=calories-${recipe.id}></h5>
        <h5>Servings: ${recipe.numberOfServings}</h5>
        <h5>Ingredients</h5>
        <ul id="modal-ingredients-${recipe.id}"></ul>
        <div class="container-fluid row">
          <h6 class="my-auto mr-2">Number of servings</h6>
          <input id="servings-form-${recipe.id}" type="number" class="form-control col-2" value="${recipe.numberOfServings}">
        </div>
      </div>
        <div class="modal-footer">
          <p class="my-auto mx-3" style="display: none;">Recipe Added!</p>
          <button class="btn btn-primary save-recipe-button" recipe-id="${recipe.id}">Save</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
        </div>
      </div>
    </div>`;
  $('#search-recipe-container').append(recipeModal);

  recipe.ingredientLines.forEach(function (ingredient) {
    $('#modal-ingredients-' + recipe.id).append('<li>' + ingredient + '<br></li>');
  });
  // set large image for recipe card
  $('#img-' + recipe.id).attr('src', image);

  // add tags to recipe card and modal
  var tags = recipe.attributes;
  for (var key in tags) {
    $('#card-tags-' + recipe.id).append('<span class="badge badge-pill badge-primary mx-1">' + tags[key][0] + '</span>');
    tags[key].forEach(function (tag) {
      $('#modal-tags-' + recipe.id).append('<span class="badge badge-pill badge-primary mx-1">' + tag + '</span>');
    });
  }

  // add calorie count if available
  var calories = null;
  recipe.nutritionEstimates.forEach(function (item) {
    if (item['attribute'] === 'FAT_KCAL') {
      calories = item['value'];
    }
  });
  if (calories) {
    $('#calories-' + recipe.id).text('Calories: ' + calories);
  }
}

// save recipe when clicking recipe modal's save button
$(document).on('click', '.save-recipe-button', function (event) {
  var recipeID = $(this).attr('recipe-id');
  saveRecipe(recipeID);
  // flash message next to save button
  $(this).prev().fadeIn();
  $(this).prev().fadeOut();
});

// save recipe to local storage
// recipes are saved as a js object {recipeID: numServings, ....}
function saveRecipe (recipeID) {
  // initialize client-side list
  var recipeList;
  if (localStorage.getItem('localRecipeList')) {
    recipeList = JSON.parse(localStorage.getItem('localRecipeList'));
  } else {
    recipeList = {};
  }
  // add recipe to list with number of servings
  var servings = Number($('#servings-form-' + recipeID).val());
  if (!recipeList[recipeID]) {
    recipeList[recipeID] = servings;
  } else {
    recipeList[recipeID] += servings;
  }
  localStorage.setItem('localRecipeList', JSON.stringify(recipeList));
}
