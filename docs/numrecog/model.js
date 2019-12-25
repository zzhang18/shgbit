const tf = require('@tensorflow/tfjs-node');
(async function () {
  var model = await tf.loadLayersModel('https://zzhang18.github.io/shgbit/numrecog/tfjs-models/mnist/model.json');
  model.compile({
    optimizer: 'rmsprop',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  model.summary();
})();