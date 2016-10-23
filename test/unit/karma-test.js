/* eslint-disable import/no-extraneous-dependencies */
const co = require('co');
const { expect } = require('chai');
const tpl = require('../../lib/response-template-strings');
const Helper = require('hubot-test-helper');

const helper = new Helper('../scripts');
let room;

describe('Karmabot', () => {
  beforeEach(() => {
    room = helper.createRoom();
  });


  it('tells the karma after a single user received positive karma', (done) => {
    co(() => {
      room.user.say('alice', '@goodguy ++');
    }).then(() => {
      const res = tpl.increment.format({ user: 'goodguy', count: 1 });
      expect(room.messages[1][1]).to.be.eq(res);
      done();
    }).catch(done);
  });


  it('tells the karma after a single user received negative karma', (done) => {
    co(() => {
      room.robot.brain.set('goodguy', 1);
      room.user.say('alice', '@goodguy --');
    }).then(() => {
      const res = tpl.decrement.format({ user: 'goodguy', count: 0 });
      expect(room.messages[1][1]).to.be.eq(res);
      done();
    }).catch(done);
  });


  it('tells the karma is already at 0 after a single user received negative karma', (done) => {
    co(() => {
      room.user.say('alice', '@goodguy --');
    }).then(() => {
      const res = tpl.decrementError.format({ user: 'goodguy' });
      expect(room.messages[1][1]).to.be.eq(res);
      done();
    }).catch(done);
  });


  it('tells the karma after several users received karma', (done) => {
    co(() => {
      room.user.say('alice', '@goodguy ++ @goodguy++ @badguy --');
    }).then(() => {
      const res = [];
      res.push(tpl.increment.format({ user: 'goodguy', count: 1 }));
      res.push(tpl.increment.format({ user: 'goodguy', count: 2 }));
      res.push(tpl.decrementError.format({ user: 'badguy', count: 0 }));

      expect(room.messages[1][1]).to.be.eq(res.join('\r\n'));
      done();
    }).catch(done);
  });


  it('does not allow a user to increment itself', (done) => {
    co(() => {
      room.robot.brain.set('alice', 1);
      room.user.say('alice', '@alice ++');
    }).then(() => {
      expect(room.messages[1][1]).to.be.eq(tpl.karmaToSelf.format({ user: 'alice' }));
      expect(room.robot.brain.get('alice')).to.be.eq(1);
      done();
    }).catch(done);
  })


  afterEach(() => {
    room.destroy();
  });
});
