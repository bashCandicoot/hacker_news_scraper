const axios = require('axios');
const _ = require('lodash');
const Promise = require('bluebird');

class Scraper {
  constructor({ argv }) {
    const { posts } = argv;
    this.NumOfPosts = posts;
    this.api = 'https://hacker-news.firebaseio.com/v0';
  }
  async getTopPostIds() {
    const { data } = await axios.get(`${this.api}/topstories.json`);
    this.topPostIds = data;
    return this.topPostIds;
  }

  getTopPostsSubset(postIds) {
    this.postSubset = postIds.slice(0, this.NumOfPosts);
    return this.postSubset;
  }

  async attachContentToPosts(postIds) {
    return Promise.map(postIds, async (postId) => {
      const { data } = await axios.get(`${this.api}/item/${postId}.json`);
      return data;
    });
  }

  static pickFields(posts) {
    return posts.map(post => _.pick(post, ['by', 'score', 'url', 'title']));
  }

  static mapPostKeys(posts) {
    return posts.map(post => _.mapKeys(post, (value, key) => {
      switch (key) {
        case 'by': return 'author';
        case 'score': return 'points';
        case 'url': return 'uri';
        case 'title': return 'title';
        default:
          throw new Error('Unexpected key!');
      }
    }));
  }

  static validatePosts(posts) {
    return posts;
  }
}


module.exports = Scraper;
