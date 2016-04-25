# printscreen.js

Easier website screenshots in Node.js

## Features

 - uses [phantom.js](https://www.npmjs.com/package/phantomjs-prebuilt) and [node-phantom-simple](https://www.npmjs.com/package/node-phantom-simple)
 - simple api

## Install

`npm install --save-dev printscreen`

## Usage

```
const printscreen = require('printscreen');

printscreen('http://google.com', {

  /*
   * Optional: Define a suitable viewport size
   */
  viewport: {
    width: 1650,
    height: 1060
  },

  /*
   * Optional: Define the time between the page being initiated and the printscreen taken
   */
  timeout: 1000,

  /*
   * Optional: Define the format of the printscreen taken (pdf|png|jpeg)
   */
  format: 'png',

  /*
   * Optional: Define the quality of the printscreen taken (0-100)
   */
  quality: 75,

  /*
   * Optional: Define a capture function which is injected into the webview before the printscreen is made
   * The returned output is available in the callback (see below)
   */
  capture: function () {

    var divs = document.querySelectorAll('div').length;

    return {
      divs: divs
    };
  }
}, (err, data) => {

  /*
   * Optional: Callback definition
   * data is the result returned from the capture method
   */
  require('fs').stat(data.file, (err, stats) =>
    console.log(`
      - There are ${data.output.divs} divs in this page.
      - Your screenshot is available at ${data.file} and is ${stats.size} bytes.
    `));
});
```

## Tests

```
$ npm test
```

## Contributing

Contributions welcome; Please submit all pull requests against the master branch.

## Author

Ruben Stolk <ruben.stolk@changer.nl> http://github.com/rubenstolk

## License

 - **MIT** : http://opensource.org/licenses/MIT
