import { UAParser } from 'ua-parser-js'

const client = {
  name: 'token.client',
  result: {
    token: {
      client: {
        needs: {
          agent: true,
        },
        compute({ agent }: { agent: string }) {
          return new UAParser(agent).getResult()
        },
      },
    },
  },
}

const location = {
  name: 'token.location',
  result: {
    token: {
      location: {
        needs: {
          location: true,
        },
        compute({ location }: { location: string }) {
          return JSON.parse(location)
        },
      },
    },
  },
}

export const extend = {
  client,
  location,
}
