import { Component, ScrollPane } from 'substance'
import dropzone from 'dropzone'
import FileItem from './FileItem'

class FileContext extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'updateFile': this._updateFile,
      'removeFile': this._deleteFileFromDocument
    })
  }

  didMount() {
    this.files = []

    let authClient = this.context.authenticationClient
    let dzConfig = {
      url: '/api/media',
      acceptedFiles: 'image/*,application/pdf',
      dictDefaultMessage: this.getLabel('file-upload-description'),
      paramName: 'files',
      addRemoveLinks: true,
      headers: {
        'x-access-token': authClient.getSessionToken()
      }
    }
    let domEl = this.refs.files.getNativeElement()
    this.dropzone = new dropzone(domEl, dzConfig);
    this.dropzone.on('success', (f, res) => {
      this.files.push(res.name)
      f.serverFileName = res.name
      this._addFileToDocument(res.name)
    }, this)
    this.dropzone.on('queuecomplete', () => {
      setTimeout(() => {
        this.rerender()
      }, 500)
    })
    this.dropzone.on('removedfile', f => {
      let fileName = f.serverFileName || f.name
      this._removeFile(fileName, err => {
        if(err) console.error(err)
        let fileIndex = this.files.indexOf(fileName)
        this.files.splice(fileIndex, 1)
      })
    })
  }

  dispose() {
    this.dropzone.removeEventListeners()
  }

  render($$) {
    const files = this._getFileList()
    let dropArea = $$('div').addClass('se-droparea dropzone')
      .ref('files')
    let filePanel = $$(ScrollPane).ref('panelEl').append(
      dropArea,
      this.renderFileList($$)
    )

    let el = $$('div').addClass('sc-context-panel sc-file-panel').append(
      filePanel
    )

    return el
  }

  renderFileList($$) {
    const doc = this.context.doc
    const files = this._getFileList()
    let el = $$('div').addClass('se-file-list')
    files.forEach(file => {
      const fileNode = doc.get(file)
      el.append(
        $$(FileItem, {node: fileNode}).ref(file)
      )
    })
    return el
  }

  _getFileList() {
    let doc = this.context.doc
    const files = doc.get(['meta', 'files'])
    return files
  }

  _addFileToDocument(fileName) {
    let editorSession = this.context.editorSession
    editorSession.transaction((tx) => {
      let files = tx.get(['meta', 'files'])
      let file = tx.create({id: fileName.split('.')[0], type: 'metafile', file: fileName})
      files.push(file.id)
      tx.set(['meta', 'files'], files)
    })
  }

  _updateFile(fileId, prop, value) {
    let editorSession = this.context.editorSession
    editorSession.transaction((tx) => {
      tx.set([fileId, prop], value)
    })
  }

  _deleteFileFromDocument(fileId) {
    const doc = this.context.doc
    const fileNode = doc.get(fileId)
    this._removeFile(fileNode.file, (err) => {
      if(err) return
      let editorSession = this.context.editorSession
      editorSession.transaction(tx => {
        let files = tx.get(['meta', 'files'])
        let filesIndex = files.indexOf(fileId)
        files.splice(filesIndex, 1)
        tx.delete(fileId)
        tx.set(['meta', 'files'], files)
      })
      this.rerender()
    })
  }

  _removeFile(name, cb) {
    let fileClient = this.context.fileClient
    fileClient.deleteFile(name, cb)
  }
}

export default FileContext
