'use strict'

const URL = require('url')
const got = require('got')
const gh = require('github-url-to-object')

function getRepoPackageJSON (repository, opts = {}) {
  // extract username and repo name from parsed URL
  // https://zeke.github.io/github-url-to-object/
  let repoParts = gh(repository)
  if (!repoParts) throw new Error('Invalid repo name')

  let {user, repo, branch} = repoParts

  let urlParts = {
    protocol: 'https:',
    host: 'api.github.com',
    pathname: `/repos/${user}/${repo}/contents/package.json`,
    query: {}
  }

  // The name of the commit/branch/tag
  // Default: the repository’s default branch (usually master)
  if (opts.ref) urlParts.query.ref = opts.ref

  // If a non-master branch was specified in the given URL
  if (branch && branch !== 'master' && !opts.ref) {
    urlParts.query.ref = branch
  }

  // Token can be set in opts
  if (opts.access_token) urlParts.query.access_token = opts.access_token

  // Token can be set in environment
  if (process.env.GITHUB_ACCESS_TOKEN) {
    urlParts.query.access_token = process.env.GITHUB_ACCESS_TOKEN
  }

  // Alternative token name
  if (process.env.GH_TOKEN) {
    urlParts.query.access_token = process.env.GH_TOKEN
  }

  let url = URL.format(urlParts)

  return got(url, {json: true})
    .then(response => {
      let pkg = JSON.parse(Buffer.from(response.body.content, response.body.encoding).toString())
      return pkg
    })
}

module.exports = getRepoPackageJSON
