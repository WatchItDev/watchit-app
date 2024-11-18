import { paramCase } from '@src/utils/change-case';
import { _id, _postTitles } from '@src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

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
    marketplace: `${ROOTS.DASHBOARD}/marketplace`,
    events: `${ROOTS.DASHBOARD}/events`,
    achievements: `${ROOTS.DASHBOARD}/achievements`,
    analytics: `${ROOTS.DASHBOARD}/analytics`,
    studio: `${ROOTS.DASHBOARD}/studio`,
    ownership: `${ROOTS.DASHBOARD}/ownership`,
    finance: `${ROOTS.DASHBOARD}/finance`,
    marketing: `${ROOTS.DASHBOARD}/marketing`,
    user: {
      root: (id: string) => `${ROOTS.DASHBOARD}/profile/${id}`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    governance: {
      root: `${ROOTS.DASHBOARD}/governance`,
      new: `${ROOTS.DASHBOARD}/governance/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/governance/details/${id}`,
    },
    publication: {
      root: `${ROOTS.DASHBOARD}/publication`,
      new: `${ROOTS.DASHBOARD}/publication/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/publication/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/publication/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/publication/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/publication/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
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
