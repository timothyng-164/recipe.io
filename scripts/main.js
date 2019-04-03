$(document).ready(function () {
  // $('#search-recipe-container').hide();
  $('#add-recipe-container').hide();

  $.getJSON('../data/recipes.json', function (data) {
    console.log(data);
  });
});

$('#recipe-search-btn').on('click', function () {
  $('#search-recipe-container').show();
  $('#add-recipe-container').hide();
});

$('#recipe-add-btn').on('click', function () {
  $('#search-recipe-container').hide();
  $('#add-recipe-container').show();
});
