import { Component, FontAwesomeIcon as Icon } from 'substance'
import moment from 'moment'
const fileTypes = ['main-image', 'image', 'doc']

class FileItem extends Component {
  render($$) {
    const mediaPath = this.context.config.mediaPath
    const node = this.props.node
    const Input = this.getComponent('input')

    let el = $$('div').addClass('sc-file-item')

    if(this._isImage()) {
      el.addClass('sm-image').append(
        $$('div').addClass('se-thumbnail').attr({
          style: 'background-image: url("' + mediaPath + '/s200/' + node.file + '");'
        })
      )
    }

    let titleEditor = $$(Input, {type: 'text', placeholder: this.getLabel('file-default-title')})
      .addClass('se-file-title')
      .ref('title')
      .attr({value: node.title})
      .on('change', this._onChange.bind(this, 'title'))

    let fileTypeEditor = $$('select')
      .addClass('se-file-type se-select')
      .ref('fileType')
      .on('change', this._onChange.bind(this, 'fileType'))
      .append(
        $$('option').append(this.getLabel('select-file-type'))
      )

    fileTypes.forEach(fileType => {
      let option = $$('option').attr({value: fileType}).append(this.getLabel('file-type-'+fileType))
      if(node.fileType === fileType) option.attr({selected: 'selected'})
      fileTypeEditor.append(option)
    })

    let dateEditor = $$(Input, {type: 'date'})
      .addClass('se-file-date')
      .ref('date')
      .attr({value: moment(node.date).format('YYYY-MM-DD')})
      .on('change', this._onChange.bind(this, 'date'))

    let posEditor = $$(Input, {type: 'number'})
      .addClass('se-file-pos')
      .ref('position')
      .attr({value: node.position})
      .on('change', this._onChange.bind(this, 'position'))

    el.append(
      $$('div').addClass('se-file-data').append(
        titleEditor,
        $$('div').addClass('se-dropdown').append(fileTypeEditor),
        dateEditor,
        posEditor
      ),
      $$('div').addClass('se-remove-file').append(
        $$(Icon, {icon: 'fa-trash'})
      ).on('click', this._removeFile)
    )

    return el
  }

  _isImage() {
    const node = this.props.node
    return node.fileType !== 'doc'
  }

  _onChange(prop) {
    const node = this.props.node
    let value = this.refs[prop].val()
    this.send('updateFile', node.id, prop, value)
  }

  _removeFile() {
    const node = this.props.node
    this.send('removeFile', node.id)
  }
}

export default FileItem
