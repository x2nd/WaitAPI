const express = require('express');
const qs = require("qs");
const request = require('request');
const app = express();
const port = process.env.PORT || 3001;

const sleep = (m) => {
  return new Promise((resolve) => setTimeout(resolve, m));
};

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/wait', async(req, res) => {
  const ret = {
    startTime: new Date().toLocaleString('ja'),
    message: req.query.message
  }
  let sec = (req.query.sec || 0);
  if (sec > 300) sec = 1; // 300秒以上は無効
  await sleep(sec * 1000);

  ret['waitSeconds'] = sec;
  ret['endTime'] = new Date().toLocaleString('ja');

  res.json(ret);
});

app.post('/api/wait', async(req, res) => {
  const ret = {
    startTime: new Date().toLocaleString('ja'),
    message: req.body.message
  }
  let sec = (req.body.sec || 0);
  if (sec > 300) sec = 1; // 300秒以上は無効
  console.log('/api/wait wait: ' + sec);
  await sleep(sec * 1000);

  ret['waitSeconds'] = sec;
  ret['endTime'] = new Date().toLocaleString('ja');

  res.json(ret);
});

app.get('/api/result', async(req, res) => {
  const url = `https://${process.env.HOST}/services/apexrest/result`;
  const sec = parseInt(process.env.WAIT || '0', 10);
  console.log('/api/result wait: ' + sec);
  await sleep(sec * 1000);

  request.get({
    uri: url,
    qs: req.query
  }, (err, req, data) => {
    res.write(data);
    res.end();
  });
});

app.post('/api/send', async(req, res) => {
  const url = `https://${process.env.HOST}/services/apexrest/send`;
  if (/^080/.test(req.body.To)) {
    const sec = parseInt((req.body.To || '00000000000')[8], 10) * 10;
    process.env.WAIT = sec.toString();
    console.log('/api/send wait: ' + process.env.WAIT);
    await sleep(sec * 1000);
  } else {
    process.env.WAIT = '0';
    await sleep(sec * 1000);
  }

  request.post({
    uri: url,
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=utf-8"
    },
    body: qs.stringify(req.body)
  }, (err1, res1, data1) => {
    res.write(data1);
    res.end();
  });
});


// サーバ起動
app.listen(port, () => console.log(`Listening on port ${port}`));
