const express = require('express');
const path = require('path');
const app = express();

const { Wit, log } = require('node-wit');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const client = new Wit({
  accessToken: process.env.WIT_KEY,
  logger: new log.Logger(log.DEBUG) // optional
});

var faultsList = {
  'all_or_nothing_thinking': {
    'name': 'All or nothing thinking',
    'description': 'Perfectionism is the enemy. Reach for 80% and you will find you get further towards your goals.',
    'image': 'dist/images/allornothing.png'
  },
  'generalization': {
    'name': 'Generalization',
    'description': 'One bad experience does not mean that all experiences will be the same.',
    'image': 'dist/images/overgeneralization.png'
  },
  'mind_reading': {
    'name': 'Mind Reading',
    'description': 'Negative prejudices, poor self image and assumptions.....if you are guessing what others are thinking/feeling, you need to ask questions.',
    'image': 'dist/images/mindreading.png'
  },
  'fortune_telling': {
    'name': 'Fortune Telling',
    'description': 'Look for patterns. Do you have enough info to make this statement.',
    'image': 'dist/images/fortunetelling.png'
  },
  'catastrophizing': {
    'name': 'Catastrophizing',
    'description': 'Life is made up of infinite outcomes. The world has not ended. What resources do you have to build a stronger argument.',
    'image': 'dist/images/catastrophising.png'
  },
  'emotional_reasoning': {
    'name': 'Emotional Reasoning',
    'description': 'Emotions are not facts. What facts could disrupt your reasoning here?',
    'image': 'dist/images/EmotionalReasoning.png'
  },
  'labelling': {
    'name': 'Labelling',
    'description': 'Putting things into a cage makes them scary things. If they break out, avoid labeling.',
    'image': 'dist/images/labeling.png'
  },
  'personalization': {
    'name': 'Personalization',
    'description': 'Burst your bubble and share responsibility. Look for outside factors beyond those involved.',
    'image': 'dist/images/personalization_blame.png'
  },
  'shoulds': {
    'name': 'Should, Ought to',
    'description': 'Implies consequences that you can\'t have total control over.',
    'image': 'dist/images/should_must.png'
  }
}

function respond(res, faults) {
  if (faults.length == 0) {
    res.send([])
  } else {
    res.send(JSON.stringify(faults));
  }
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/**
 * Load the frontend app
 */
app.use('/dist', express.static(path.join(__dirname, './dist')));

app.get('/', function response(req, res) {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});


app.get('/check-phrase', function (req, res) {

  var phrase = req.query.phrase;
  var faults = []

  client.message(phrase, {})
    .then((data) => {
      if (Object.keys(data.entities).length > 1) {
        for (key in data.entities) {
          console.log(key);
          if (key !== 'generalization') {
            faults.push(faultsList[key])
          }
        }
      } else {
        for (key in data.entities) {
          faults.push(faultsList[key])
        }
      }

      respond(res, faults);

    })
    .catch(console.error);

})

app.get('/', function (req, res) {
  res.send('Hello world.');
})

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 8081 : process.env.PORT;

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})
