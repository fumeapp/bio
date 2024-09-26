import type { User } from '~/types/models'

export function useCrisp() {
  const setUser = (user: User) => {
    if (!import.meta.client)
      return
    window.$crisp.push(['set', 'user:email', user.email])
    window.$crisp.push(['set', 'user:nickname', user.name])
    window.$crisp.push(['set', 'user:avatar', user.avatar])
    window.$crisp.push(['safe', true])
  }

  const init = (user?: User) => {
    if (!import.meta.client)
      return

    window.$crisp = []
    window.CRISP_WEBSITE_ID = '057e3a0e-6db8-48f8-96a9-6e1f30882299'

    if (user) {
      window.$crisp.push(['set', 'user:email', user.email])
      window.$crisp.push(['set', 'user:nickname', user.name])
      window.$crisp.push(['set', 'user:avatar', user.avatar])
      window.$crisp.push(['safe', true])
    }

    (() => {
      const d = document
      const s = d.createElement('script')

      s.src = 'https://client.crisp.chat/l.js'
      s.async = true
      d.getElementsByTagName('head')[0]?.appendChild(s)
    })()
  }
  return {
    init,
    setUser,
  }
}
