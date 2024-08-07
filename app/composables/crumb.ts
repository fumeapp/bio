import type { HeaderLink } from '@nuxt/ui-pro/types'

type HeaderIconLink = HeaderLink & { icon: string }

const links: HeaderIconLink[] = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Pens',
    icon: 'i-mdi-pen',
    to: '/pens',
  },
  {
    label: 'Cartridges',
    to: '/cartridges',
    icon: 'i-mdi-bottle-soda-outline',
  },
]

const crumbs = ref<HeaderIconLink[]>([])

export const useCrumb = () => {
  const add = (label: string) => {
    links.find(link => link.label === label ? crumbs.value.push(link) : null)
    return {
      add,
    }
  }

  const init = () => {
    crumbs.value = []
    return {
      add,
    }
  }

  return {
    crumbs,
    add,
    links,
    init,
  }
}
