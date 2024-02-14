const APP_CACHE_NAME = 'improv-pwa';
const STATIC_CACHE_NAME = 'improv-pwa-static'
//$staticAssets = Get-ChildItem -Recurse -Path . | Where-Object {!$_.PSIsContainer -and $_.Extension -in @(".js", ".css", ".html", ".jpg", ".png")}
//$staticAssetPaths = $staticAssets.FullName
//Write-Output $staticAssetPaths

const staticAssets = [
'/chords.js',
'/index.html',
'/scripts.js',
'/style.css',
'/sw.js',
'/img/android/android-launchericon-144-144.png',
'/img/android/android-launchericon-192-192.png',
'/img/android/android-launchericon-48-48.png',
'/img/android/android-launchericon-512-512.png',
'/img/android/android-launchericon-72-72.png',
'/img/android/android-launchericon-96-96.png',
'/img/ios/100.png',
'/img/ios/1024.png',
'/img/ios/114.png',
'/img/ios/120.png',
'/img/ios/128.png',
'/img/ios/144.png',
'/img/ios/152.png',
'/img/ios/16.png',
'/img/ios/167.png',
'/img/ios/180.png',
'/img/ios/192.png',
'/img/ios/20.png',
'/img/ios/256.png',
'/img/ios/29.png',
'/img/ios/32.png',
'/img/ios/40.png',
'/img/ios/50.png',
'/img/ios/512.png',
'/img/ios/57.png',
'/img/ios/58.png',
'/img/ios/60.png',
'/img/ios/64.png',
'/img/ios/72.png',
'/img/ios/76.png',
'/img/ios/80.png',
'/img/ios/87.png',
'/img/windows11/LargeTile.scale-100.png',
'/img/windows11/LargeTile.scale-125.png',
'/img/windows11/LargeTile.scale-150.png',
'/img/windows11/LargeTile.scale-200.png',
'/img/windows11/LargeTile.scale-400.png',
'/img/windows11/SmallTile.scale-100.png',
'/img/windows11/SmallTile.scale-125.png',
'/img/windows11/SmallTile.scale-150.png',
'/img/windows11/SmallTile.scale-200.png',
'/img/windows11/SmallTile.scale-400.png',
'/img/windows11/SplashScreen.scale-100.png',
'/img/windows11/SplashScreen.scale-125.png',
'/img/windows11/SplashScreen.scale-150.png',
'/img/windows11/SplashScreen.scale-200.png',
'/img/windows11/SplashScreen.scale-400.png',
'/img/windows11/Square150x150Logo.scale-100.png',
'/img/windows11/Square150x150Logo.scale-125.png',
'/img/windows11/Square150x150Logo.scale-150.png',
'/img/windows11/Square150x150Logo.scale-200.png',
'/img/windows11/Square150x150Logo.scale-400.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png',
'/img/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-16.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-20.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-24.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-256.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-30.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-32.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-36.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-40.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-44.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-48.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-60.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-64.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-72.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-80.png',
'/img/windows11/Square44x44Logo.altform-unplated_targetsize-96.png',
'/img/windows11/Square44x44Logo.scale-100.png',
'/img/windows11/Square44x44Logo.scale-125.png',
'/img/windows11/Square44x44Logo.scale-150.png',
'/img/windows11/Square44x44Logo.scale-200.png',
'/img/windows11/Square44x44Logo.scale-400.png',
'/img/windows11/Square44x44Logo.targetsize-16.png',
'/img/windows11/Square44x44Logo.targetsize-20.png',
'/img/windows11/Square44x44Logo.targetsize-24.png',
'/img/windows11/Square44x44Logo.targetsize-256.png',
'/img/windows11/Square44x44Logo.targetsize-30.png',
'/img/windows11/Square44x44Logo.targetsize-32.png',
'/img/windows11/Square44x44Logo.targetsize-36.png',
'/img/windows11/Square44x44Logo.targetsize-40.png',
'/img/windows11/Square44x44Logo.targetsize-44.png',
'/img/windows11/Square44x44Logo.targetsize-48.png',
'/img/windows11/Square44x44Logo.targetsize-60.png',
'/img/windows11/Square44x44Logo.targetsize-64.png',
'/img/windows11/Square44x44Logo.targetsize-72.png',
'/img/windows11/Square44x44Logo.targetsize-80.png',
'/img/windows11/Square44x44Logo.targetsize-96.png',
'/img/windows11/StoreLogo.scale-100.png',
'/img/windows11/StoreLogo.scale-125.png',
'/img/windows11/StoreLogo.scale-150.png',
'/img/windows11/StoreLogo.scale-200.png',
'/img/windows11/StoreLogo.scale-400.png',
'/img/windows11/Wide310x150Logo.scale-100.png',
'/img/windows11/Wide310x150Logo.scale-125.png',
'/img/windows11/Wide310x150Logo.scale-150.png',
'/img/windows11/Wide310x150Logo.scale-200.png',
'/img/windows11/Wide310x150Logo.scale-400.png',
];

const modified = {'/index.html':true,'/scripts.js':true,'/style.css':true,'/chords.js':true}
const version = "0.2";

self.addEventListener('install', async event => {
    //event.waitUntil(self.skipWaiting());
    const cache = await caches.open(APP_CACHE_NAME);
    await cache.addAll(staticAssets.map(f=>modified[f]?f+"?v="+version:f));
});

async function cacheFirst(req) {
    const cache = await caches.open(APP_CACHE_NAME);
    const cachedResponse = await cache.match(req);
    return cachedResponse || fetch(req);
}

self.addEventListener('fetch', async event => {
    const req = event.request;
    event.respondWith(cacheFirst(req));
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheName !== APP_CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
                            console.log('deleting', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

function distinct(value, index, self) {
    return self.indexOf(value) === index;
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      }, wait);
      if (callNow) func.apply(context, args);
    }
  }

  var post;
  var playing=false;

  var beat=0;
var tempo=60;
var smallest=1/32;
var allNotes;
var maxBeat;
var melody=[];
var chords=[];

function parseFraction(str) {
    const [numerator, denominator] = str.split('/').map(Number);
  
    if (!denominator || isNaN(numerator) || isNaN(denominator)) {
      // Handle invalid input
      return NaN;
    }
  
    return numerator / denominator;
  }

  addEventListener("message", (event) => {
    let data = event.data;
console.log(data)
    if(data.type === 'init'){
        post = (data) => event.source.postMessage(data);
    } else if(data.type === 'play'){
        playing=true;
        setNotes(data.value||[{p:67, b:0, t:2},{p:80, b:0, t:2},{p:80, b:1, t:2}])
        play();
    }else if(data.type === 'stop'){
        playing=false;
    }else if(data.type === 'tempo'){
        tempo=data.value;
    }else if(data.type === 'pattern'){
        let n = [];
        let c = 0;
        let ornAcc = 0;
        
        for(let v of data.value){
            p = 67;
            let orn=false;
            let silent=false;
            if(v.indexOf("|")>-1){
                v = v.replace("|","");
                orn=true;
            }
            if(v.indexOf("@")>-1){
                v = v.replace("@","");
                orn=silent;
            }
            console.log(v)
            v = Math.round(parseFraction(v)*10000)
            if(orn){
                v/=5;
                ornAcc+=v
            }else if (ornAcc>0){
                v-=ornAcc
                ornAcc=0;
            }
            smallest = Math.min(smallest, v)
            if(silent){
                p=0;
            }
            n.push({
                p,
                b: c,
                t: v
            })
            c+=v
        }
        console.log(n, smallest)
        setNotes(n)
    }
  });

  const setNotes = (val)=>{
  allNotes=val
  let lastNote = allNotes.reduce((max, current) => {
    return current['b'] > max['b'] ? current : max;
  }, allNotes[0]);
  maxBeat = lastNote.b+lastNote.t
  }

  const play = () =>{
    if(playing){
        let notes = allNotes.filter(f=>f.b===beat).map(f=>f.p).filter(f=>f!==0)
        post({type:'start', notes})
        beat+=0.1;
        beat %= maxBeat
        setTimeout(()=>play(),Math.round(4*60/tempo))
    }
  }