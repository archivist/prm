import FileContext from './FileContext'

export default {
  name: 'file-context',
  configure: function(config) {
    config.addContext('file-context', FileContext, false)
    config.addIcon('file-context', {'fontawesome': 'fa-files-o'})
    config.addLabel('file-context', {
      en: '+',
      ru: '+'
    })
    config.addLabel('file-upload-description', {
      en: 'Drag or select files to upload',
      ru: 'Перетащите или выберите файлы для загрузки'
    })
    config.addLabel('select-file-type', {
      en: 'Select type of file',
      ru: 'Выберите тип файла'
    })
    config.addLabel('file-default-title', {
      en: 'Enter title',
      ru: 'Заголовок'
    })
    config.addLabel('file-type-main-image', {
      en: 'Main image',
      ru: 'Основное изображение'
    })
    config.addLabel('file-type-image', {
      en: 'Image',
      ru: 'Вспомогательное изображение'
    })
    config.addLabel('file-type-doc', {
      en: 'Document',
      ru: 'Документ'
    })
  }
}
