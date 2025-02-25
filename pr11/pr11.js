const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true
};

let audio,audioContext, sourceNode, analyserNode, audioData, lastR, runFlag;

const sketch = () => {
  audioHandler()
  lastR = 10
  runFlag = false
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    analyserNode.getFloatFrequencyData(audioData);

    if (runFlag) {
      audioData.forEach(data => {
        const mapped = math.mapRange(data, analyserNode.minDecibels, analyserNode.maxDecibels, 0, 1, true)
        lastR = mapped * 200
        context.save()
        context.lineWidth = Math.random() * 19 + 1
        context.strokeStyle = randColor(lastR)
        context.translate(width/2, height/2)
        context.beginPath()
        context.arc(0,0, 5 * lastR, - Math.PI * Math.random() * mapped + frame /100 ,  Math.PI * Math.random() * mapped + frame/ 100)
        context.stroke()
        context.restore()
      })
    }
  };
};

const randColor = (r) => {
  const rand = new Array(3).fill(r).map(rr => Math.floor(Math.random() * rr))
  const color = rand.join(',')
  return `rgba(${color}, 0.5)`
}


const audioHandler = () => {
  audio = document.createElement('audio');
  audio.src = './Big Dream.mp3';

  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination)

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 256;
  analyserNode.smoothingTimeConstant = 0.9;

  sourceNode.connect(analyserNode);

  audioData = new Float32Array(analyserNode.frequencyBinCount);
}

const addListener = () => {
  window.addEventListener('click', () => {
    if (!audioContext) audioHandler()

    if (audio.paused) {
      console.log('audio played...')
      audio.play()
      runFlag = true
    }else{
      console.log('audio paused...')
      audio.pause()
      runFlag = false
    }
  })
}
addListener(audio)
canvasSketch(sketch, settings);
