export function test() {
  console.log('hello from test!!!');
  let promise2 = new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve('test settimeout');
    }, 500);
  });
  promise2.then(function(value) {
    console.log(value);
    // expected output: "test settimeout"
  });
}