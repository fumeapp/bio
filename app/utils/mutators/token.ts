import { UAParser } from 'ua-parser-js'

export const tokenClient = {
  name: 'tokenClient',
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

/*
export const tokenIsCurrent = {
  name: 'tokenIsCurrent',
  result: {
    token: {
      isCurrent: {
        needs: { hash: true },
        compute({ hash }: { hash: string }) {
          // console.log(useCookie('token'))
          return hash === ''
        },
      },
    },
  },
}
*/
