import appstoreFilled from '@iconify/icons-ant-design/appstore-filled';
import { Icon } from '@iconify/react';
import AppsIcon from '@material-ui/icons/Apps';
import ApartmentIcon from '@material-ui/icons/Apartment';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22
};

const menuConfig = [
  {
    title: 'Sản phẩm',
    path: '/products',
    icon: <AppsIcon {...ICON_SIZE} />,
    children: [
      {
        subheader: 'Danh sách',
        items: [
          { title: 'Hệ thống quản lý giao hàng', path: '/' },
          { title: 'Ứng dụng cho tài xế', path: '/' },
          { title: 'Headless-TZM', path: '/' }
        ]
      }
    ]
  },
  { title: 'Tính năng', path: '/features', icon: <FormatListBulletedIcon {...ICON_SIZE} /> }
];

export const rightMenuConfig = [
  {
    title: 'Doanh nghiệp',
    path: '/enterprise',
    icon: <Icon icon={appstoreFilled} {...ICON_SIZE} />
  },
  {
    title: 'Startup',
    path: '/start-up',
    icon: <Icon icon={appstoreFilled} {...ICON_SIZE} />
  },
  { title: 'Khách hàng', path: '/client', icon: <Icon icon={appstoreFilled} {...ICON_SIZE} /> },
  {
    title: 'Theo yêu cầu',
    path: '/on-demand',
    icon: <Icon icon={appstoreFilled} {...ICON_SIZE} />
  }
];

export default menuConfig;
