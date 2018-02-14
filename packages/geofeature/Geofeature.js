import { DocumentNode } from 'substance'

/*
  Entities Geofeature node.
  Holds Geofeature entity.

  Attributes
    - name Geofeature name
    - synonyms List of geofeature synonyms
    - featureType Type of geofeature
    - point Geographical point coordinates (Long, Lat)
    - description Geofeature description
*/
class Geofeature extends DocumentNode {

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

Geofeature.type = 'geofeature'

Geofeature.define({
  point: { type: ['number'], default: [], field: { type: "map", dataType: "point", placeholder: "Укажите точку на карте" }},
  name: { type: 'string', default: 'Безымянный объект', field: { type: "geocoded", dataType: "text", placeholder: "Укажите название объекта" }},
  synonyms: {type: ['string'], default: [], field: { type: "tags", placeholder: "Перечислите синонимы объекта" }},
  featureType: {type: ['string'], default: [], field: { type: "multiple", options: ['ординарное место', 'место взятия интервью', 'место исторических событий', 'место коммеморации'], placeholder: "Выберите тип объекта" }},
  description: { type: 'string', default: '', field: { type: "prose", placeholder: "Укажите описание объекта" }}
})

export default Geofeature
