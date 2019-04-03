$(document).ready(function () {

  $.getJSON('data/recipes.json', function (recipes) {
    for (i in recipes) {
      show_recipe(recipes[i]);
    }
  });
});


function show_recipe(recipe) {
  var recipe_card =
    '<div class="card m-3" data-toggle="modal" data-target="#recipe-modal-' + recipe.id +'" style="width: 22rem; height: 25rem;">' +
      '<img src="' + recipe.imageURL + '" class="card-img-top" style="max-width: 22rem; max-height: 22rem;>' +
      '<div class="card-body">' +
        '<div class="row justify-content-center my-3">' +
          '<h5 class="card-title">' + recipe.name + '</h5>' +
        '</div>' +
      '</div>' +
    '</div>';

  $('#recipe-card-container').append(recipe_card);

  var recipe_modal =
    '<div class="modal fade" id="recipe-modal-' + recipe.id +'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">' +
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
          '<button class="btn btn-primary">Save</button>' +
          '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
        '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  $('#search-recipe-container').append(recipe_modal);

  var ingredients = recipe.ingredients;
  for (i in ingredients) {
    $('#modal-ingredients-' + recipe.id).append('<li>' + ingredients[i].quantity + ' ' + ingredients[i].name + '<br></li>');
  }
  var steps = recipe.steps;
  for (i in steps) {
    $('#modal-steps-' + recipe.id).append('<li>' + steps[i] + '<br></li>');
  }

}
