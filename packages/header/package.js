import Header from './Header'

export default {
  name: 'ost-header',
  configure: function(config) {
    config.addComponent('header', Header)
  }
}