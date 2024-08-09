import type { HeaderLink } from '@nuxt/ui-pro/types'

export type HeaderIconLink = HeaderLink & { icon: string }

const links: HeaderIconLink[] = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  },
  {
    label: 'Pens',
    icon: 'i-mdi-pen',
    to: '/pen',
  },
  {
    label: 'Cartridges',
    to: '/cartridge',
    icon: 'i-mdi-bottle-soda-outline',
  },
]

export const useMenu = () => {
  return {
    links,
  }
}
