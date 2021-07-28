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
  settings: getIcon('ic-setting')
};
export default function SidebarConfig() {
  const { t } = useTranslation();

  const sidebarConfig = [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: t('content.business'),
      items: [
        {
          title: t('content.dashboard'),
          path: PATH_DASHBOARD.general.pageOne,
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
          path: PATH_DASHBOARD.general.pageThree,
          icon: ICONS.asset
        }
      ]
    },

    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: t('content.system'),
      items: [
        { title: t('poi.sPoi'), path: PATH_DASHBOARD.poi.root, icon: ICONS.poi },
        {
          title: t('content.settings'),
          path: PATH_DASHBOARD.general.pageThree,
          icon: ICONS.settings
        }
      ]
    }
  ];
  return sidebarConfig;
}
