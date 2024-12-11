import { paramCase } from '@src/utils/change-case';

// ----------------------------------------------------------------------

const MOCK_ID = '0x123';
const MOCK_TITLE = 'Demo title';

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
    root: '/',
    community: `/community`,
    marketplace: `/marketplace`,
    events: `/events`,
    achievements: `/achievements`,
    analytics: `/analytics`,
    studio: `/studio`,
    ownership: `/ownership`,
    finance: `/finance`,
    marketing: `/marketing`,
    user: {
      root: (id: string) => `/profile/${id}`,
      new: `/user/new`,
      list: `/user/list`,
      cards: `/user/cards`,
      profile: `/user/profile`,
      account: `/user/account`,
      edit: (id: string) => `/user/${id}/edit`,
      demo: {
        edit: `/user/${MOCK_ID}/edit`,
      },
    },
    governance: {
      root: `/governance`,
      new: `/governance/new`,
      details: (id: string) => `/governance/details/${id}`,
    },
    publication: {
      root: `/publication`,
      new: `/publication/new`,
      details: (id: string) => `/publication/${id}`,
      edit: (id: string) => `/publication/${id}/edit`,
      demo: {
        details: `/publication/${MOCK_ID}`,
        edit: `/publication/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `/post`,
      new: `/post/new`,
      details: (title: string) => `/post/${paramCase(title)}`,
      edit: (title: string) => `/post/${paramCase(title)}/edit`,
      demo: {
        details: `/post/${paramCase(MOCK_TITLE)}`,
        edit: `/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
  },
  publication: {
    root: `/publication`,
    checkout: `/publication/checkout`,
    play: (id: string) => `/publication/play/${id}`,
    details: (id: string) => `/publication/${id}`,
    demo: {
      details: `/publication/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
};
