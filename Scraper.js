const { version } = require('./package.json');

const axios = require('axios');
const _ = require('lodash');
const Promise = require('bluebird');
const validUrl = require('valid-url');

class Scraper {
  constructor(argv) {
    this.api = 'https://hacker-news.firebaseio.com/v0';
    this.NumOfPosts = 10;
    this.checkArguments(argv || {});
  }

  checkArguments(argv) {
    if (argv.h || argv.help) this.printHelpMessage();
    if (argv.v || argv.version) this.printVersionMessage();
    if ('p' in argv || 'posts' in argv) this.validatePosts(argv.p || argv.posts);
  }

  validatePosts(posts) {
    if (posts && Scraper.isPostsInputValid(posts)) {
      this.NumOfPosts = posts;
    } else {
      this.invalidPostArgument = true;
      console.error('--posts must be a valid integer less than or equal to 100');
    }
  }

  static isPostsInputValid(input) {
    return Scraper.isIntegerFieldValid(input) && input <= 100;
  }

  printHelpMessage() {
    this.help = true;
    console.log('\nHacker News Scraper\n' +
      '   Command line utility to get the current top posts on Hacker News.\n\n' +
      'Usage:\n' +
      '   node hacker_news_scraper.js\n\n' +
      'Options:\n' +
      '   -h --help        Show this screen\n' +
      '   -v --version     Show version\n' +
      '   -p --posts       Retrieve -p number of posts [default: 10]\n');
  }

  printVersionMessage() {
    this.version = true;
    console.log(`v${version}`);
  }

  async getTopPostIds() {
    const { data } = await axios.get(`${this.api}/topstories.json`);
    return data;
  }

  getTopPostsSubset(postIds) {
    return postIds.slice(0, this.NumOfPosts);
  }

  async attachContentToPosts(postIds) {
    return Promise.map(postIds, async (postId, index) => {
      const { data } = await axios.get(`${this.api}/item/${postId}.json`);
      return { ...data, index: index + 1 };
    });
  }

  static pickFields(posts) {
    return posts.map(post => _.pick(post, ['by', 'score', 'url', 'title', 'kids', 'index']));
  }

  static countKids(posts) {
    return posts.map(post =>
      ({
        ..._.omit(post, ['kids']),
        kids: _.get(post, 'kids.length', 0),
      }));
  }

  static validatePosts(posts) {
    return posts.filter(post =>
      this.isStringFieldValid(post.title) &&
      this.isStringFieldValid(post.by) &&
      this.isIntegerFieldValid(post.score) &&
      this.isIntegerFieldValid(post.kids) &&
      this.isIntegerFieldValid(post.index) &&
      this.isURIFieldValid(post.url));
  }

  static isStringFieldValid(field) {
    return typeof field === 'string' && field.length <= 256;
  }

  static isIntegerFieldValid(field) {
    return typeof field === 'number' && field >= 0;
  }

  static isURIFieldValid(field) {
    return validUrl.isUri(field);
  }

  static renamePostKeys(posts) {
    return posts.map(post => _.mapKeys(post, (value, key) => {
      switch (key) {
        case 'by': return 'author';
        case 'score': return 'points';
        case 'url': return 'uri';
        case 'title': return 'title';
        case 'kids': return 'comments';
        case 'index': return 'rank';
        default:
      }
    }));
  }
}


module.exports = Scraper;
