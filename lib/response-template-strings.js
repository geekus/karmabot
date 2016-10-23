const fmt = require('./formatter');

const responseTpl = {};

responseTpl.increment = fmt`Woot! @${'user'} now at ${'count'} — Gz!`;
responseTpl.decrement = fmt`OMG! @${'user'} now at ${'count'} — Sorry!`;
responseTpl.decrementError = fmt`@${'user'} is already at 0 — Can't get much lower. :grimacing:`;
responseTpl.karmaToSelf = fmt`Nice try @${'user'}! :wink:`;

module.exports = responseTpl;
