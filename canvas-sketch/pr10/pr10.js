const canvasSketch = require("../pr19/node_modules/canvas-sketch/dist/canvas-sketch.umd");
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [2048, 2048],
  animate: true,
};

let audio, audioContext, sourceNode, analyserNode, audioData, lastR, runFlag;

const sketch = () => {
  audioHandler();
  lastR = 10;
  runFlag = false;
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    analyserNode.getFloatFrequencyData(audioData);

    if (runFlag) {
      audioData.forEach((data) => {
        const mapped = math.mapRange(
          data,
          analyserNode.minDecibels,
          analyserNode.maxDecibels,
          0,
          1,
          true
        );
        lastR = mapped * 200;
        context.save();
        context.lineWidth = "5";
        context.strokeStyle = randColor(lastR);
        context.translate(width / 2, height / 2);
        context.beginPath();
        context.arc(0, 0, 5 * lastR, 0, 2 * Math.PI);
        context.stroke();
        context.restore();
      });
    }
  };
};

const randColor = (r) => {
  const rand = new Array(3).fill(r).map((rr) => Math.floor(Math.random() * rr));
  const color = rand.join(",");
  return `rgba(${color}, 0.5)`;
};

const audioHandler = () => {
  audio = document.createElement("audio");
  audio.src = "./Big Dream.mp3";

  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  sourceNode.connect(analyserNode);
  audioData = new Float32Array(analyserNode.frequencyBinCount);
};

const getAverage = (data) => {
  const avg = data.reduce((sum, d) => sum + d, 0);
  return avg / data.length;
};

const addListener = () => {
  window.addEventListener("click", () => {
    if (!audioContext) audioHandler();
    console.log(audio);
    if (audio.paused) {
      audio.play();
      runFlag = true;
    } else {
      audio.pause();
      runFlag = false;
    }
  });
};

addListener(audio);
canvasSketch(sketch, settings);
