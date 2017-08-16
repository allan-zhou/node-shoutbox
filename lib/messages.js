function buildMessage(req, msg, type) {
  type = type || 'info';
  req.session.messages = req.session.messages || [];
  req.session.messages.push({ type: type, string: msg });
}

exports.info = buildMessage;

exports.error = (req, msg) => {
  buildMessage(req, msg, 'error');
}