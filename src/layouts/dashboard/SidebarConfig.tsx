// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/static/icons/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  dashboard: getIcon('dashboard'),
  store: getIcon('ic-store'),
  poiBrand: getIcon('ic-poi'),
  poi: getIcon('s-poi'),
  map: getIcon('ic-map'),
  asset: getIcon('ic-asset'),
  settings: getIcon('ic-setting'),
  template: getIcon('ic-template'),
  groupZone: getIcon('ic-gz'),
  tradeZone: getIcon('ic-tz'),
  task: getIcon('ic-task1'),
  team: getIcon('ic-team'),
  agent: getIcon('ic-agent1'),
  tracking: getIcon('tracking'),
  order: getIcon('box')
};
export default function SidebarConfig() {
  const { t } = useTranslation();

  const sidebarConfig = [
    {
      subheader: t('common.general'),
      items: [
        {
          title: t('content.dashboard'),
          path: PATH_DASHBOARD.general.comingSoon,
          icon: ICONS.dashboard
        },
        { title: t('content.map'), path: PATH_DASHBOARD.general.brandMap, icon: ICONS.map },
        {
          title: t('content.stores'),
          path: PATH_DASHBOARD.store.root,
          icon: ICONS.store
        },
        {
          title: t('content.templates'),
          path: PATH_DASHBOARD.template.root,
          icon: ICONS.template
        },
        {
          title: t('content.asset'),
          path: PATH_DASHBOARD.asset.root,
          icon: ICONS.asset,
          children: [
            { title: t('asset.list'), path: PATH_DASHBOARD.asset.assets },
            { title: t('asset.violationLogs'), path: PATH_DASHBOARD.asset.violations }
          ]
        }
      ]
    },
    {
      subheader: t('common.delivery'),
      items: [
        {
          title: t('common.tracking'),
          path: PATH_DASHBOARD.tracking.root,
          icon: ICONS.tracking
        },
        {
          title: t('common.task'),
          path: PATH_DASHBOARD.task.root,
          icon: ICONS.task
        },
        {
          title: t('common.team'),
          path: PATH_DASHBOARD.team.root,
          icon: ICONS.team
        },
        {
          title: t('common.agent'),
          path: PATH_DASHBOARD.agent.root,
          icon: ICONS.agent
        },
        {
          title: t('common.order'),
          path: PATH_DASHBOARD.order.root,
          icon: ICONS.order
        }
      ]
    },
    {
      subheader: t('common.businessArea'),
      items: [
        {
          title: t('common.groupZone'),
          path: PATH_DASHBOARD.groupZone.root,
          icon: ICONS.groupZone
        },
        {
          title: t('common.tradeZone'),
          path: PATH_DASHBOARD.tradeZone.root,
          icon: ICONS.tradeZone,
          children: [
            { title: t('tz.calendar'), path: PATH_DASHBOARD.tradeZone.tradeZoneCalendar },
            { title: t('tz.tzVersion'), path: PATH_DASHBOARD.tradeZone.tradeZoneVersion },
            { title: t('tz.tzList'), path: PATH_DASHBOARD.tradeZone.tradeZones }
          ]
        },
        { title: t('poi.poi'), path: PATH_DASHBOARD.poiBrand.root, icon: ICONS.poiBrand }
      ]
    },
    {
      subheader: t('content.system'),
      items: [{ title: t('poi.sPoi'), path: PATH_DASHBOARD.poi.root, icon: ICONS.poi }]
    }
  ];
  return sidebarConfig;
}
