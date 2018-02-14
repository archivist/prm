import { DocumentNode } from 'substance'

/*
  Entities Topic node.
  Holds Topic entity.

  Attributes
    - name Topic name
    - synonyms List of topic synonyms
    - description Topic description
*/
class Topic extends DocumentNode {

  // Get entity name
  getName() {
    return this.name
  }

  // Get entity description
  getDescription() {
    return this.description
  }

  // Get entity synonyms
  getSynonyms() {
    let synonyms = this.synonyms

    let name = this.getName()
    if(synonyms.indexOf(name) < 0) {
      if(name !== '') synonyms.push(name)
    }

    return synonyms
  }

}

Topic.type = 'topic'

Topic.define({
  name: {type: 'string', default: 'Безымянная тема', field: {type: "text", dataType: "text", placeholder: "Укажите название темы"}},
  synonyms: {type: ['string'], default: [], field: {type: "tags", placeholder: "Перечислите синонимы темы"}},
  description: {type: 'string', default: '', field: {type: "prose", placeholder: "Укажите описание темы"}}
})

export default Topic
