import {allChords, rudiments} from "./chords.js";
// ------------------------------------ install ------------------------------------
var post;
var rec = event => {
    let data = event.data;
    if (data.type === "start"){
        data.notes.forEach(n=>play(n))
    }
    else if (data.type === "stop"){
        data.notes.forEach(n=>stop(n))
    } else {
        console.log("unknown message", data)
    }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Service worker registered.", reg))
      .catch((err) => console.log("Service worker registration failed.", err));
  });

  navigator.serviceWorker.addEventListener("message", rec);

  navigator.serviceWorker.ready.then((registration) => {
    post = (data) => registration.active.postMessage(data);
    post({type:'init'})
  });
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPrompt();
});

function showInstallPrompt() {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return;
  }
  const installButton = document.querySelector("#install-button");
  installButton.style.display = "block";
  installButton.addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt.");
      } else {
        console.log("User dismissed the install prompt.");
      }
      deferredPrompt = null;
    });
  });
}

// ------------------------------------ prevent pull to refresh -----------------
const body = document.querySelector("body");

// Add a touchstart event listener to the body
body.addEventListener("touchstart", function (e) {
  // Prevent the default action of touchstart
  e.preventDefault();
});

// Add a touchmove event listener to the body
body.addEventListener("touchmove", function (e) {
  // Prevent the default action of touchmove
  e.preventDefault();
});
// ------------------------------------ debug ------------------------------------
window.onerror = (a, b, c, d, e) => {
  const message = `
  message: ${a}
  source: ${b}
  lineno: ${c}
  colno: ${d}
  error: ${e}
  --------
  `;
  document.getElementById("log").innerText += message;
  console.log(message);
  return true;
};

//------------------------------------ utilties ----------------------
function setStorage(cname, cvalue) {
  localStorage.setItem("improve-" + cname, JSON.stringify(cvalue));
}

function getFromStorage(cname) {
  return JSON.parse(localStorage.getItem("improve-" + cname));
}
//------------------------------------ functionality -----------------------------
var samples, samplePlayer, paths=[], width=0.5, notesToPlay={}, smallestBit=16, timeSig = 3,root=62, degrees=[0,2,3,5,7,8,10],tempo=60, snapToGrid=true,playing;
var smallest = 1/(smallestBit*timeSig)
const scale = degrees.concat(degrees.map(f=>f+12)).concat([degrees[0]+36,null])
const getNotesFromY = (y) =>{
  return scale[Math.ceil((1-(y/paper.view.bounds.height))*(scale.length-1))]+root
}

// var canvas = document.getElementById('canvas');
// 		// Create an empty project and a view for the canvas:
//     paper.install(window);
// paper.setup(canvas);
// console.log(view)
paper.install(window);
paper.setup('canvas');

var drawGridLines = function(num_rectangles_wide, num_rectangles_tall, boundingRect) {
  var width_per_rectangle = boundingRect.width / num_rectangles_wide;
  var height_per_rectangle = boundingRect.height / num_rectangles_tall;
  for (var i = 0; i <= num_rectangles_wide; i++) {
      var xPos = boundingRect.left + i * width_per_rectangle;
      var topPoint = new paper.Point(xPos, boundingRect.top);
      var bottomPoint = new paper.Point(xPos, boundingRect.bottom);
      var aLine = new paper.Path.Line(topPoint, bottomPoint);
      aLine.strokeColor = 'black';
      aLine.strokeWidth = i%((1/smallest)/timeSig)===0?3:1;
  }
  for (var i = 0; i <= num_rectangles_tall; i++) {
      var yPos = boundingRect.top + i * height_per_rectangle;
      var leftPoint = new paper.Point(boundingRect.left, yPos);
      var rightPoint = new paper.Point(boundingRect.right, yPos);
      var aLine = new paper.Path.Line(leftPoint, rightPoint);
      var text1 = new paper.PointText({
        content: Tone.Frequency(getNotesFromY(yPos+1), "midi").toNote(),
        
        // ** Define position first and fontSize second **
        point: new paper.Point(boundingRect.left, yPos-height_per_rectangle/4),
        fontSize: '1em',
        fillColor: "#999999"
    });
      aLine.strokeColor = 'black';
  }
}

drawGridLines(1/smallest,scale.length-1, paper.view.bounds);
		// Create a simple drawing tool:
var tool = new Tool();
var from = new Point(0, 0);
var to = new Point(0, paper.view.bounds.height);
var caret = new Path.Line(from, to);
caret.strokeColor = 'red';


var alreadyPlayingLines = {}
const playNote = (playingLines)=>{
Object.keys(alreadyPlayingLines).forEach(pl=>{
  if(playingLines[pl] && playingLines[pl] === alreadyPlayingLines[pl]) return;
  stop(alreadyPlayingLines[pl])
})
Object.keys(playingLines).forEach(pl=>{
  if(alreadyPlayingLines[pl] && playingLines[pl] === alreadyPlayingLines[pl]) return;
  play(playingLines[pl])
})
alreadyPlayingLines = playingLines;
}
view.onFrame = (event)=>{
  //path2.translate(3,0);
  if(playing){
  caret.position.x+=(paper.view.bounds.width*smallest)*tempo/(4*60);
  caret.position.x%=paper.view.bounds.width;
  let ints = paths.map((path,i)=> [i,showIntersections(caret,path)]).filter(i=>i[1].length>0).reduce((a,i)=>{a[i[0]]=getNotesFromY(i[1][0]);return a;},{});
  playNote(ints)
  cir.forEach(c=>{
    if(c.position.x!==caret.position.x){
      c.remove()
    }
  })
}
}
var startPoint;
tool.onMouseDown = function(event) {
  // if (path) {
  //   path.selected = false;
  // }
  startPoint = event.point;
  let sanppingGrid = paper.view.bounds.width*smallest;
  var point = snapToGrid?new paper.Point(Math.floor(event.point.x/sanppingGrid)*sanppingGrid, event.point.y):event.point;
  // Create a new path and set its stroke color to black:
  paths.push(new Path({
    segments: [point],
    strokeColor: 'black',
    strokeWidth: width*10,
    // Select the path, so we can see its segment points:
    //fullySelected: true
  }));
}

tool.onMouseDrag = function(event) {
  
  if(paths[paths.length-1]) paths[paths.length-1].add(event.point);
}

tool.onMouseUp = function(event) {
  var path = paths[paths.length-1];
  let sanppingGrid = paper.view.bounds.width*smallest;
  if(path) {
    if(Math.abs(event.point.x-startPoint.x)<(sanppingGrid/2)){
      paths.pop()
      path.remove()
      startPoint=null;
      return;
    }
  var point = snapToGrid?new paper.Point(Math.ceil(event.point.x/sanppingGrid)*sanppingGrid, event.point.y):event.point;
  path.add(point);
  
    path.simplify(10);
// showIntersections(path,caret)

path.onMouseDown = (event)=>{
  
  path.remove()//TODO what should I do with this event}
  paths= paths.filter(f=>f.id!==path.id);
  }
}
}

// var currentBeat=0
// // for (let a of [0.5,0.5,0.75,0.25,0.25,0.25,0.5,0.5,0.75,0.25,0.25,0.25,0.5,0.5,1,0.5,0.5,2]){
//   for (let a of [3,3,5.5,1.5,1.5,1.5,3,3,7,1,1,1,3,3,10]){
//   let sanppingGrid = paper.view.bounds.width*smallest;
//   console.log(currentBeat)
//   let startPoint = new paper.Point(currentBeat*sanppingGrid,300);
//   let endPoint = new paper.Point((currentBeat+a)*sanppingGrid-10,300);
//   paths.push(new Path({
//     segments: [startPoint,endPoint],
//     strokeColor: 'white',
//     strokeWidth: width*10,
//     // Select the path, so we can see its segment points:
//     //fullySelected: true
//   }))
//   currentBeat+=a;
// }



var cir = [];
function showIntersections(path1, path2) {
  let intersections = path1.getIntersections(path2);
  let ys = [];
  for (var i = 0; i < intersections.length; i++) {
      cir.push(new Path.Circle({
          center: intersections[i].point,
          radius: 5,
          fillColor: '#009dec'
      }));
      ys.push(intersections[i].point.y)
  }
  return ys;
}
var changeSample = (val)=>{}
const sampleChanged = (val) => {
  changeSample(val)
  // samplePlayer = samples[val];
  // samplePlayer.connect(effects.tone.overdrive.getInput());//TODO
  //getScene().sample = val;
};
// var effects = {
//   obxd: {
//     overdrive: null,
//     delay: null,
//     reverb: null,
//     volume: null,
//     cabinet: null,
//   },
//   tone: {
//     overdrive: null,
//     delay: null,
//     reverb: null,
//     volume: null,
//     cabinet: null,
//   },
// };
function loadSamples() {
  return new Promise((resolve, reject) => {
    samples = SampleLibrary.load({
      instruments: [
        "piano",
        "guitar-acoustic",
        "guitar-electric",
        "guitar-nylon",
        "xylophone",
      ],
      baseUrl: "samples/",
    });
    Tone.loaded().then(function () {
      // loop through instruments and set release, connect to master output
      for (var property in samples) {
        if (samples.hasOwnProperty(property)) {
          samples[property].release = 0;
          samples[property].attack = 0;
          //samples[property].toMaster();//.connect(reverb);
        }
      }
      // let context = Tone.getContext();
      // reverbjs.extend(context);
      // var reverbUrl = "http://reverbjs.org/Library/StMarysAbbeyReconstructionPhase2.m4a";
      // var reverbNode = context.createReverbFromUrl(reverbUrl, function() {

      //   reverbNode.connect(context.destination);
      // });
      changeSample = (val)=>{
      var convolver = new Tone.Convolver("http://reverbjs.org/Library/AbernyteGrainSilo.m4a");//.toMaster();
      var limiter = new Tone.Volume(-7);
      samplePlayer = samples[val];
      samplePlayer.connect(convolver);
      convolver.connect(limiter)
      limiter.toMaster();
      };
      changeSample("piano")
        // const stage = new pb.Stage(context);
        // const ctx = stage.getContext();
        // const board = new pb.Board(ctx);
        // stage.setBoard(board);

        // // Create the effects
        // effects.tone.overdrive = new pb.stomp.Overdrive(ctx);
        // effects.tone.reverb = new pb.stomp.Reverb(ctx);
        // effects.tone.volume = new pb.stomp.Volume(ctx);
        // effects.tone.cabinet = new pb.stomp.Cabinet(ctx);
        // effects.tone.delay = new pb.stomp.Delay(ctx);

        // // Add the effects to the board
        // board.addPedals([
        //   effects.tone.overdrive,
        //   effects.tone.delay,
        //   effects.tone.reverb,
        //   effects.tone.volume,
        //   effects.tone.cabinet,
        // ]);

        // // Set the default effect parameters (you can adjust them as needed)
        // effects.tone.overdrive.setLevel(1);
        // effects.tone.overdrive.setDrive(0);
        // effects.tone.overdrive.setTone(0);
        // effects.tone.reverb.setLevel(1);
        // effects.tone.delay.setDelayTimer(0);
        // effects.tone.delay.setFeedbackGain(0);
        // effects.tone.delay.setLevel(0);
        // effects.tone.volume.setLevel(1);

        // samplePlayer = samples["piano"];
        // samplePlayer.connect(effects.tone.overdrive.getInput());
        // effects.tone.cabinet.getOutput().connect(context.destination);
      

      document
        .getElementById("select-instrumnets")
        .addEventListener("change", function (v) {
          sampleChanged(v.target.value);
        });
        document.getElementById("load").style.setProperty("display", "none", "important");
      resolve();
    });
    Tone.Buffer.onerror = function () {
      reject("Failed loading samples");
    };
  });
}
var send = (message) => {
  let state = message[0];
  let note = message[1];
  if (state === 0x90) {
    samplePlayer.triggerAttack(Tone.Frequency(note, "midi").toNote());
  } else if (state === 0x80) {
    samplePlayer.triggerRelease(Tone.Frequency(note, "midi").toNote());
  }
};

var play = (n, force = 1) => send([0x90, n, Math.round(force * 127)]);
var stop = (n) => send([0x80, n, 0]);
var changeForce = (n, force) => send([0xa0, n, Math.round(force * 127)]);

// var loop,tempo=70, patternIndex=0;

// function parseFraction(str) {
//     const [numerator, denominator] = str.split('/').map(Number);
  
//     if (!denominator || isNaN(numerator) || isNaN(denominator)) {
//       // Handle invalid input
//       return NaN;
//     }
  
//     return numerator / denominator;
//   }

// const buildNotes = (pattern)=>{
//     let n = [];
//         let c = 0;
//         let ornAcc = 0;
        
//         for(let v of pattern){
//             let p = 67;
//             let orn=false;
//             let silent=false;
//             if(v.indexOf("|")>-1){
//                 v = v.replace("|","");
//                 orn=true;
//             }
//             if(v.indexOf("@")>-1){
//                 v = v.replace("@","");
//                 orn=silent;
//             }
//             console.log(v)
//             v = parseFraction(v)
//             if(orn){
//                 v/=5;
//                 ornAcc+=v
//             }else if (ornAcc>0){
//                 v-=ornAcc
//                 ornAcc=0;
//             }
//             if(silent){
//                 p=0;
//             }
//             n.push({
//                 p,
//                 b: c,
//                 t: v
//             })
//             c+=v
//         }

//         let lastNote = n.reduce((max, current) => {
//             return current['b'] > max['b'] ? current : max;
//           }, n[0]);
//           let maxBeat = lastNote.b+lastNote.t

//         return [n,maxBeat*4*60/tempo];
// }

// var currentChord = 0;
// const getNote = (beat, index) => {
//     let chord = allChords[currentChord].noteNames.split(" ");
//     let notes = [chord[Math.floor(Math.random()*3)]+"4"]
//     if (index===0){
//         notes.push(chord[0]+"3")
//     }
//     return notes;
// }
//Tone.Frequency(67, "midi").toNote()
// const seqBuilder = (index)=>{
//     let [pat,len] = buildNotes(rudiments[index].pattern);
//     return [(time)=>{
//         pat.forEach((p,i)=>{
//             let notes = getNote(p.b,i);
//             notes.forEach(n=>{
//                 samplePlayer.triggerAttack(n,time+p.b*4*60/tempo,i===0?0.7:0.5);
//             })
//         })
//     }, len]
// }
document.getElementById("load").addEventListener("click", loadSamples);
document.getElementById("play").addEventListener("click", () => {
    // post({type:'play'})
    // post({type:'pattern',value:rudiments[0].pattern})
    
    // let [seq, len] = seqBuilder(patternIndex);
    // loop = new Tone.Loop(seq, len).start(0);
    // loop.humanize=true;
    // Tone.Transport.start();
    caret.position.x=0;
    playing=true;
});
document.getElementById("stop").addEventListener("click", () => {
    //post({type:'stop'})
    // loop.stop();
    // loop.dispose()
    playing=false;
});
document.getElementById("log-btn").addEventListener("click", () => {
  let el = document.getElementById("log");
  if(el.style.display==="block"){
    el.style.display="none"
  }else{
    el.style.display="block"
  }
});
document.getElementById("tempo").addEventListener("change", (e) => {
    //post({type:'tempo',value:e.target._value})
    tempo = parseInt(e.target.value);
    // let [seq, len] = seqBuilder(patternIndex);
    // loop.callback = seq;
    // loop.interval = len;
});
// document.getElementById("chord").addEventListener("change", (e) => {
//     //post({type:'tempo',value:e.target._value})
//     currentChord = e.target.value;
// });
// document.getElementById("rud").addEventListener("change", (e) => {
//     console.log(rudiments[e.target.value].name)
//     patternIndex = e.target.value;
//     let [seq, len] = seqBuilder(patternIndex);
//     loop.callback = seq;
//     loop.interval = len;
//     //post({type:'pattern',value:rudiments[e.target.value].pattern})
// });

// async function generateMelody() {
//     // Initialize the MusicVAE model
//     const model = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');

//     // Generate a melody
//     const melody = await model.interpolate([60, 62, 64, 65, 67, 69, 71, 72], 4);

//     // Log the generated melody
//     console.log('Generated Melody:', melody);

//     // You can now use the generated melody for further processing or rendering
//   }

//   // Call the function to generate a melody
//   generateMelody();

