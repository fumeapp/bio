import type { ButtonColor, ButtonSize } from '#ui/types'

import { links } from '~/utils/shared'

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
  const action = (button: Button) => {
    actions.value.push({ ...defaultAction, ...button })
    return {
      action,
    }
  }

  const add = (label: string) => {
    links.find(link => link.label === label ? crumbs.value.push(link) : null)
    return {
      add,
      action,
      // eslint-disable-next-line ts/no-use-before-define
      custom,
    }
  }

  const custom = (link: HeaderIconLink) => {
    crumbs.value.push(link)
    return {
      add,
      custom,
      action,
    }
  }
  const init = () => {
    crumbs.value = []
    actions.value = []
    return {
      add,
      action,
      custom,
    }
  }

  return {
    crumbs,
    actions,
    action,
    add,
    custom,
    init,
  }
}
