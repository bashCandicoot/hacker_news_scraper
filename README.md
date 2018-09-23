# Hacker News Scraper (Node.js)

Command line utility to get the current top posts on Hacker News.

Setup:

```npm install``` 

Run:

```node hacker_news_scraper.js```
// returns first 10 posts by default

```node hacker_news_scraper.js --posts 2```
// return first 2 posts

Sample Output:

```
[ { author: 'TheAuditor',
    points: 29,
    uri: 'https://www.quantamagazine.org/machine-learning-confronts-the-elephant-in-the-room-20180920/',
    title: 'Machine Learning Confronts the Elephant in the Room',
    rank: 1,
    comments: 5 },
  { author: 'anoplus',
    points: 119,
    uri: 'https://www.nytimes.com/2018/09/20/opinion/sunday/sleep-school-start-time-screens-teenagers.html',
    title: 'Let Teenagers Sleep In',
    rank: 2,
    comments: 12 } ]
```
