const canvasSketch = require("../pr19/node_modules/canvas-sketch/dist/canvas-sketch.umd");

const settings = {
  dimensions: [2048, 2048],
};

const polygonInfo = {
  raduis: 600,
  slides: 5,
  rotateTetha: 0,
  lw: "20",
  xx: 0,
};

const insiderInfo = {
  raduis: Math.random() * (polygonInfo.raduis - 1) + 1,
  slides: 4,
  rotateTetha: 30,
  lw: Math.random() * polygonInfo.lw,
  xx: polygonInfo.raduis,
  count: 2,
};

const sketch = () => {
  const pointsArray = findPoints({
    r: polygonInfo.raduis,
    slides: polygonInfo.slides,
    xx: polygonInfo.xx,
  });

  // const countInsiders = insiderInfo.count;
  const insiderPointsObject = {};

  for (let i = 0; i < insiderInfo.count; i++) {
    const insiderPointsArray = findPoints({
      r: insiderInfo.raduis,
      slides: insiderInfo.slides,
      xx: insiderInfo.xx,
    });
    insiderPointsObject[i] = insiderPointsArray;
  }

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    const rotTetha = (Math.PI / 180) * polygonInfo.rotateTetha;
    const insiderTetha = (Math.PI / 180) * insiderInfo.rotateTetha;

    drawPolygon({
      context,
      width,
      height,
      pointsArray,
      rotateTetha: rotTetha,
      lw: polygonInfo.lw,
      xx: polygonInfo.xx,
    });
    // context.clip();

    drawInsiders({
      context,
      width,
      height,
      insiderPointsObject,
      rotateTetha: insiderTetha,
      lw: insiderInfo.lw,
      xx: 0,
    });
    context.restore();

    // drawInsiders({context, width, height, r: polygonInfo.raduis, rotateTetha: -Math.PI/4})
  };
};

const findPoints = ({ r, slides, xx }) => {
  const angle = (2 * Math.PI) / slides;
  const anglesArray = new Array(slides)
    .fill(0)
    .map((v, index) => index * angle);
  const positionArray = anglesArray.map((angle) => {
    const posObj = {
      x: r * Math.cos(angle) + Math.random() * xx,
      y: r * Math.sin(angle) + Math.random() * xx,
    };
    return posObj;
  });
  return positionArray;
};

const drawPolygon = ({
  context,
  width,
  height,
  pointsArray,
  rotateTetha = 0,
  lw,
  xx,
}) => {
  for (let i = 0; i < pointsArray.length; i++) {
    const currentP = pointsArray[i];
    const nextP =
      i === pointsArray.length - 1 ? pointsArray[0] : pointsArray[i + 1];

    context.save();
    context.translate(width / 2, height / 2);

    // context.rotate(-Math.PI / 2 + rotateTetha);
    context.lineWidth = lw;
    context.beginPath();
    context.moveTo(currentP.x + xx, currentP.y);
    context.lineTo(nextP.x + xx, nextP.y);
    context.stroke();
    context.restore();
  }
  // context.restore()
};

// const drawInsiders = ({ context, width, height, r, rotateTetha }) => {
//   const w = Math.random() * (r - 1) + 10;
//   const h = r * 0.05;

//   context.save();

//   context.beginPath();
//   context.translate(width / 2, height / 2);
//   context.rotate(rotateTetha);
//   context.lineWidth = "5";
//   context.rect(-w / 2, -h / 2, w, h);
//   context.stroke();
//   context.restore();
// };

const drawInsiders = ({
  context,
  width,
  height,
  insiderPointsObject,
  rotateTetha = 0,
  lw,
  xx,
}) => {
  for (let key in insiderPointsObject) {
    const pointsArray = insiderPointsObject[key];
    context.save();
    context.translate(width / 2, height / 2);

    context.rotate(-Math.PI / 2 + rotateTetha);
    context.lineWidth = lw;
    context.fillStyle = "red";
    context.beginPath();
    for (let i = 0; i < pointsArray.length; i++) {
      const currentP = pointsArray[i];
      const nextP =
        i === pointsArray.length - 1 ? pointsArray[0] : pointsArray[i + 1];
      if (i === 0) context.moveTo(currentP.x + xx, currentP.y);
      context.lineTo(nextP.x + xx, nextP.y);
      context.stroke();
    }
    context.fill();
    context.restore();
  }
  context.restore();
};
canvasSketch(sketch, settings);
