let boxNumber = 3;
const rotateFlag = false;
const colorChangeFlag = true;
const boxes = [];
const rotateObj = {
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
};
let sumX = 0;
let sumY = 0;
let boxCenterInfo = { xw: 0, yw: 0 };
const chaosCubeFlag = true

const colorRand = (pVector) => {
  const r = Math.floor(random(255));
  const g = Math.floor(random(255));
  const b = Math.floor(random(255));
  pVector.r = r;
  pVector.g = g;
  pVector.b = b;
};

function setup() {
  createCanvas(800, 800, WEBGL);

  boxCenterInfo = findBoxCenterInfo();

  for (let x = 0; x < boxNumber; x++) {
    sumX += boxCenterInfo.xw;
    sumY += boxCenterInfo.yw;
    for (let y = 0; y < boxNumber; y++) {
      for (let z = 0; z < boxNumber; z++) {
        const infoObj = {
          x,
          y,
          z,
          xw: boxCenterInfo.xw,
          yw: boxCenterInfo.yw,
          colorChangeFlag,
          r: random(255),
          g: random(255),
          b: random(255) 
        };
        const pVector = findBoxInfo(infoObj);
        const b = new Box(pVector);
        boxes.push(b);
      }
    }
  }
}

function draw() {
  background(0);

  orbitControl();
  rotateHandler(rotateFlag);
  translate(-sumX / 2, -sumY / 2);
  boxes.forEach((box) => box.show());
  translate(sumX / 2, sumY / 2);

  if (chaosCubeFlag && frameCount % 20 === 0 && frameCount) {
    choaticCubes(random(1) > 0.5)
  }
}

function findBoxCenterInfo(bNumber = boxNumber) {
  let factor = map(bNumber, 1, 10, 0.6, 0.9);
  factor = factor >= 0.9 ? 0.9 : factor;
  const xw = Math.floor((width * factor) / bNumber);
  const yw = Math.floor((height * factor) / bNumber);
  return { xw, yw };
}

function findBoxInfo(infoObj) {
  const { x, y, z, xw, yw, r,g,b, colorChangeFlag } = infoObj;
  const xx = x * xw + xw / 2
  const yy = y * yw + yw / 2
  const pVector = {
    x: xx,
    y: yy,
    z: -z * xw,
    len: xw,
    r,
    g,
    b,
  };

  if (colorChangeFlag) colorRand(pVector);

  return pVector;
}

function rotateHandler(rotateFlag) {
  if (!rotateFlag) return;
  rotateX(rotateObj.rotateX);
  rotateY(rotateObj.rotateY);
  rotateZ(rotateObj.rotateZ);
  for (let key in rotateObj) {
    rotateObj[key] += 0.001;
  }
}

function choaticCubes(fillFlag) {
  const bNum = Math.ceil(random(2 * boxNumber));
  const { xw, yw } = findBoxCenterInfo(bNum);
  const x = Math.floor(random(bNum));
  const y = Math.floor(random(bNum));
  const z = Math.floor(random(bNum));
  const maxXw = boxCenterInfo.xw;
  const maxYw = boxCenterInfo.yw;

  const infoObj = {
    x,
    y,
    z,
    xw: maxXw > xw ? xw : maxXw,
    yw: maxYw > yw ? yw : maxYw,
    r: random(255),
    g: random(255),
    b: random(255),
    colorChangeFlag: false,
  }

  if (
    (infoObj.x * infoObj.xw + infoObj.xw/2 > sumX) ||
    (infoObj.x * infoObj.xw + infoObj.xw/2 < -sumX) ||
    (infoObj.y * infoObj.yw + infoObj.yw/2 > sumY) ||
    (infoObj.y * infoObj.yw + infoObj.yw/2 > sumY)
  ) {
    boxNumber = bNum
  }

  const pVector = findBoxInfo(infoObj);
  const b = new Box(pVector, fillFlag);
  boxes.push(b);
}
