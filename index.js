require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = [];
 
const getHostnameFromRegex = (url) => {
  const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
  return matches && matches[1];
}
  
//POST
app.post("/api/shorturl", function(req, res) {
  hostname = getHostnameFromRegex(req.body.url);
  console.log("Hostname: " + hostname, req.body.url);
  if (!hostname) res.json({ error: 'invalid url' });
 
  dns.lookup(hostname, (error, addresses) => {
    console.error(error);
    console.log(addresses);
 
    if (!error) {
       let newUrl = { original_url : req.body.url, short_url : urls.length + 1};
      urls.push(newUrl);
      res.json(newUrl);
    } else {
      res.json({ error: 'invalid url' });
    }
  });
});
 
//GET
app.get('/api/shorturl/:num', function(req, res) {
 
  for (let i = 0; i < urls.length; i++) {
    console.log(urls[i].original_url);
    if (urls[i].short_url == req.params.num) {
        res.redirect(urls[i].original_url);
    }
  }
 
});
 
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});