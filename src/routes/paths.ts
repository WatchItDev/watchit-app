
const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://watchit.notion.site/WatchIT-d8a242d26292414991ed1d8fc5e918d3',
  figma:
    'https://www.figma.com/design/DKavGrV30OC0IQowdF4HYu/Watchit?node-id=1601-62&t=dDV5gk9skIVVRavr-1',
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    community: `${ROOTS.DASHBOARD}/community`,
    governance: `${ROOTS.DASHBOARD}/governance`,
    marketplace: `${ROOTS.DASHBOARD}/marketplace`,
    events: `${ROOTS.DASHBOARD}/events`,
    achievements: `${ROOTS.DASHBOARD}/achievements`,
    analytics: `${ROOTS.DASHBOARD}/analytics`,
    studio: `${ROOTS.DASHBOARD}/studio`,
    ownership: `${ROOTS.DASHBOARD}/ownership`,
    finance: `${ROOTS.DASHBOARD}/finance`,
    marketing: `${ROOTS.DASHBOARD}/marketing`,
  },
};
