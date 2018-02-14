import Users from './Users'

export default {
  name: 'users',
  configure: function(config) {
    config.addPage('users', Users)
    config.addLabel('users', {
      en: 'Users',
      ru: 'Пользователи'
    })
    config.addLabel('add-user', {
      en: '+ New User',
      ru: '+ Добавить пользователя'
    })
    config.addLabel('search-email-placeholder', {
      en: 'Search by email...',
      ru: 'Поиск по email...'
    })
    config.addLabel('user-created-at', {
      en: 'created at',
      ru: 'добавлен'
    })
    config.addLabel('anonymous-user', {
      en: 'Anonymous',
      ru: 'Аноним'
    })
    config.addLabel('access-label', {
      en: 'access',
      ru: 'доступ'
    })
    config.addLabel('super-access-label', {
      en: 'super access',
      ru: 'админ'
    })
    config.addLabel('reset-password', {
      en: 'Reset password',
      ru: 'Сбросить пароль'
    })
    config.addLabel('enter-email', {
      en: 'Enter email',
      ru: 'Введите email'
    })
    config.addLabel('grant-access', {
      en: 'grant access',
      ru: 'открыть доступ'
    })
    config.addLabel('role-default-value', {
      en: 'select role',
      ru: 'выберите права'
    })
    config.addLabel('role-admin', {
      en: 'administrator',
      ru: 'администратор'
    })
    config.addLabel('role-volunteer', {
      en: 'volunteer',
      ru: 'волонтер'
    })
    config.addLabel('role-respondent', {
      en: 'respondent',
      ru: 'респондент'
    })
    config.addLabel('grant-super-access', {
      en: 'grant super access',
      ru: 'открыть супер доступ'
    })
    config.addLabel('invite-label', {
      en: 'Invite',
      ru: 'Пригласить'
    })
    config.addLabel('cancel-label', {
      en: 'Cancel',
      ru: 'Отмена'
    })
  }
}
