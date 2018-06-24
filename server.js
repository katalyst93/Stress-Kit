var express = require('express');
var app = express();

const {Wit, log} = require('node-wit');
const client = new Wit({
  accessToken: 'VIIIUTFNYMSZ2QYELE5SCARBK6ZGT7FP',
  logger: new log.Logger(log.DEBUG) // optional
});

var faultsList = {
  'all_or_nothing_thinking': {'name': 'All or nothing thinking',
                              'description': 'Perfectionism is the enemy. Reach for 80% and you will find you get further towards your goals.'},
  'generalization': {'name': 'Generalization',
                     'description': 'One bad experience does not mean that all experiences will be the same.'},
  'mind_reading': {'name':'Mind Reading',
                   'description': 'Negative prejudices, poor self image and assumptions.....if you are guessing what others are thinking/feeling, you need to ask questions.'},
  'fortune_telling': {'name':'Fortune Telling',
                      'description': 'Look for patterns. Do you have enough info to make this statement.'},
  'catastrophizing': {'name':'Catastrophizing',
                      'description':'Life is made up of infinite outcomes. The world has not ended. What resources do you have to build a stronger argument.'},
  'emotional_reasoning': {'name': 'Emotional Reasoning',
                          'description': 'Emotions are not facts. What facts could disrupt your reasoning here ?'},
  'labelling': {'name': 'Labeling',
                'description': 'Putting things into a cage makes them scary things. If they break out, avoid labeling.'},
  'personalization': {'name': 'Personalization',
                      'description': 'Burst your bubble and share responsibility. Look for outside factors beyond those involved.'},
  'shoulds': {'name': 'Shoulds',
              'description': 'Implies consequences that you can\'t have total control over.'}
}

function respond(res,faults){
  if (faults.length == 0){
    res.send([])
  } else {
    res.send( JSON.stringify(faults,null,4) );
  }
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/check-phrase', function (req, res) {

  var phrase = req.query.phrase;
  var faults = []

  client.message(phrase , {})
    .then( (data) => {
      for (key in data.entities){
        faults.push({
          name: faultsList[key]['name'],
          description: faultsList[key]['description']
        })
      }

  respond(res,faults);

    })
    .catch(console.error);

})

app.get('/', function (req, res) {
   res.send('Hello world.');
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
