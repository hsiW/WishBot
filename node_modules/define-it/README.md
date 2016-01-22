# DefineIt
Get dictionary definitions for any word in your Node app. Available on [npm](http://npmjs.org/packages/define-it).

### Usage

#### Setup
Install via [npm](http://npmjs.org/packages/define-it).
```
npm install define-it
```

#### Running

**Either request a full JSON response or only the words' meanings.**

Full JSON
```javascript
var defineJson = require('define-it').json;

defineJSON('big data', function(err, res) {
	if (err) console.error(err);
	if (res) console.log(res);
});

// will return
{
 "kind": "scribe#ReferenceGetResponse",
 "ttl": "900000",
 "data": [
  {
   "dataType": "dictionary",
   "numToShow": 1,
   "groupNumber": 0,
   "groupResult": {
    "query": "big data",
    "displayName": "\u003cb\u003ebig da·ta\u003c/b\u003e",
    "dataset": {
     "dataset": "dictionary"
    },
    "score": 1.0
   },
   "sectionType": "dictionary",
   "dictionaryData": {
    "word": "big data",
    "dictionaryType": "STANDARD",
    "definitionData": [
     {
      "word": "big data",
      "pos": "Noun",
      "meanings": [
       {
        "meaning": "extremely large data sets that may be analyzed computationally to reveal patterns, trends, and associations, especially relating to human behavior and interactions.",
        "examples": [
         "much IT investment is going towards managing and maintaining big data"
        ]
       }
      ],
      "phoneticText": "",
      "wordForms": [
       {
        "word": "big data",
        "form": "noun"
       }
      ]
     }
    ]
   }
  }
 ],
 "responseHandled": true
}
```

Definitions only (~~some~~ most words have multiple meanings, so generally arr.length > 1)
```javascript
var define = require('define-it').definitions;

define('big data', function(err, res) {
	if (err) console.error(err);
	if (res) console.log(res);
});

// will return
["extremely large data sets that may be analyzed computationally to reveal patterns, trends, and associations, especially relating to human behavior and interactions."]
```

#### Data source
All data is retrieved from the _unofficial_ Google dictionary dataset. [Link](https://www.googleapis.com/scribe/v1/research?key=AIzaSyDqVYORLCUXxSv7zneerIgC2UYMnxvPeqQ&dataset=dictionary&dictionaryLanguage=en&query=big%20data&callback=callback).

#### Contribute
Feel free to [make a pull request](https://github.com/kshvmdn/define-it/pulls) or [open an issue](https://github.com/kshvmdn/define-it/issues).
