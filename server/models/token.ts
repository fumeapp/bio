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

export const extend = {
  client,
}
