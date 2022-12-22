const express = require('express');
const app = express();

const sleep = (m) => {
  return new Promise((resolve) => setTimeout(resolve, m));
};

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

// サーバ起動
const PORT= 80;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));