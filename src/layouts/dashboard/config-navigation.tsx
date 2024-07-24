import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// locales
import { useLocales } from 'src/locales';
import SvgColor from 'src/components/svg-color';

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

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
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
            title: t('Comunity'),
            path: paths.dashboard.community,
            icon: ICONS.userGroup,
          },
          {
            title: t('Gorvernance'),
            path: paths.dashboard.governance,
            icon: ICONS.kanban,
          },
          {
            title: t('Marketplace'),
            path: paths.dashboard.marketplace,
            icon: ICONS.ecommerce,
          },
          {
            title: t('Events'),
            path: paths.dashboard.events,
            icon: ICONS.calendar,
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
          },

          // MAIL
          {
            title: t('Studio'),
            path: paths.dashboard.studio,
            icon: ICONS.external,
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
          },
        ],
      }
    ],
    [t]
  );

  return data;
}
