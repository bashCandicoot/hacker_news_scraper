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
});
