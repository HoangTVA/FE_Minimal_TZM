import appstoreFilled from '@iconify/icons-ant-design/appstore-filled';
import { Icon } from '@iconify/react';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22
};

const menuConfig = [
  // {
  //   title: 'Home',
  //   path: '/',
  //   icon: <Icon icon={homeFill} {...ICON_SIZE} />
  // },
  {
    title: 'Dashboard',
    path: PATH_DASHBOARD.root,
    icon: <Icon icon={appstoreFilled} {...ICON_SIZE} />
  }
];

export default menuConfig;
