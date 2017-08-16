function notFound(req, res) {

  console.log(req.url);
  console.log(req.path);

  const isApiRequest = req.url.split('\/').filter(s => s).shift() === 'api';

  if (isApiRequest) {
    res.status(404).format({
      json: () => {
        res.send({ message: 'Resource not found!' });
      }
    });
  } else {
    res.status(404).format({
      json: () => {
        res.send({ message: 'Resource not found!' });
      },
      html: () => {
        res.render('404');
      }
    });
  }
}

module.exports = notFound;