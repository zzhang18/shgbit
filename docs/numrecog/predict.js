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

let model;
(async function () {
	console.log('loading model');
	// model = await tf.loadModel("http://localhost:81/tfjs-models/Num/model.json");
	model = await tf.loadLayersModel(
    '/tfjs-models/Num/model.json');
	model.summary();
	await model.compile({
		optimizer: 'adam',
		loss: 'sparseCategoricalCrossentropy',
		metrics: ['accuracy']
	});
	// await model.predict(tf.tensor2d(extract()).reshape([1, 28, 28, 1]));
	console.log('loaded');
	$(".progress-bar").hide();
	
})();


$("#predict-button").click(async function(){
    
	let image = $("#selected-image").get(0);
	let tensor = tf.browser.fromPixels(image,1)
		// .resizeNearestNeighbor([224, 224])
		.resizeNearestNeighbor([28, 28])
		.toFloat()
		.expandDims();


	// More pre-processing to be added here later

	let predictions = await model.predict(tensor.reshape([1, 28, 28, 1]));
	console.log(predictions);
	let result1 = Array.from(predictions.argMax(1).dataSync());
	let result = Array.from(predictions.argMax(1).dataSync());
	console.log(result1);
	$("#prediction-list").empty();
	$("#prediction-list").append(`<p>Result: ${result[0]}</p>`);
	// let predictions = await model.predict(tensor).data();
	// let top5 = Array.from(predictions)
	// 		.map(function (p, i) {
	// 				return {
	// 						probability: p,
	// 						className: IMAGENET_CLASSES[i]
	// 				};
	// 		}).sort(function (a, b) {
	// 				return b.probability - a.probability;
	// 		}).slice(0, 5);

	// $("#prediction-list").empty();
	// top5.forEach(function (p) {
	// 		$("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
	// });
});

