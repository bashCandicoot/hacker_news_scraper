const Scraper = require('./Scraper');
const parseArgs = require('minimist');

const argv = parseArgs(process.argv.slice(2));
const scraper = new Scraper({ argv });

async function main() {
  const topPostIds = await scraper.getTopPostIds();
  const postIds = scraper.getTopPostsSubset(topPostIds);
  const posts = await scraper.attachContentToPosts(postIds);

  const pickedFields = Scraper.pickFields(posts);
  const mappedPosts = Scraper.mapPostKeys(pickedFields);
  console.log(mappedPosts);
}


main();
