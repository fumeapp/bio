interface Button {
  label?: string
  icon?: string
  to?: string
  size?: string
  variant?: string
  click?: () => void
}

const defaultAction: Button = {
  icon: 'i-mdi-plus',
  size: '2xs',
  variant: 'soft',
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
    useMenu().links.find(link => link.label === label ? crumbs.value.push(link) : null)
    return {
      add,
      action,
    }
  }
  const init = () => {
    crumbs.value = []
    actions.value = []
    return {
      add,
      action,
    }
  }

  return {
    crumbs,
    actions,
    action,
    add,
    init,
  }
}
