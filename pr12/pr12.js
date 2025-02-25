const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const eases = require('eases');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true
};

let audio,audioContext, sourceNode, analyserNode, audioData, lastR, runFlag;

const sketch = () => {
  audioHandler()
  lastR = 10
  runFlag = false
  let color = randColor(lastR)

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    if (frame %100 === 0) color = randColor(400)
    analyserNode.getFloatFrequencyData(audioData);
    if (runFlag) {
      audioData.forEach((data, index) => {
        const mapped = math.mapRange(data, analyserNode.minDecibels, analyserNode.maxDecibels, 0, 1, true)
        const lw = eases.expoIn(index/(audioData.length-1)) * 200
        lastR = math.mapRange(lw * 400, 0, 100000, 400, 2048)
        const sgn = Math.random() * (index / audioData.length) > 0.5 ? 1 : -1
        context.save()
        context.lineWidth = lastR
        context.strokeStyle = color
        context.translate(width/2, height/2)
        context.beginPath()
        context.arc(0,0, lastR, -sgn * Math.PI * Math.random() * mapped + frame /300 , sgn * Math.PI * Math.random() * mapped + frame/ 300)
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
  analyserNode.fftSize = 32;
  analyserNode.smoothingTimeConstant = 0.95;

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
