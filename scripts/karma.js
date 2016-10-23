// Description:
//   Give all the karma


const tpl = require('../lib/response-template-strings');


module.exports = function hubot(robot) {
  const incrementRegExp = /@([a-z0-9_\-\.]+)\s?\+{2,}/ig
  const decrementRegExp = /@([a-z0-9_\-\.]+)\s?\-{2,}/ig
  const adjustRegExp = /@([a-z0-9_\-\.]+)\s?[\+\-]{2,}/ig;

  robot.hear(adjustRegExp, (res) => {
    const message = res.message;
    const botResponse = [];
    const increments = message.text.match(incrementRegExp) || [];
    const decrements = message.text.match(decrementRegExp) || [];

    increments.forEach((match) => {
      const user = match.replace(/^@([\w\.\-]+)\s?\+{2,}$/, '$1');

      if (user !== message.user.name) {
        const count = (robot.brain.get(user) || 0) + 1;
        robot.brain.set(user, count);
        botResponse.push(tpl.increment.format({ user, count }));
      } else {
        botResponse.push(tpl.karmaToSelf.format({ user }));
      }
    });

    decrements.forEach((match) => {
      const user = match.replace(/^@([\w\.\-]+)\s?\-{2,}$/, '$1');
      let count = robot.brain.get(user) || 0;

      if (count > 0) {
        count -= 1;
        robot.brain.set(user, count);
        botResponse.push(tpl.decrement.format({ user, count }));
      } else {
        botResponse.push(tpl.decrementError.format({ user }));
      }
    });

    if (botResponse.length) {
      return res.send(botResponse.join('\r\n'));
    }

    return null;
  });
};
