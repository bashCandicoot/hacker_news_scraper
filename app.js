const Scraper = require('./Scraper');
const parseArgs = require('minimist');

const argv = parseArgs(process.argv.slice(2));
const scraper = new Scraper(argv);

async function main() {
  const topPostIds = await scraper.getTopPostIds();
  const postIds = scraper.getTopPostsSubset(topPostIds);
  const posts = await scraper.attachContentToPosts(postIds);

  const postsPickedFields = Scraper.pickFields(posts);
  const postsWithCountedComments = Scraper.countComments(postsPickedFields);
  const validatedPosts = Scraper.validatePosts(postsWithCountedComments);
  const mappedPosts = Scraper.mapPostKeys(validatedPosts);

  console.log(mappedPosts);
  return mappedPosts;
}


main();
