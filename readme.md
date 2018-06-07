# get-repo-package-json

Fetch a GitHub repository's package.json file using the GitHub API

## Installation

```sh
npm install get-repo-package-json --save
```

## Usage

The basics:

```js
const getPackage = require('get-repo-package-json')

getPackage('segmentio/nightmare').then(pkg => { console.log(pkg) })
```

To fetch a specific commit/branch/tag, use a long-form URL:

```js
await getPackage('https://github.com/monkey/business/tree/experiment')
```

Or specify a `ref` option:

```js
await getPackage('monkey/business', {ref: '0e783153885ed78f71d138085a77644ff8e59aa1'})
```

To see more supported repository string formats, see the
[github-url-to-object](https://zeke.github.io/github-url-to-object/) demo.

## API

This package exports a single function that returns a promise.

### `getPackage(repository, [options])`

- `repository` (string) - Any string supported by
[github-url-to-object](https://zeke.github.io/github-url-to-object/).
- `options` (optional object)
  - `access_token` - GitHub API key. Can also be set as a `GITHUB_ACCESS_TOKEN` environment variable.
  - `ref` - The name of the commit/branch/tag. Defaults to nothing, so the GitHub API will return the repo's default branch.

## Tests

```sh
npm install
npm test
```

## License

MIT