function buildMessage(session, msg, type) {
  type = type || 'info';
  session.messages = session.messages || [];
  session.messages.push({ type: type, string: msg });
}

exports.info = buildMessage;

exports.error = (session, msg) => {
  buildMessage(session, msg, 'error');
}