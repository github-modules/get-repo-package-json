const expect = require('chai').expect
const nock = require('nock')
const getPackage = require('..')
const fixtures = require('require-dir')('./fixtures')
const api = function (path) {
  return nock('https://api.github.com').get(path).once()
}

nock.disableNetConnect()

describe('getPackage', function () {
  it('gets a package.json', function (done) {
    let mock = api('/repos/segmentio/nightmare/contents/package.json')
      .reply(200, fixtures.nightmare)

    getPackage('segmentio/nightmare', function (err, pkg) {
      if (err) throw err
      expect(pkg).to.be.an('object')
      expect(pkg.name).to.be.a('string')
      expect(pkg.dependencies).to.be.an('object')
      expect(mock.isDone()).to.be.true
      done()
    })
  })

  it('detects GitHub `access_token` option and adds it as a query param', function (done) {
    let mock = api('/repos/segmentio/nightmare/contents/package.json')
      .query({access_token: 'abc'})
      .reply(200, fixtures.nightmare)

    getPackage('segmentio/nightmare', {access_token: 'abc'}, function (err, pkg) {
      if (err) throw err
      expect(mock.isDone()).to.be.true
      done()
    })
  })

  it('detects process.env.GITHUB_ACCESS_TOKEN and adds it as a query param', function (done) {
    process.env.GITHUB_ACCESS_TOKEN = 'xyz'
    let mock = api('/repos/segmentio/nightmare/contents/package.json')
      .query({access_token: 'xyz'})
      .reply(200, fixtures.nightmare)

    getPackage('segmentio/nightmare', function (err, pkg) {
      if (err) throw err
      expect(mock.isDone()).to.be.true
      delete process.env.GITHUB_ACCESS_TOKEN
      done()
    })
  })

  it('allows a custom commit/branch/tag using the `ref` option', function (done) {
    let mock = api('/repos/segmentio/nightmare/contents/package.json')
      .query({ref: 'experimental-branch'})
      .reply(200, fixtures.nightmare)

    getPackage('segmentio/nightmare', {ref: 'experimental-branch'}, function (err, pkg) {
      if (err) throw err
      expect(mock.isDone()).to.be.true
      done()
    })
  })

  it('infers commit ref from a long URL', function (done) {
    let mock = api('/repos/monkey/business/contents/package.json')
      .query({ref: 'experiment'})
      .reply(200, fixtures.nightmare)
    getPackage('https://github.com/monkey/business/tree/experiment', function (err, pkg) {
      if (err) throw err
      expect(mock.isDone()).to.be.true
      done()
    })
  })

  it('handles 404s', function (done) {
    let mock = api('/repos/nonexistent-user/nonexistent-repo/contents/package.json')
      .reply(404)

    getPackage('nonexistent-user/nonexistent-repo', function (err, pkg) {
      expect(err).to.exist
      expect(mock.isDone()).to.be.true
      done()
    })
  })
})
