import { async, Component, EditorSession, JSONConverter } from 'substance'
import Reader from './Reader'

const {series} = async
let converter = new JSONConverter()

class ReaderLayout extends Component {

  getInitialState() {
    return {
      session: null, // CollabSession will be stored here, if null indicates we are in loading state
      error: null, // used to display error messages e.g. loading of document failed
      notification: null //used to display status messages in topbar
    }
  }

  dispose() {
    if(this.state.session) {
      this.state.session.off(this)
      this.state.session.dispose()
    }
    document.body.classList.remove('sm-fixed-layout')
  }

  didMount() {
    // load the document after mounting
    this._loadDocument(this.getDocumentId())
  }

  willReceiveProps(newProps) {
    if (newProps.documentId !== this.props.documentId) {
      this.dispose()
      // TODO: Use setState instead?
      this.state = this.getInitialState()
      this._loadDocument(newProps.documentId)
    }

    if (newProps.entityId !== this.props.entityId && newProps.entityId !== undefined) {
      setTimeout(() => {
        this.refs.reader.highlightReferences([newProps.entityId])
      }, 10)
    }

    if(this.props.mobile && newProps.time && this.refs.reader) {
      setTimeout(() => {
        this.refs.reader._toggleNavigation()
      }, 10)
    }
  }

  _updateLayout() {
    if (this.props.mobile) {
      document.body.classList.remove('sm-fixed-layout')
      document.body.classList.add('sm-mobile-layout')
    } else {
      document.body.classList.add('sm-fixed-layout')
      document.body.classList.remove('sm-mobile-layout')
    }
  }

  render($$) {
    let Layout = this.getComponent('layout')
    let Spinner = this.getComponent('spinner')
    let Header = this.getComponent('header')

    let el = $$('div').addClass('sc-read-document')
    let main = $$(Layout, {
      width: 'medium',
      textAlign: 'center'
    }).append($$(Spinner, {message: 'spinner-loading'}))

    this._updateLayout()

    if (this.state.session) {
      main = $$(Reader, {
        configurator: this.props.configurator,
        editorSession: this.state.session,
        mobile: this.props.mobile
      }).ref('reader')
    }

    el.append(
      $$(Header, {menu: 'archive'}),
      main
    )

    return el
  }

  getDocumentId() {
    return this.props.documentId
  }

  /*
    Loads a document and initializes a Document Session
  */
  _loadDocument(documentId) {
    let configurator = this.props.configurator
    let documentClient = this.context.documentClient

    documentClient.getDocument(documentId, (err, docRecord) => {
      if (err) {
        this._onError(err)
        return
      }
      //let docRecord = SampleDoc
      let document = configurator.createDocument()
      let doc = converter.importDocument(document, docRecord.data)

      let session = new EditorSession(doc, {
        configurator: configurator
      })

      // For debugging
      window.doc = doc
      window.session = session

      series([
        this._loadResources(documentId, session),
        this._loadLocation(session)
      ], () => {
        this.setState({
          session: session
        })
      })
    })
  }

  _loadResources(documentId, session) {
    return function(cb) {
      this._loadDocumentResources(documentId, (err, resources) => {
        session.resources = resources
        cb()
      })
    }.bind(this)
  }

  /*
    Loads document resources
  */
  _loadDocumentResources(documentId, cb) {
    let resourceClient = this.context.resourceClient
    resourceClient.getDocumentResources(documentId, cb)
  }

  _loadLocation(session) {
    return function(cb) {
      const doc = session.getDocument()
      const meta = doc.getDocumentMeta()
      const locationId = meta.interview_location
      const resourceClient = this.context.resourceClient
      if(!locationId) return cb()
      resourceClient.getEntity(locationId, (err, location) => {
        session.location = location
        cb()
      })
    }.bind(this)
  }

  _onError(err) {
    console.error(err)
  }
}

export default ReaderLayout
