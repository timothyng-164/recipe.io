$(document).ready(function () {
  loadTables();
});

// populate recipe and ingredient tables
function loadTables () {
  $('tbody *').remove();// clear all table rows
  var localRecipeList = JSON.parse(localStorage.getItem('my_recipe_list'));

  $.getJSON('../data/recipes.json', function (allRecipes) {
    for (var id in localRecipeList) {
      var recipe = allRecipes.find(recipe => recipe.id === parseInt(id));
      // show recipe in table
      $('#recipe-list-table tbody').append(
        '<tr>' +
          '<td>' + recipe.name + '</td>' +
          '<td>' + localRecipeList[id] + '</td>' +
          '<td><button class="remove-recipe" recipe_id="' + id + '">x</button></td>' +
        '</tr>'
      );

      // show ingredient in table
      var ingredients = recipe.ingredients;
      for (var i in ingredients) {
        $('#ingredient-list-table tbody').append(
          '<tr>' +
            '<td><input type="checkbox"></td>' +
            '<td>' + ingredients[i].quantity + '</td>' +
            '<td>' + ingredients[i].name + '</td>' +
          '</tr>'
        );
      }
    }
  });
}

// remove recipe when pressing 'x' button
$(document).on('click', '.remove-recipe', function (event) {
  var localRecipeList = JSON.parse(localStorage.getItem('my_recipe_list'));
  var id = $(this).attr('recipe_id');
  delete localRecipeList[id];
  localStorage.setItem('my_recipe_list', JSON.stringify(localRecipeList));
  loadTables();
});
