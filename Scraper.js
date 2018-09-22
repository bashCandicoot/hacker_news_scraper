const axios = require('axios');
const _ = require('lodash');
const Promise = require('bluebird');
const validUrl = require('valid-url');

class Scraper {
  constructor({ argv }) {
    this.NumOfPosts = Scraper.isInputValid(argv) ? argv.posts : 10;
    this.api = 'https://hacker-news.firebaseio.com/v0';
  }
  static isInputValid(argv) {
    const { posts } = argv;
    return Scraper.isIntegerFieldValid(posts) && posts < 100;
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

  static mapPostKeys(posts) {
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

  static countComments(posts) {
    return posts.map(post => ({ ..._.omit(post, ['kids']), kids: _.get(post, 'kids.length', 0) }));
  }
}


module.exports = Scraper;
