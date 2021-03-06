// Dependencies:
// https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js

const ConsoleSilentMode = true; // убрать комменты

function getMetrics() {
  let detectApp = newDetectApp();
  return (async () => {
    return await Promise.all([getFPJSLibDataPromise(), detectApp.getUserApps(), isPrivateMode(), getOpenPorts(), getExtensions()]).then(values => {
      let Metrics = {};
      let fingerprintJS = values[0].components;
      Object.keys(fingerprintJS).forEach(function (key) {
        Metrics[key] = fingerprintJS[key].value === undefined ? null : fingerprintJS[key].value;
        switch (key) {
          case 'languages': {
            let languages = [];
            Metrics[key].forEach(function (langs) {
              if (Array.isArray(langs)) {
                langs.forEach(function (lang) {
                  languages.push(lang);
                });
              } else {
                languages.push(langs);
              }
            });
            Metrics[key] = languages;
          }
        }
      });
      Metrics['fingerprintJSHash'] = values[0].visitorId;
      Metrics['apps'] = [];
      values[1].forEach(function (status, appTitle) {
        Metrics['apps'].push({app: appTitle, status: status})
      })
      Metrics['browserPrivateMode'] = values[2];
      Metrics['browser'] = {
        'opera': isOpera,
        'firefox': isFirefox,
        'safari': isSafari,
        'ie': isIE,
        'edge': isEdge || isEdgeChromium,
        'chrome': isChrome || (!isOpera && !isFirefox &&
            !isSafari && !isIE && !isEdge && !isEdgeChromium && !isBlink),
        'blink': isBlink
      };
      Metrics['browserName'] = '';
      Object.keys(Metrics['browser']).forEach(function (key) {
        if (Metrics['browser'][key]) {
          Metrics['browserName'] += [key] + ';';
        }
      });
      Metrics['ports'] = values[3];
      Metrics['extensions'] = values[4];
      return Metrics;
    })
  })()
}

function getFPJSLibDataPromise() {
  doConsoleLog('fingerprint js start');

  const fpPromise = FingerprintJS.load()

  return (async () => {
    doConsoleLog('fingerprint js');
    const fp = await fpPromise;
    return await fp.get();
  })()
}

function doConsoleLog(logMessage) {
  if (ConsoleSilentMode) return;
  console.log(logMessage);
}

// Debug

function consolePrintGetMetrics() {
  getMetrics().then(value => {
    console.log(value);
  });
}

function consolePrintJSONGetMetrics() {
  getMetrics().then(value => {
    console.log(JSON.stringify(value));
  });
}