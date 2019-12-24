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
$(".progress-bar").hide();


(async function () {
	console.log('loading model');
	$(".progress-bar").show();
	// model = await tf.loadModel("http://localhost:81/tfjs-models/mnist/model.json");
	// model = await tf.loadLayersModel('/tfjs-models/mnist/model.json');
	model = await tf.loadLayersModel('https://zzhang18.github.io/shgbit/numrecog/tfjs-models/mnist/model.json');

	model.summary();

	// await model.compile({
	// 	optimizer: 'adam',
	// 	loss: 'sparseCategoricalCrossentropy',
	// 	metrics: ['accuracy']
	// });

	const optimizer = 'rmsprop';
	await model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
	});
	// await model.predict(tf.tensor2d(extract()).reshape([1, 28, 28, 1]));
	console.log('loaded');
	$(".progress-bar").hide();
	
})();



$("#load-button").click(async function(){
	$(".progress-bar").show();
	const jsonUpload = document.getElementById('model');
	const weightsUpload = document.getElementById('weights');
	model = await tf.loadLayersModel(
	tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]));
	model.summary();

	const optimizer = 'rmsprop';
	await model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
	});
	// await model.predict(tf.tensor2d(extract()).reshape([1, 28, 28, 1]));
	console.log('loaded');
	$(".progress-bar").hide();

});

$("#predict-button").click(async function(){
    
	let image = $("#selected-image").get(0);
	let tensor = tf.browser.fromPixels(image,1)
		// .resizeNearestNeighbor([224, 224])
		.resizeNearestNeighbor([28, 28])
		.toFloat()
		.expandDims();

	// console.log('tensor',tensor);
	// .print();
	console.log('input',tensor.dataSync());
	// More pre-processing to be added here later

	let predictions = await model.predict(tensor.reshape([1, 28, 28, 1]));
	console.log('predictions',predictions);
	let result = Array.from(predictions.argMax(1).dataSync());
	console.log('result',result);
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

