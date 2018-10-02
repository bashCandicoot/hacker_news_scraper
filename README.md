# Hacker News Scraper (Node.js)

Command line utility to get the current top posts on Hacker News and output them in JSON.

Setup:

```npm install``` 

Run:

```node hacker_news_scraper.js --help```
  
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
  
```node hacker_news_scraper.js --posts 2```  
 
Output:

```
[
  {
    "author": "doppp",
    "points": 736,
    "uri": "https://techcrunch.com/2018/10/02/amazon-minimum-wage/",
    "title": "Amazon increases minimum wage for all U.S. workers to $15 an hour",
    "rank": 1,
    "comments": 61
  },
  {
    "author": "jimarcey",
    "points": 55,
    "uri": "https://code.fb.com/ai-research/facebook-accelerates-ai-development-with-new-partners-and-production-capabilities-for-pytorch-1-0/",
    "title": "Facebook launches PyTorch 1.0 with new partners and production capabilities",
    "rank": 2,
    "comments": 6
  }
]
```  
  
Libraries Used:  

  ```axios, lodash, minimist```  
  I used these highly trusted libraries to make performaing certain actions much more readable and succinct.
  
  ```chai, mocha, should, sinon, valid-url```    
  I used these libraries to help construct readable and maintainable tests. It is still possible to write tests without them, but they provide much nicer syntax for testing and allow me to mock certain functions.

  ```valid-url```  
  This is a library I hadn't used before, checking if a URI is valid is a common need and delegating this to a popular package (191,666 weekly downloads) is the correct thing to do.

  ```bluebird```  
  I used ```Promise.map``` to map over the ```postIds``` and make a further request to obtain the content for that post.
  
  
Problems:  
  
  When using the hackernews api ```https://github.com/HackerNews/API``` I didn't see an option to limit the number of posts returned.  
    
  By default it returns up to 500 top posts, which is an unneccessary amount for this command line utility. Ideally I'd only want to retrieve the amount the user specifies.

