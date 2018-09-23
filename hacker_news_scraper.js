const Scraper = require('./Scraper');
const parseArgs = require('minimist');

async function main() {
  const argv = parseArgs(process.argv.slice(2));
  const scraper = new Scraper(argv);

  if (scraper.help || scraper.version || scraper.invalidPostArgument) return;

  await scraper.getTopPostIds();
  scraper.getTopPostsSubset();
  await scraper.attachContentToPosts();
  scraper.pickFields();
  scraper.countKids();
  scraper.validatePostsFields();
  scraper.renamePostKeys();

  console.log(scraper.renamedPosts);
}


main();

// comments

