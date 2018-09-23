const Scraper = require('./Scraper');
const parseArgs = require('minimist');

async function main() {
  const argv = parseArgs(process.argv.slice(2));
  const scraper = new Scraper(argv);

  if (scraper.help || scraper.version || scraper.invalidPostArgument) return;

  const topPostIds = await scraper.getTopPostIds();
  const postIds = scraper.getTopPostsSubset(topPostIds);
  const posts = await scraper.attachContentToPosts(postIds);

  const postsPickedFields = Scraper.pickFields(posts);
  const postsWithCountedKids = Scraper.countKids(postsPickedFields);
  const validatedPosts = Scraper.validatePosts(postsWithCountedKids);
  const mappedPosts = Scraper.renamePostKeys(validatedPosts);

  console.log(mappedPosts);
}


main();

// comments

