import FileNode from './FileNode'

export default {
  name: 'prm-file',
  configure: function(config) {
    config.addNode(FileNode)
  }
}
