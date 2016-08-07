const getPackage = require('./')

getPackage('segmentio/nightmare', function (err, pkg) {
  if (err) throw err
  // pkg is a JSON object
})
