export type NavItem = { title: string; path: string; children?: NavItem[] }

export type Section = { title: string; items: NavItem[] }

export const useSections = () =>
  useAsyncData('sections', async () => {
    const tree = (await queryCollectionNavigation('docs')) as NavItem[]
    const docs = tree.find((item) => item.path === '/docs')
    const children = (docs?.children ?? []).filter((item) => item.path !== '/docs')
    const items = docs ? [{ title: 'Introduction', path: '/docs' }, ...children] : []
    return [{ title: 'Getting started', items }] satisfies Section[]
  })
