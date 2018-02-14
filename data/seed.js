'use strict';

var config = require('config')
var serverConfig = config.get('server')


var seedData = {
  users: {
    'archivist-bot': {
      userId: 'archivist-bot',
      name: 'Archivist Bot',
      loginKey: '',
      email: 'bot@archivist',
      password: '',
      access: false,
      super: false
    },
    // Default login data (you should change it after setup!)
    // head@archivist/archivist
    'archivist-head': {
      userId: 'archivist-head',
      name: 'Archivist Head',
      loginKey: '',
      email: 'head@archivist',
      password: '$2a$06$E/Ym3tb3mvdj0RyNhFUFuuP0TKIQe7zSiLS1gBLHBGNUnOckTOHyS',
      access: true,
      super: true
    }
  },
  sessions: {
    'archivist-bot': {
      sessionToken: serverConfig.botToken,
      userId: 'archivist-bot'
    }
  }
};

module.exports = seedData;