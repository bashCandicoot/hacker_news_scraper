const Scraper = require('./Scraper');
const should = require('should');
const sinon = require('sinon');
const { assert } = require('chai');


describe('Scraper', () => {
  it('should create a Scraper instance', () => {
    const scraper = new Scraper();

    scraper.should.have.property('api');
    scraper.should.be.an.instanceOf(Scraper).and.have.property('NumOfPosts', 10);
  });

  it('should run the Scraper version function passing the --version argument', () => {
    const argv = { version: true };
    const scraper = new Scraper(argv);

    const argv2 = { v: true };
    const scraper2 = new Scraper(argv2);

    scraper.should.have.property('version', true);
    scraper2.should.have.property('version', true);
  });

  it('should run the Scraper help function by passing the --help argument', () => {
    const argv = { help: true };
    const scraper = new Scraper(argv);

    const argv2 = { h: true };
    const scraper2 = new Scraper(argv2);

    scraper.should.have.property('help', true);
    scraper2.should.have.property('help', true);
  });

  it('should validate --posts argument', () => {
    const argv = { posts: 2 };
    const scraper = new Scraper(argv);

    scraper.should.have.property('NumOfPosts', 2);
  });

  it('should invalidate --posts argument', () => {
    const argv = { posts: 'a' };
    const scraper = new Scraper(argv);

    const argv2 = { posts: '' };
    const scraper2 = new Scraper(argv2);

    const argv3 = { posts: {} };
    const scraper3 = new Scraper(argv3);

    const argv4 = { posts: 101 };
    const scraper4 = new Scraper(argv4);

    const argv5 = { posts: -10 };
    const scraper5 = new Scraper(argv5);

    scraper.should.have.property('invalidPostArgument', true);
    scraper2.should.have.property('invalidPostArgument', true);
    scraper3.should.have.property('invalidPostArgument', true);
    scraper4.should.have.property('invalidPostArgument', true);
    scraper5.should.have.property('invalidPostArgument', true);
  });

  it('should get top post ids', async () => {
    const scraper = new Scraper();
    scraper.getTopPostIds = sinon.fake.returns([1, 2, 3]);
    scraper.topPostIds = scraper.getTopPostIds();

    scraper.should.have.property('topPostIds').and.be.a.Array;
  });

  it('should get top post ids subset', async () => {
    const scraper = new Scraper();
    scraper.getTopPostIds = sinon.fake.returns([1, 2, 3, 4, 5,
      6, 7, 8, 9, 10,
      11, 12, 13, 14, 15]);
    scraper.topPostIds = scraper.getTopPostIds();
    scraper.getTopPostsSubset();

    scraper.should.have.property('postIds').and.be.a.Array;
    scraper.should.have.property('postIds').with.lengthOf(scraper.NumOfPosts);
  });

  it('should attach content to post ids subset', async () => {
    const argv = { posts: 2 };
    const scraper = new Scraper(argv);
    scraper.getTopPostsSubset = sinon.fake.returns([1, 2]);
    scraper.postIds = scraper.getTopPostsSubset();

    scraper.attachContentToPosts = sinon.fake.returns([{
      author: 'user982',
      points: 266,
      title: 'Why I’m leaving Chrome',
      uri: 'https://blog.cryptographyengineering.com/2018/09/23/why-im-leaving-chrome/',
      index: 1,
      comments: 23,
    },
    {
      author: 'lowe',
      points: 10,
      title: 'Fair Trending: Objectively-Ranked Trending YouTube Videos',
      uri: 'https://fairtrending.com',
      index: 2,
      comments: 4,
    }]);

    scraper.posts = scraper.attachContentToPosts();

    scraper.should.have.property('posts').and.be.a.Array;
    scraper.should.have.property('posts').with.lengthOf(scraper.NumOfPosts);

    scraper.posts[0].should.have.property('author', 'user982');
    scraper.posts[0].should.have.property('title', 'Why I’m leaving Chrome');
  });

  it('should validate posts', async () => {
    const scraper = new Scraper();

    scraper.postsCountedKids = [{
      by: 'user982',
      score: 266,
      title: 'Why I’m leaving Chrome',
      url: 'https://blog.cryptographyengineering.com/2018/09/23/why-im-leaving-chrome/',
      kids: 23,
      index: 1,
    },
    {
      by: 'lowe',
      score: 10,
      title: 'Fair Trending: Objectively-Ranked Trending YouTube Videos',
      url: 'https://fairtrending.com',
      kids: 4,
      index: 2,
    }];

    scraper.validatePostsFields();

    scraper.should.have.property('validPosts').and.be.a.Array;
    scraper.validPosts[0].should.be.a.Object;
    scraper.validPosts[1].should.be.a.Object;
  });

  it('should fail to validate post url', async () => {
    const scraper = new Scraper();

    scraper.postsCountedKids = [
      {
        by: 'lowe',
        score: 10,
        title: 'Fair Trending: Objectively-Ranked Trending YouTube Videos',
        url: [],
        kids: 4,
        index: 2,
      },
    ];

    try {
      scraper.validatePostsFields();
    } catch (err) {
      err.message.should.equal('uri.match is not a function');
    }
  });

  it('should fail to validate title length', async () => {
    const scraper = new Scraper();

    scraper.postsCountedKids = [
      {
        by: 'lowe',
        score: 10,
        title: 'loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong',
        url: 'https://fairtrending.com',
        index: 2,
        kids: 4,
      },
    ];

    scraper.validatePostsFields();
    scraper.should.have.property('validPosts').and.be.a.Array;
    scraper.should.have.property('validPosts').with.lengthOf(0);
  });

  it('should fail to validate score', async () => {
    const scraper = new Scraper();

    scraper.postsCountedKids = [
      {
        by: 'lowe',
        score: -1,
        title: 'Fair Trending: Objectively-Ranked Trending YouTube Videos',
        url: 'https://fairtrending.com',
        index: 2,
        kids: 4,
      },
    ];

    scraper.validatePostsFields();
    scraper.should.have.property('validPosts').and.be.a.Array;
    scraper.should.have.property('validPosts').with.lengthOf(0);
  });

  it('should remap object keys', async () => {
    const scraper = new Scraper();

    scraper.validPosts = [
      {
        by: 'lowe',
        score: 12,
        title: 'Fair Trending: Objectively-Ranked Trending YouTube Videos',
        url: 'https://fairtrending.com',
        index: 2,
        kids: 4,
      },
    ];

    scraper.renamePostKeys();

    scraper.should.have.property('renamedPosts').and.be.a.Array;
    scraper.should.have.property('validPosts').with.lengthOf(1);

    scraper.renamedPosts[0].should.have.property('points', 12);
    scraper.renamedPosts[0].should.have.property('author', 'lowe');
    scraper.renamedPosts[0].should.have.property('uri', 'https://fairtrending.com');
    scraper.renamedPosts[0].should.have.property('title', 'Fair Trending: Objectively-Ranked Trending YouTube Videos');
    scraper.renamedPosts[0].should.have.property('comments', 4);
    scraper.renamedPosts[0].should.have.property('rank', 2);
  });
});
