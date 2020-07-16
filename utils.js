export function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export function drawLine(a, b, scale, ctx) {
  console.log("draw");
  ctx.beginPath();
  ctx.moveTo(a.x * scale, a.y * scale);
  ctx.lineTo(b.x * scale, b.y * scale);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "green";
  ctx.stroke();
}

export function drawCircle({ x, y }, ctx) {
  ctx.beginPath();
  ctx.arc(x, y, 70, 0, 2 * Math.PI);
  ctx.stroke();
}

export async function setupCamera(width, height) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      "Browser API navigator.mediaDevices.getUserMedia not available"
    );
  }

  const video = document.getElementById("video");
  video.width = width;
  video.height = height;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: mobile ? undefined : width,
      height: mobile ? undefined : height,
    },
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

export function throttle(fn, limit) {
  let wait = false;
  return function (...args) {
    if (!wait) {
      fn(...args);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  };
}
