module.exports = (fn, perpage) => {
  perpage = perpage || 10;

  return (req, res, next) => {
    console.log(req.params);
    
    var pageNumber = parseInt(req.params.page) || 1;

    fn((err, total) => {
      if (err) return next(err);

      req.page = res.locals.page = {
        number: pageNumber,
        perpage: perpage,
        total: total,
        count: Math.ceil(total / perpage),
        from: (pageNumber - 1) * perpage,
        to: ((pageNumber - 1) * perpage + perpage) - 1
      };
      next();
    })
  }
}

// console.log(parseInt(null) ||'1');
// console.log(parseInt(2.9) ||'1');