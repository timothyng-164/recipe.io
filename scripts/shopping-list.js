$(document).ready(function () {
  load_tables();
});


// populate recipe and ingredient tables
function load_tables() {
  $('tbody *').remove();  // clear all table rows
  var local_recipe_list = JSON.parse(localStorage.getItem('my_recipe_list'));

  $.getJSON('../data/recipes.json', function (all_recipes) {
    for (var id in local_recipe_list) {
      var recipe = all_recipes.find(recipe => recipe.id == id);
      // show recipe in table
      $('#recipe-list-table tbody').append(
        '<tr>' +
          '<td>' + recipe.name +'</td>' +
          '<td>' + local_recipe_list[id] +'</td>' +
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
          '<td>' + ingredients[i].name+ '</td>' +
        '</tr>'
        );
      }
    }
  });
}


// remove recipe when pressing 'x' button
$(document).on('click', '.remove-recipe', function (event) {
  var local_recipe_list = JSON.parse(localStorage.getItem('my_recipe_list'));
  var id = $(this).attr('recipe_id');
  delete local_recipe_list[id];
  localStorage.setItem('my_recipe_list', JSON.stringify(local_recipe_list));
  load_tables();

});
