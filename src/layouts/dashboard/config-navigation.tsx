import { useMemo } from 'react';
// routes
import { paths } from '@src/routes/paths';
// locales
import { useLocales } from '@src/locales';
import SvgColor from '@src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  userGroup: icon('ic_user_group'),
};

// ----------------------------------------------------------------------

const applyComingSoon = (items: any[]): any[] => {
  return items.map((it) => {
    const isComing = Boolean(it?.comingSoon) || it?.status === 'comingSoon';

    return {
      ...it,
      disabled: isComing || it?.disabled,
      // caption: isComing ? it?.caption ?? '✨ Coming soon' : it?.caption,
      children: it?.children ? applyComingSoon(it.children) : undefined,
    };
  });
}

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => {

      const base = [
        // OVERVIEW
        // ----------------------------------------------------------------------
        {
          subheader: t('overview'),
          items: [
            {
              title: t('explore'),
              path: paths.dashboard.root,
              icon: ICONS.dashboard,
            },
            {
              title: t('Community'),
              path: paths.dashboard.community,
              icon: ICONS.userGroup,
              comingSoon: true,
            },
            {
              title: t('Governance'),
              path: paths.dashboard.governance.root,
              icon: ICONS.kanban,
              comingSoon: true,
            },
            {
              title: t('Marketplace'),
              path: paths.dashboard.marketplace,
              icon: ICONS.ecommerce,
              comingSoon: true,
            },
            {
              title: t('Events'),
              path: paths.dashboard.events,
              icon: ICONS.calendar,
              comingSoon: true,
            },
            {
              title: t('Achievements'),
              path: paths.dashboard.achievements,
              icon: ICONS.label,
            },
          ],
        },

        // MANAGEMENT
        // ----------------------------------------------------------------------
        {
          subheader: t('management'),
          items: [
            // FILE MANAGER
            {
              title: t('Analytics'),
              path: paths.dashboard.analytics,
              icon: ICONS.analytics,
              comingSoon: true,
            },

            // MAIL
            {
              title: t('Studio'),
              path: paths.dashboard.studio,
              icon: ICONS.external,
              comingSoon: true,
            },

            // CHAT
            {
              title: t('Ownership'),
              path: paths.dashboard.ownership,
              icon: ICONS.lock,
            },

            // CALENDAR
            {
              title: t('Finance'),
              path: paths.dashboard.finance,
              icon: ICONS.banking,
            },

            // KANBAN
            {
              title: t('Marketing'),
              path: paths.dashboard.marketing,
              icon: ICONS.tour,
              comingSoon: true,
            },

            // COLLABORATION
            {
              title: t('Collaboration'),
              path: paths.dashboard.collaborations,
              icon: ICONS.chat,
              comingSoon: true,
            },
          ],
        },
      ]

      return base.map((group) => ({
        ...group,
        items: applyComingSoon(group.items),
      }));
    },
    [t]
  );

  return data;
}
