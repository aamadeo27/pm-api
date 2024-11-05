import gql from 'graphql-tag'

describe('Hello Graphql', () => {
  it('should say hello' , async () => {
    const query = gql`
    query Hello {
      hello
    }`

    const response = await global.request.post('/graphql').send({
      query: query.loc?.source.body,
    })

    expect(response.body.data.hello).toBe('Hello World')

    console.log('Test complete')
  })
})