import Interview from './Interview'
import MetaNode from './MetaNode'
import InterviewSeed from './InterviewSeed'

import { BasePackage, ParagraphPackage, HeadingPackage, LinkPackage, EmphasisPackage, StrongPackage} from 'substance'
import { CommentPackage, TimecodePackage } from 'archivist-js'
import CommentaryPackage from '../commentary/package'
import GeofeaturePackage from '../geofeature/package'
import TopicPackage from '../topic/package'
import EntityReferencePackage from '../entity-reference/package'

export default {
  name: 'archivist-interview',
  configure: function(config) {
    config.defineSchema({
      name: 'archivist-interview',
      version: '1.0.0',
      DocumentClass: Interview,
      defaultTextType: 'paragraph'
    })
    config.addNode(MetaNode)
    config.addSeed(InterviewSeed)

    // Import Substance Core packages
    config.import(BasePackage)
    config.import(ParagraphPackage)
    config.import(HeadingPackage)
    config.import(EmphasisPackage)
    config.import(StrongPackage)
    config.import(LinkPackage)

    // Import archivist specific packages
    config.import(GeofeaturePackage)
    config.import(CommentPackage)
    config.import(TimecodePackage)
    config.import(TopicPackage)
    config.import(CommentaryPackage)
    config.import(EntityReferencePackage)

    config.addLabel('undo', {
      en: 'undo',
      ru: 'отмена'
    })
    config.addLabel('redo', {
      en: 'redo',
      ru: 'вернуть'
    })
    config.addLabel('strong', {
      en: 'strong',
      ru: 'жирный'
    })
    config.addLabel('emphasis', {
      en: 'emphasis',
      ru: 'наклонный'
    })
    config.addLabel('link', {
      en: 'link',
      ru: 'ссылка'
    })
  }
}
