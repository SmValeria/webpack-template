import "./assets/styles/styles.pcss";

if (process.env.NODE_ENV === "development") {
  require("file-loader!./pug/pages/about.pug");
}

console.log('about page here');

import { test } from "./js/test";

test();