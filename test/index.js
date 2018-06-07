const expect = require('chai').expect
const nock = require('nock')
const getPackage = require('..')
const fixtures = require('require-dir')('./fixtures')
const api = function (path) {
  return nock('https://api.github.com').get(path).once()
}

nock.disableNetConnect()

describe('getPackage', () => {
  it('gets a package.json', async () => {
    let mock = api('/repos/segmentio/nightmare/contents/package.json')
      .reply(200, fixtures.nightmare)

    const pkg = await getPackage('segmentio/nightmare')
    expect(pkg).to.be.an('object')
    expect(pkg.name).to.be.a('string')
    expect(pkg.dependencies).to.be.an('object')
    expect(mock.isDone()).to.equal(true)
  })

  it('detects GitHub `access_token` option and adds it as a query param', async () => {
    let mock = api('/repos/segmentio/nightmare/contents/package.json')
      .query({access_token: 'abc'})
      .reply(200, fixtures.nightmare)

    await getPackage('segmentio/nightmare', {access_token: 'abc'})
    expect(mock.isDone()).to.equal(true)
  })

  it('detects process.env.GITHUB_ACCESS_TOKEN and adds it as a query param', async () => {
    process.env.GITHUB_ACCESS_TOKEN = 'xyz'
    let mock = api('/repos/segmentio/nightmare/contents/package.json')
      .query({access_token: 'xyz'})
      .reply(200, fixtures.nightmare)

    await getPackage('segmentio/nightmare')
    expect(mock.isDone()).to.equal(true)
    delete process.env.GITHUB_ACCESS_TOKEN
  })

  it('allows a custom commit/branch/tag using the `ref` option', async () => {
    let mock = api('/repos/segmentio/nightmare/contents/package.json')
      .query({ref: 'experimental-branch'})
      .reply(200, fixtures.nightmare)

    await getPackage('segmentio/nightmare', {ref: 'experimental-branch'})
    expect(mock.isDone()).to.equal(true)
  })

  it('infers commit ref from a long URL', async () => {
    let mock = api('/repos/monkey/business/contents/package.json')
      .query({ref: 'experiment'})
      .reply(200, fixtures.nightmare)
    await getPackage('https://github.com/monkey/business/tree/experiment')
    expect(mock.isDone()).to.equal(true)
  })
})
