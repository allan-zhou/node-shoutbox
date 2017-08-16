const Messages = require('../messages');

function parseField(field) {
  return field
    .split(/\[|\]/)
    .filter(s => s);
}

function getFieldValue(req, parsedField) {
  var obj = req.body;
  parsedField.forEach(function (prop) {
    obj = obj[prop];
  });
  return obj;
}

exports.required = (field) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getFieldValue(req, field)) {
      next();
    } else {
      Messages.error(req, `${field.join('.')} 是必填字段`);
      res.redirect('back');
    }
  }
}

exports.lengthRange = (field, min, max) => {
  field = parseField(field);
  min = min || 0;
  max = max || 99999;
  return (req, res, next) => {
    const fieldLength = getFieldValue(req, field).length;
    if (fieldLength >= min && fieldLength <= max) {
      next();
    } else if (fieldLength < min) {
      Messages.error(req, `${field.join('.')}不能小于${min}个字符`);
      res.redirect('back');
    } else if (fieldLength > max) {
      Messages.error(req, `${field.join('.')}不能大于${max}个字符`);
      res.redirect('back');
    }
  }
}

// const rrr = {
//   body: {
//     post: {
//       title: 'post title',
//       body: 'post content'
//     }
//   }
// }
// console.log('post[title]'.split(/\[|\]/).filter(s => s));

// getFieldValue(rrr,'post[title]'.split(/\[|\]/).filter(s => s));
