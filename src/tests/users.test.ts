import prisma from '../utils/prisma-client'
import gql from 'graphql-tag'

describe('Users resolvers', () => {
  it('create_user', async () => {
    await prisma.user.deleteMany({ where: { email: 'aamadeo-test@gmail.com'}})

    const query = gql`
    mutation CreateUser($name: String!, $email:String!, $password: String!) {
      create_user(name: $name, email:$email, password: $password) {
        id
        name
        email
      }
    }`

    const response = await global.request.post('/graphql').send({
      query: query.loc?.source.body,
      variables: {
        name: 'albert',
        email: 'aamadeo-test@gmail.com',
        password: 'thisismyrealpassword'
      }
    })

    expect(response.body.data.create_user).toMatchObject(
      expect.objectContaining({
        id: expect.anything(),
        name: 'albert',
        email: 'aamadeo-test@gmail.com'
      })
    )
  })

  it(`doesn't allow to create a user if email already exists`, async () => {
    await prisma.user.upsert({
      create: { email: 'aamadeo-test-2@gmail.com', name: 'albert', password: '' },
      where: { email: 'aamadeo-test-2@gmail.com'},
      update: {},
    })

    const query = gql`
    mutation CreateUser($name: String!, $email:String!, $password: String!) {
      create_user(name: $name, email:$email, password: $password) {
        id
        name
        email
      }
    }`

    const response = await global.request.post('/graphql').send({
      query: query.loc?.source.body,
      variables: {
        name: 'albert',
        email: 'aamadeo-test-2@gmail.com',
        password: 'thisismyrealpassword'
      }
    })

    expect(response.body.errors?.[0]).toMatchObject({
       message: 'Bad Request: Email already exist',
       code: 'INVALID_INPUT_ERROR',
    })
  })
})