const test = require('tape')
const nock = require('nock')
const getRepoPackageJSON = require('..')
const nightmarePackage = require('./fixtures/nightmare.json')

test('getRepoPackageJSON', function (t) {
  let mock = nock('https://api.github.com')
    .get('/repos/segmentio/nightmare/contents/package.json')
    .reply(200, nightmarePackage)
    .get('/repos/segmentio/nightmare/contents/package.json?access_token=123')
    .reply(200, nightmarePackage)

    // test `ref`
    // test env token

  t.plan(1)

  getRepoPackageJSON('segmentio/nightmare', function (err, pkg) {
    if (err) throw err

    getRepoPackageJSON('segmentio/nightmare', {access_token: '123'}, function (err, pkg) {
      if (err) throw err

      t.ok(mock.isDone(), 'satisfies mock')
    })

  })
})
