import type { ButtonColor, ButtonSize } from '#ui/types'

import { type HeaderIconLink, links } from '~/utils/shared'

interface Button {
  label?: string
  icon?: string
  to?: string
  size?: ButtonSize
  color?: ButtonColor
  variant?: string
  click?: () => void
}

const defaultAction: Button = {
  icon: 'i-mdi-plus',
  size: '2xs',
  color: 'white',
}

const crumbs = ref<HeaderIconLink[]>([])
const actions = ref<Button[]>([])

export const useCrumb = () => {
  const set = (...crumbsArg: HeaderIconLink[]) => crumbs.value = crumbsArg
  const action = (...actionsArg: Button[]) => actions.value = actionsArg.map(action => ({ ...defaultAction, ...action }))
  const fromLink = (label: string): HeaderIconLink => links.find(link => label === link.label) as HeaderIconLink
  const clear = () => {
    crumbs.value = []
    actions.value = []
  }

  return {
    set,
    action,
    fromLink,
    actions,
    crumbs,
    clear,
  }
}
