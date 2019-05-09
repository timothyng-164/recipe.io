const API_ID = '26a5fadf';
const API_KEY = '627df20ed4f67c17b87c832eba1c3f37';

$('#submit-plan').click(function (event) {
  event.preventDefault();

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
  var baseRequest = 'http://api.yummly.com/v1/api/recipes?_app_id=' + API_ID + '&_app_key=' + API_KEY + '&requirePictures=true&q=';
  baseRequest = baseRequest + allowedIng + cuisines + excludedIng;

  // GET on the URL
  $.getJSON(baseRequest, function (search) {
    // search.matches is an array of recipes as JSON objects
    console.log(search.matches);
  });
});
