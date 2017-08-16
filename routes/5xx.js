function error (err, req, res, next) {
  console.error(err.stack);

  var msg;
  switch (err.type) {
    case 'database':
      msg = 'database Server Error';
      res.statusCode = 503;
      break;
    default:
      msg = 'Server Unavailable';
      res.statusCode = 500;
      break;
  }

  res.format({
    html: () => {
      res.render('5xx', { msg: msg, status: res.statusCode });
    },
    json: () => {
      res.send({ error: msg });
    }
  });
}

module.exports = error;