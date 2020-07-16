import * as posenet from "@tensorflow-models/posenet";
import { drawLine, throttle, drawCircle, isMobile, setupCamera } from "./utils";
import NoSleep from "nosleep.js";

const width = 1600;
const height = 800;

const upArrow = new Image();
upArrow.src = require("./up-arrow.png");
const downArrow = new Image();
downArrow.src = require("./down-arrow.png");
const muteImg = new Image();
muteImg.src = require("./mute.png");
const unmuteImg = new Image(90, 90);
unmuteImg.src = require("./speaker.png");

const upImgPos = {
  x: 16,
  y: 16,
};
const downImgPos = {
  x: 16,
  y: 256,
};
const soundImgPos = {
  x: width - (muteImg.width + 64),
  y: 64,
};

var warnSound = new Audio(
  "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
);
let net;
let angleThreshold = 15;
let soundMuted = false;
const toggleSound = throttle(() => {
  soundMuted = !soundMuted;
  if (!soundMuted) {
    warnSound.play();
  }
}, 1000);
const canvas = document.getElementById("output");
const ctx = canvas.getContext("2d");

canvas.addEventListener(
  "click",
  function (event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    if (
      pointInCircle(
        { x, y },
        { x: soundImgPos.x + 64, y: soundImgPos.y + 64 },
        500
      )
    ) {
      drawCircle({ x, y }, ctx);
      toggleSound();
    }
    if (
      pointInCircle({ x, y }, { x: upImgPos.x + 64, y: upImgPos.y + 64 }, 64)
    ) {
      angleThreshold++;
    }
    if (
      pointInCircle(
        { x, y },
        { x: downImgPos.x + 64, y: downImgPos.y + 64 },
        64
      )
    ) {
      angleThreshold--;
    }
  },
  false
);

async function detectPoseInRealTime(video) {
  canvas.width = width;
  canvas.height = height;

  async function poseDetectionFrame() {
    let backAngle = 0;
    let minPoseConfidence = 0.7;
    let minPartConfidence = 0.6;
    let pose = await net.estimatePoses(video, {
      flipHorizontal: true,
      decodingMethod: "single-person",
    });
    pose = pose[0];
    const keypoints = pose.keypoints;
    const rightHip = keypoints.find((k) => k.part === "rightHip");
    const rightShoulder = keypoints.find((k) => k.part === "rightShoulder");
    const leftHip = keypoints.find((k) => k.part === "leftHip");
    const leftShoulder = keypoints.find((k) => k.part === "leftShoulder");
    const leftWrist = keypoints.find((k) => k.part === "leftWrist");
    const rightWrist = keypoints.find((k) => k.part === "rightWrist");
    // console.log(leftWrist,rightWrist)
    const minConfidence = 0.5;
    if (
      leftHip.score > minConfidence &&
      leftShoulder.score > minConfidence &&
      leftHip.score > rightHip.score &&
      leftShoulder.score > rightShoulder.score
    ) {
      const dx = leftHip.position.x - leftShoulder.position.x;
      const dy = leftShoulder.position.y - leftHip.position.y;
      const newAngle = Math.atan2(dy, dx);
      if (newAngle) backAngle = Math.abs(newAngle * (180 / Math.PI)).toFixed(2);
    } else if (
      rightHip.score > minConfidence &&
      rightShoulder.score > minConfidence
    ) {
      const dx = rightHip.position.x - rightShoulder.position.x;
      const dy = rightShoulder.position.y - rightHip.position.y;
      const newAngle = Math.atan2(dy, dx);
      if (newAngle) backAngle = Math.abs(newAngle * (180 / Math.PI)).toFixed(2);
    }
    if (backAngle && angleThreshold <= Math.abs(backAngle - 90)) {
      if (!soundMuted) warnSound.play();
    }

    ctx.clearRect(0, 0, width, height);
    ctx.font = "70px Verdana";
    ctx.fillStyle = "cyan";

    if (true) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-width, 0);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();
    }

    ctx.globalAlpha = 0.7;
    ctx.drawImage(
      soundMuted ? muteImg : unmuteImg,
      soundImgPos.x,
      soundImgPos.y
    );
    ctx.drawImage(upArrow, upImgPos.x, upImgPos.y);
    ctx.font = "64px Verdana";
    // ctx.fillStyle = "CornflowerBlue";
    ctx.fillText(angleThreshold, upImgPos.x + 16, downImgPos.y - 32);
    ctx.drawImage(downArrow, downImgPos.x, downImgPos.y);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 4;
    drawCircle({ x: soundImgPos.x + 64, y: soundImgPos.y + 64 }, ctx);
    if (rightWrist.score > 0.3) {
      let { x, y } = rightWrist.position;
      if (
        pointInCircle(
          { x, y },
          { x: soundImgPos.x + 64, y: soundImgPos.y + 64 },
          128
        )
      ) {
        toggleSound();
      }
      if (
        pointInCircle({ x, y }, { x: upImgPos.x + 64, y: upImgPos.y + 64 }, 64)
      ) {
        angleThreshold++;
      }
      if (
        pointInCircle(
          { x, y },
          { x: downImgPos.x + 64, y: downImgPos.y + 64 },
          64
        )
      ) {
        angleThreshold--;
      }
      ctx.strokeStyle = "green";
      drawCircle({ x, y }, ctx);
    }
    if (pose.score >= minPoseConfidence) {
      drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }

    ctx.fillText(`Back angle: ${backAngle}°`, 10, height - 30);

    setTimeout(() => requestAnimationFrame(poseDetectionFrame), 600);
  }

  poseDetectionFrame();
}

function pointInCircle(point, center, radius) {
  return dist(point, center) < radius;
}

function dist(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  adjacentKeyPoints.forEach((keypoints) => {
    drawLine(keypoints[0].position, keypoints[1].position, scale, ctx);
  });
}

async function init() {
  net = await posenet.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    inputResolution: 200,
    multiplier: isMobile() ? 0.5 : 0.75,
    quantBytes: 2,
  });

  let video;

  try {
    video = await loadVideo();
  } catch (e) {
    console.error("couldn't capture video");
    console.error(e);
  }

  detectPoseInRealTime(video, net);
}

async function loadVideo() {
  const video = await setupCamera(width, height);
  video.play();

  return video;
}

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
init();

document.getElementById("sound_on").addEventListener("click", () => {
  let noSleep = new NoSleep();
  noSleep.enable();
  warnSound.play();
});

document
  .getElementById("threshold")
  .addEventListener("change", ({ target }) => {
    angleThreshold = target.value;
  });
