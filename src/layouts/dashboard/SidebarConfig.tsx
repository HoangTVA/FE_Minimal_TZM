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
  tradeZone: getIcon('ic-tz')
};
export default function SidebarConfig() {
  const { t } = useTranslation();

  const sidebarConfig = [
    {
      subheader: t('content.business'),
      items: [
        {
          title: t('content.dashboard'),
          path: PATH_DASHBOARD.general.comingSoon,
          icon: ICONS.dashboard
        },
        {
          title: t('content.stores'),
          path: PATH_DASHBOARD.store.root,
          icon: ICONS.store
        },
        { title: t('poi.poi'), path: PATH_DASHBOARD.poiBrand.root, icon: ICONS.poiBrand },
        { title: t('content.map'), path: PATH_DASHBOARD.general.brandMap, icon: ICONS.map },
        {
          title: t('content.asset'),
          path: PATH_DASHBOARD.asset.root,
          icon: ICONS.asset,
          children: [
            { title: t('asset.list'), path: PATH_DASHBOARD.asset.assets },
            { title: t('asset.violationLogs'), path: PATH_DASHBOARD.asset.violations }
          ]
        },
        {
          title: t('content.templates'),
          path: PATH_DASHBOARD.template.root,
          icon: ICONS.template
        }
      ]
    },
    {
      subheader: t('content.system'),
      items: [
        { title: t('poi.sPoi'), path: PATH_DASHBOARD.poi.root, icon: ICONS.poi },
        {
          title: 'Group zone',
          path: PATH_DASHBOARD.groupZone.root,
          icon: ICONS.groupZone
        },
        {
          title: 'Trade zone',
          path: PATH_DASHBOARD.tradeZone.root,
          icon: ICONS.tradeZone,
          children: [
            { title: t('tz.calendar'), path: PATH_DASHBOARD.tradeZone.tradeZoneCalendar },
            { title: t('tz.tzVersion'), path: PATH_DASHBOARD.tradeZone.tradeZoneVersion },
            { title: t('tz.tzList'), path: PATH_DASHBOARD.tradeZone.detailsTradeZone }
          ]
        }
      ]
    }
  ];
  return sidebarConfig;
}
