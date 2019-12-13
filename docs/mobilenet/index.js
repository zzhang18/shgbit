$("#image-selector").change(function () {
	let reader = new FileReader();
	reader.onload = function () {
			let dataURL = reader.result;
			$("#selected-image").attr("src", dataURL);
			$("#prediction-list").empty();
	}
	let file = $("#image-selector").prop("files")[0];
	reader.readAsDataURL(file);
}); 

$("#predict-button").click(function(){
  const img = document.getElementById('selected-image');
  $("#prediction-list").append(`<div class="progress progress-bar progress-bar-striped progress-bar-animated mb-2">Predicting ...</div>`);
  mobilenet.load().then(model => {
    // Classify the image.
    model.classify(img).then(predictions => {
      console.log('Predictions: ');
      console.log(predictions);
      $("#prediction-list").empty();
      predictions.forEach(function (p) {
          $("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
      });
      $("#predictBar").hide();
    });
  
  });
});