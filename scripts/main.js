// Load the JSON recipes file
$(document).ready(function () {
  $.getJSON('../data/recipes.json', function (recipes) {
    for (var i in recipes) {
      showRecipe(recipes[i]);
    }
  });

});

// Grab the main card view of the recipe image and name, and insert it onto the screen
function showRecipe (recipe) {
  var recipeCard =
    '<div class="card m-3" data-toggle="modal" data-target="#recipe-modal-' + recipe.id + '" style="width: 22rem; height: 25rem;">' +
      '<img src="' + recipe.imageURL + '" class="card-img-top" style="max-width: 22rem; max-height: 22rem;>' +
      '<div class="card-body">' +
        '<div class="row justify-content-center my-3">' +
          '<h5 class="card-title">' + recipe.name + '</h5>' +
        '</div>' +
      '</div>' +
    '</div>';

  $('#recipe-card-container').append(recipeCard);

  // This will be all the info pertaining to each recipe.  It is hidden until a recipe is clicked on.  see html class "data-toggle" "data-target" for how to handle on click
  var recipeModal =
    '<div class="modal fade" id="recipe-modal-' + recipe.id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">' +
    '<div class="modal-dialog modal-lg" role="document">' +
      '<div class="modal-content">' +
        '<div class="modal-body">' +
          '<div class="text-center">' +
            '<img src="' + recipe.imageURL + '" class="card-img-top img-fluid" style="max-width: 30rem; max-height: 30rem;">' +
          '</div>' +
          '<h4 class="modal-title text-center my-3">' + recipe.name + '</h4>' +
          '<hr>' +
          '<p>Ingredients</p>' +
          '<ul id="modal-ingredients-' + recipe.id + '"></ul>' +
          '<p>Steps</p>' +
          '<ol id="modal-steps-' + recipe.id + '"></ol>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<p style="display: none;">Recipe Added!</p>' +
          '<button class="btn btn-primary save-recipe-button">Save</button>' +
          '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
        '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  $('#search-recipe-container').append(recipeModal);

  var ingredients = recipe.ingredients;
  for (var i in ingredients) {
    $('#modal-ingredients-' + recipe.id).append('<li>' + ingredients[i].quantity + ' ' + ingredients[i].name + '<br></li>');
  }
  var steps = recipe.steps;
  for (i in steps) {
    $('#modal-steps-' + recipe.id).append('<li>' + steps[i] + '<br></li>');
  }
}

// Search button click funcitonality
$('#search-button').click(function (event) {
  event.preventDefault();
  $('.card').each(function () {
    if (!$(this).text().toUpperCase().includes($('#recipe-search-input').val().toUpperCase())) {
      $(this).css('visibility', 'hidden');
    } else {
      $(this).css('visibility', 'visible');
    }
  });
});

// Live filtering of grid on seach bar inputs
// $('#recipe-search-input').on('input', function () {
//   // for each recipe card, if the string in the search bar is a substring of the name, keep visible, otherwise make it invisible
//   $('.card').each(function () {
//     if (!$(this).text().toUpperCase().includes($('#recipe-search-input').val().toUpperCase())) {
//       $(this).css('visibility', 'hidden');
//     } else {
//       $(this).css('visibility', 'visible');
//     }
//   });
// });


// save recipe when clicking recipe modal's save button
$(document).on('click', '.save-recipe-button', function(event) {
  var recipe_id = $(this).closest('.modal').attr('id').split('-')[2];
  save_recipe(recipe_id);
  // flash message next to save button
  $(this).prev().fadeIn();
  $(this).prev().fadeOut();
});

// save recipe to local storage
function save_recipe(recipe_id) {
  if(localStorage.getItem('my_recipe_list')) {
    var recipe_list = JSON.parse(localStorage.getItem('my_recipe_list'));
  } else {
    var recipe_list = {};
  }
  if (!recipe_list[recipe_id]) {
    recipe_list[recipe_id] = 1;
  } else {
    recipe_list[recipe_id]++;
  }
  console.log(recipe_list)
  localStorage.setItem('my_recipe_list', JSON.stringify(recipe_list));
}
