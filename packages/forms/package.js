import OstNodeForm from './OstNodeForm'

export default {
  name: 'ost-forms',
  configure: function(config) {
    config.addComponent('form', OstNodeForm, true)
  }
}
