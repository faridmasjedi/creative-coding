const canvasSketch = require('../pr19/node_modules/canvas-sketch/dist/canvas-sketch.umd');
const math = require('canvas-sketch-util/math');
const eases = require('eases');

const settings = {
  dimensions: [ 2048, 2048 ],
  animate: true
};

const info = {
  arcNum: 4,
  fftPower : 10, // this should be greater than 5
  fill : false,
  lwFlag : true
}

let audio,audioContext, sourceNode, analyserNode, audioData, lastR, runFlag;

const sketch = () => {
  audioHandler()
  runFlag = false
  let color = randColor(256)
  let lastColor = 'white'
  return ({ context, width, height, frame }) => {
    context.fillStyle = lastColor
    context.fillRect(0, 0, width, height);
    analyserNode.getFloatFrequencyData(audioData);
    
    if (runFlag) {
      if (frame % 200 === 20) {
        lastColor = randColor(256)
        color = randColor(256)
      }
      const slicedAudioData = audioDataSplit();
      slicedAudioData.forEach((dataArr, ind) => {
        lastR = 2048 / (info.arcNum + 1) * (ind)
        dataArr.forEach((data, index) => {
          const rand = info.fill ? (Math.random() * 2 + 1 ) : 1
          const lw = (index + 1)/(dataArr.length-1) * Math.abs(data) * rand
          const lwNumber = info.lwFlag ? (Math.random() * index + 1 )/10 : 1
          const tetha = (2 * Math.PI ) / dataArr.length
          
          context.save()
          context.lineWidth = lw * lwNumber
          context.strokeStyle = color
          context.translate(width/2, height/2)
          context.beginPath()
          context.arc(0,0, lastR, index * tetha + frame/500 % 360 , (index+1) * tetha + frame/500 %360)
          context.stroke()
          context.restore()
        })
      })
    }
  };
};

const audioDataSplit = () => {
  const result = [];
  const audioDataSize = 2 ** (info.fftPower - 1)
  const sliceSize = Math.floor(audioDataSize/info.arcNum)
  for (let i=0; i < audioData.length; i += sliceSize){
    result.push(audioData.slice(i ,i+sliceSize));
  }
  return result
}

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
  analyserNode.fftSize = 2 ** info.fftPower;
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
