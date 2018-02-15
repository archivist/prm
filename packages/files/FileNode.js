import { DocumentNode } from 'substance'

class FileNode extends DocumentNode {}

FileNode.define({
  type: 'metafile',
  title: { type: 'string', default: '' },
  fileType: { type: 'string', default: '' },
  date: { type: 'string', default: new Date().toISOString() },
  file: { type: 'string', default: '' },
  position: { type: 'string', default: '0' }
})

export default FileNode
