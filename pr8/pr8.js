const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
  animate: true
};

const radDeg = (angle) => (Math.PI / 180) * angle;
const randomNumber = (num) => Math.random() * num;
const randomFixedNumber = (num) => Math.floor(Math.random() * num);
const randomRGBA = () =>
  `rgba(
    ${randomFixedNumber(255)},
    ${randomFixedNumber(255)},
    ${randomFixedNumber(255)},
    ${randomNumber(1)})
  `;

const infoObj = {
  rectAngle: 30,
  polygonAngle: 30,
  polygonAnimateRotate: false,
  num: 40,
  radius: 600,
  slides: 3,
  rectFill: randomRGBA(),
  rectStroke: randomRGBA(),
  rectShadow: randomRGBA(),
  background: randomRGBA(),
  blend: randomNumber(1) < 0.5 ? 'overlay' : 'source-over'
};

const sketch = ({ width, height }) => {
  const polygonPointsArray = polygonPoints({
    radius: infoObj.radius,
    slides: infoObj.slides,
  });
  
  let pointObj = rectPoints({
    width,
    height,
    angle: infoObj.rectAngle,
    num: infoObj.num,
  });

  return ({ context, width, height, frame }) => {
    
    resetBackground({context, width, height})
    drawPolygon({ context, width, height, pointsArray: polygonPointsArray });
    drawRects({ context, rectPoints: pointObj });
    pointObj = motionRefresh(width, height, frame, pointObj)
  };
};

const rectPoints = ({ width, height, angle, num }) => {
  angle = radDeg(angle);

  const pointObj = {};

  for (let i = 0; i < num; i++) {
    const w = randomNumber(width);
    const h = randomNumber(160) + 40;
    const x = randomNumber(width);
    const y = randomNumber(height);

    const rh = w * Math.tan(angle);

    pointObj[i] = { x, y, w, h, rh };
  }

  return pointObj;
};

const drawRect = (x, y, w, h, rh, context) => {
  context.save();
  context.translate(x, y);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(w, -rh);
  context.lineTo(w, h - rh);
  context.lineTo(0, h);
  context.closePath();

  context.strokeStyle = infoObj.rectStroke;
  context.fillStyle = infoObj.rectFill;
  context.lineWidth = "5";
  context.shadowColor = infoObj.rectShadow;
  context.shadowOffsetX = 10;
  context.shadowOffsetY = 20;

  context.fill();
  context.shadowColor = null;
  context.stroke();

  context.restore();
};

const drawRects = ({ context, rectPoints }) => {
  for (let key in rectPoints) {
    context.globalCompositeOperation = infoObj.blend

    const { x, y, w, h, rh } = rectPoints[key];
    drawRect(x, y, w, h, rh, context);

    context.globalCompositeOperation = 'source-over'

  }
};

const polygonPoints = ({ radius, slides }) => {
  const angle = (2 * Math.PI) / slides;
  const anglesArray = new Array(slides)
    .fill(0)
    .map((v, index) => index * angle);

  const pointsArray = anglesArray.map((angle) => {
    const posObj = {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    };
    return posObj;
  });

  return pointsArray;
};

const drawPolygon = ({ context, width, height, pointsArray }) => {

  context.save();
  context.translate(width / 2, height / 2);
  context.rotate(radDeg(infoObj.polygonAngle))
  context.lineWidth = "20";
  context.beginPath();
  context.moveTo(pointsArray[0].x, pointsArray[0].y);

  for (let i = 1; i < pointsArray.length; i++) {
    const nextP = pointsArray[i];
    context.lineTo(nextP.x, nextP.y);  
  }
  context.closePath()
  context.stroke();
  context.restore();
  context.clip();
};

const resetBackground = ({context, width, height}) => {
  context.fillStyle = infoObj.background;
  context.fillRect(0, 0, width, height);
}

const motionRefresh = (width, height, frame, pointObj) => {
  if (frame % 20 === 0 && infoObj.polygonAnimateRotate ) infoObj.polygonAngle += 1
  if (frame % 50 !== 0) return pointObj;

  infoObj.rectFill = randomRGBA()
  infoObj.rectStroke = randomRGBA()
  infoObj.rectShadow = randomRGBA()
  infoObj.background = randomRGBA()
  infoObj.blend = randomNumber(1) < 0.5 ? 'overlay' : 'source-over'
  pointObj = rectPoints({
    width,
    height,
    angle: infoObj.rectAngle,
    num: infoObj.num,
  });
  
  return pointObj
} 

canvasSketch(sketch, settings);
