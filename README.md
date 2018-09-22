# Hacker News Scraper (Node.js)

Command line utility to get the current top posts on Hacker News.

Setup:

```npm install``` 

Run:

```node app.js                 // returns 10 posts by default```

```node app.js --posts 2       // get the first 2 posts``` 

Sample Output:

```
[ { author: 'MKais',
    points: 280,
    uri: 'http://haya2now.jp/en.html',
    title: 'Hayabusa2 Now',
    rank: 1,
    comments: 14 },
  { author: 'samfisher83',
    points: 81,
    uri: 'https://www.gamasutra.com/blogs/CBel/20180213/308549/3D_engine_entirely_made_of_MS_Excel_formulae__Enjoy_this_Doomxls_file_.php',
    title: '3D engine entirely made of MS Excel formulae',
    rank: 2,
    comments: 9 } ]
```
