import "./assets/styles/styles.pcss";

if (process.env.NODE_ENV === "development") {
  require("file-loader!./pug/pages/hello.pug");
}

console.log('hello page');