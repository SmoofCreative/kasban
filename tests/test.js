const test = require('tape');

// https://medium.com/@gattermeier/react-unit-testing-with-tape-b0219b714010#.jc0hyuzj1

test('timing test', function (t) {
  t.plan(2);

  t.equal(typeof Date.now, 'function');
  let start = Date.now();

  setTimeout(function () {
    t.notEqual(Date.now() - start, 100);
  }, 100);
});
