fetch-reddit
============

[![Build Status](https://travis-ci.org/CookPete/fetch-reddit.svg)](https://travis-ci.org/CookPete/fetch-reddit)
[![Dependency Status](https://david-dm.org/CookPete/fetch-reddit.svg)](https://david-dm.org/CookPete/fetch-reddit)
[![devDependency Status](https://david-dm.org/CookPete/fetch-reddit/dev-status.svg)](https://david-dm.org/CookPete/fetch-reddit#info=devDependencies)

A utility function for fetching links from subreddits or Reddit comment threads

### Usage

```bash
npm install fetch-reddit --save
```

```js
import { getPosts } from 'fetch-reddit'

function processPosts (posts) {
  // Do something with the extracted posts
}

getPosts('/r/chillmusic').then(data => {
  // Array of extracted posts
  processPosts(data.posts)

  // Easy pagination
  data.loadMore().then(processPosts)
})
```

### Linting

This project uses [standard](https://github.com/feross/standard) code style.

```bash
npm run lint
```

### Testing

This project uses [mocha](https://github.com/mochajs/mocha) with [chai](https://github.com/chaijs/chai) assertions for unit testing.

```bash
npm run test
```

### Thanks

* Big thanks to [koistya](https://github.com/koistya) for [babel-starter-kit](https://github.com/kriasoft/babel-starter-kit), which this repo is roughly based on.
