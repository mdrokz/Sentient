// require('@tensorflow/tfjs-node');
var fs = require('fs');

var rtsp = require("rtsp-ffmpeg");

var cam = require('node-onvif');

var promise = require('promise');

var cocoSsd = require('@tensorflow-models/coco-ssd');
//var io = require('iohook');

// console.log(cam);
// fs.writeFile("F:\\Games\\indexs.mp4",'hi',function(err) {
//   if(err) {
//     console.log(err);
//   }
// });
function getCam() {
  var result = [];
  return new promise((resolve, reject) => {
    try {
      var interval = setInterval(() => {
        cam
          .startProbe()
          .then(device_info_list => {
            console.log(device_info_list.length + " devices were found.");
            if (device_info_list != undefined && device_info_list.length != 0) {
              device_info_list.forEach(info => {
                if (info != undefined) {
                  console.log("  - " + info.urn);
                  console.log("  - " + info.name);
                  console.log("  - " + info.xaddrs[0]);
                  result.push(device_info_list, info);
                  resolve(result);
                  clearInterval(interval);
                }
              });
            }
          })
          .catch(error => {
            if (error) {
              reject(error);
              console.error(error);
            }
          });
      }, 600);
    } catch (e) {
      if (e) {
        reject(e);
      }
    }
  });
}
// getCam().then(res => {
//   var device = new cam.OnvifDevice({
//     xaddr: res[1].xaddrs[0],
//     user: "IPCam",
//     pass: "elcorazon"
//   });
//   device
//     .init()
//     .then(() => {
//       var url = device.getUdpStreamUrl();
//       console.log("running");
//       console.log(url);
//     })
//     .catch(error => {
//       console.error(error);
//     });

//   console.log(device, device.getUdpStreamUrl());
//   console.log(res);
// }).catch(err => {
//   if (err) {
//     console.log(err);
//   }
// });

//var io = require("./node_modules/iohook/index");

var model = cocoSsd.load();
var canvas = document.getElementsByTagName('canvas');

function detectFrame(video, model) {
  if (video != undefined) {
    model.detect(video).then(predictions => {
      renderPredictions(predictions);
      // requestAnimationFrame(() => {
      //   detectFrame(video, model);
      // });
      setInterval(() => {
        detectFrame(video, model);
      }, 1000);
    });
  }
};

function renderPredictions(predictions) {
  if (predictions.length != 0) {
    const canvas = document.getElementsByClassName('size');
    const ctx = canvas[1].getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
    console.log(predictions);
  }
};

var rtsp_uri = "rtsp://192.168.100.9:554/onvif1";

var stream = new rtsp.FFMpeg({
  input: rtsp_uri
});
var img;
var models;
stream.on("data", data => {
  // img = document.getElementById("img");
  //img.src = "data:image/jpeg;base64," + data.toString('base64');
  // var vid = document.getElementById("video");
  // vid.src = data;
  var bytes = new Uint8Array(data);

  var blob = new Blob([bytes], {
    type: 'application/octet-binary'
  });

  var url = URL.createObjectURL(blob);

  var img = new Image;

  var ctx = canvas[0].getContext("2d");

  img.onload = function () {
    URL.revokeObjectURL(url);
    ctx.drawImage(img, 100, 100);
  };

  img.src = url;
  console.log(data);
});
// var interval = setInterval(() => {
//   var video = document.getElementById('video');
//   model.then(res => {
//     // models = res;
//     detectFrame(video,res);
//   }).catch(err => {
//     if (err) {
//       console.log(err);
//     }
//   });
// }, 60);

// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//   var webCamPromise = navigator.mediaDevices
//     .getUserMedia({
//       audio: false,
//       video: {
//         facingMode: "user"
//       }
//     })
//     .then(stream => {
//       var video = document.getElementById('video');
//       video.srcObject = stream;
//       return new Promise((resolve, reject) => {
//       video.onloadedmetadata = () => {
//         video.play();
//         console.log(stream);
//         resolve(); 
//       }
//     });
//     });
// }

promise.all([model]).then(res => {
  var canvas = document.getElementsByTagName('canvas');
  detectFrame(canvas[0], res[0]);
}).catch(err => {
  console.log(err);
});