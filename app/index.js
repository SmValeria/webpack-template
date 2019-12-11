import "./assets/styles/styles.pcss";

if (process.env.NODE_ENV === "development") {
  require("file-loader!./pug/pages/index.pug");
}

console.log('index page here');

import { test } from "./js/test";

test();
