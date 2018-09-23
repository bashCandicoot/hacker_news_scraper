# Hacker News Scraper (Node.js)

Command line utility to get the current top posts on Hacker News.

Setup:

```npm install``` 
  
```
Hacker News Scraper
   Command line utility to get the current top posts on Hacker News.    
  
Usage:
   node hacker_news_scraper.js  
  
Options:  
   -h --help        Show this screen  
   -v --version     Show version  
   -p --posts       Retrieve -p number of posts [default: 10]
```  
  
Example:  
  
```node hacker_news_scraper.js -p 2```  
 
Output:

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
