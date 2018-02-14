import Menu from './Menu'

export default {
  name: 'prm-menu',
  configure: function(config) {
    config.addComponent('menu', Menu)
    config.addIcon('user-settings', {'fontawesome': 'fa-cog'})
    config.addIcon('logout', {'fontawesome': 'fa-sign-out'})
  }
}
