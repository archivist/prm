let seed = function(tx) {
  let body = tx.get('body')

  tx.create({
    id: 'meta',
    type: 'meta',
    title: 'Untitled Interview'
  })

  tx.create({
    id: 'p1',
    type: 'paragraph',
    content: 'Insert your interview here.'
  })
  body.show('p1')
}

export default seed
