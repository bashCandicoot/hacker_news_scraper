const axios = require('axios');
const _ = require('lodash');
const Promise = require('bluebird');
const validUrl = require('valid-url');

class Scraper {
  constructor({ argv }) {
    const { posts } = argv;
    this.NumOfPosts = posts;
    this.api = 'https://hacker-news.firebaseio.com/v0';
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
      this.validateStringField(post.title) &&
      this.validateStringField(post.by) &&
      this.validateIntegerField(post.score) &&
      this.validateIntegerField(post.kids) &&
      this.validateIntegerField(post.index) &&
      this.validateURIField(post.url));
  }

  static validateStringField(field) {
    return field && typeof field === 'string' && field.length <= 256;
  }

  static validateIntegerField(field) {
    return typeof field === 'number' && field >= 0;
  }

  static async validateURIField(field) {
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
