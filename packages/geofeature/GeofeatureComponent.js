import { AnnotationComponent } from 'substance'

class GeofeatureComponent extends AnnotationComponent {
  render($$) {
    let el = $$('a')
      .attr("data-id", this.props.node.id)
      .attr("href", '#entityId=' + this.props.node.reference)
      .addClass(this.getClassNames())
      .on('click', this._onClick.bind(this, this.props.node.id))
    if (this.props.node.highlighted) {
      el.addClass('sm-highlighted')
    }
    el.append(this.props.children)
    return el
  }

  _onClick(refId) {
    this.send('referenceHighlight', refId)
  }
}

export default GeofeatureComponent
