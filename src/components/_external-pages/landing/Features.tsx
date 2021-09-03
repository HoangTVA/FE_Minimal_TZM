// material
import {
  Box,
  Card,
  Container,
  Grid,
  LinkProps,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography
} from '@material-ui/core';
import { alpha, styled, Theme, useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { MHidden } from 'components/@material-extend';
import Page from 'components/Page';
import ScrollToTop from 'components/ScrollToTop';
// components
import { LandingAdvertisement } from 'components/_external-pages/landing';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InView from 'react-intersection-observer';
import { NavHashLink } from 'react-router-hash-link';
import FeatureHero from '../feature/FeatureHero';

const RootStyle = styled(Page)({
  height: '100%'
});

const ContentStyle = styled('div')(({ theme }) => ({
  // overflow: 'hidden',
  // position: 'relative',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4, 0, 8)
}));

interface ListItemStyleProps extends LinkProps {
  component?: ReactNode;
  to?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  selected: {
    backgroundColor: alpha(theme.palette.primary.main, 0.5),
    color: theme.palette.primary.main
  }
}));

const ListItemStyle = styled(ListItem)<ListItemStyleProps>(({ theme }) => ({
  ...theme.typography.h6,
  cursor: 'pointer',
  padding: 0,
  color: theme.palette.text.secondary,
  transition: theme.transitions.create('color'),
  '&:hover': {
    color: theme.palette.text.primary
  },
  '& .MuiListItemButton-root .Mui-selected': {
    backgroundColor: alpha(theme.palette.primary.main, 0.5)
  }
}));

const StickyNavigation = styled(Card)({
  position: 'sticky',
  top: '80px',
  left: 0,
  right: 0
});

type Feature = {
  icon: string;
  title: string;
  description: string;
};

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const { icon, title, description } = feature;

  return (
    <Card
      sx={{
        zIndex: 1,
        p: 5,
        boxShadow: (theme) =>
          `0px 48px 48px ${alpha(
            isLight ? theme.palette.grey[500] : theme.palette.common.black,
            0.12
          )}`,
        height: '100%'
      }}
    >
      <Stack spacing={5}>
        <Box
          component="img"
          src={icon}
          sx={{
            width: 64,
            height: 64
          }}
        />
        <Typography variant="h4">{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Card>
  );
};

const scrollWithOffset = (el: HTMLElement) => {
  const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
  const yOffset = -80;
  window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
};

const FeaturesPage = () => {
  const [currentInviewIdx, setCurrentInviewIdx] = useState(0);
  const classes = useStyles();
  const { t } = useTranslation();
  const navigation = [
    {
      title: t('ldPage.manageStore'),
      to: 'store-management',
      items: [
        {
          title: t('features.storeChain'),
          description: t('features.storeChainDes'),
          icon: '/static/feature/chain.svg'
        },
        {
          title: t('features.scheduleTradeZone'),
          description: t('features.scheduleTradeZoneDes'),
          icon: '/static/feature/calendar.svg'
        },
        {
          title: t('features.assetManagement'),
          description: t('features.assetManagementDes'),
          icon: '/static/feature/resources.svg'
        },
        {
          title: t('ldPage.poi'),
          description: t('ldPage.poiSub'),
          icon: '/static/icons/pinpoi.svg'
        },
        {
          title: t('ldPage.delivery'),
          description: t('ldPage.deliverySub'),
          icon: '/static/icons/delivery-truck.svg'
        }
      ]
    },
    {
      title: t('features.dispatchDashboard'),
      to: 'analytics',
      items: [
        {
          title: t('features.apiAccess'),
          description: t('features.apiAccessDes'),
          icon: '/static/feature/api.svg'
        },
        {
          title: t('features.customfieldTemplates'),
          description: t('features.customfieldTemplatesDes'),
          icon: '/static/icons/website.svg'
        },
        {
          title: t('features.logistics'),
          description: t('features.logisticsDes'),
          icon: '/static/feature/delivery-man.svg'
        }
      ]
    },
    {
      title: t('features.serviceApp'),
      to: 'service-app',
      items: [
        {
          title: t('features.taskNotification'),
          description: t('features.taskNotificationDes'),
          icon: '/static/feature/notification.svg'
        },
        {
          title: t('features.serviceApp'),
          description: t('features.serviceApp'),
          icon: '/static/feature/ic_description.png'
        },
        {
          title: t('features.optimizedRoutes'),
          description: t('features.optimizedRoutesDes'),
          icon: '/static/feature/route.svg'
        },
        {
          title: t('features.proofOfDelivery'),
          description: t('features.proofOfDeliveryDes'),
          icon: '/static/feature/packing-list.svg'
        },
        {
          title: t('features.easyNavigation'),
          description: t('features.easyNavigationDes'),
          icon: '/static/feature/monitoring.svg'
        },
        {
          title: t('features.agentCapacityManagement'),
          description: t('features.agentCapacityManagementDes'),
          icon: '/static/feature/agent-management.svg'
        }
      ]
    },
    {
      title: t('features.tracker'),
      to: 'tracker',
      items: [
        {
          title: t('features.geofencing'),
          description: t('features.geofencingDes'),
          icon: '/static/feature/tracking-app.svg'
        }
      ]
    },
    {
      title: 'Hosting',
      to: 'web-hosting',
      items: [
        {
          title: 'Tùy chọn tên miền',
          description: 'Bạn có thể sử dụng tên miền của riêng bạn cho trang web.',
          icon: '/static/feature/ic_domain.png'
        },
        {
          title: '99.99998% Uptime',
          description:
            'Đảm bảo doanh nghiệp của bạn phải luôn hoạt động, ngay cả khi bạn đang ngủ.',
          icon: '/static/feature/ic_worktime.png'
        },
        {
          title: 'Chứng chỉ SSL',
          description:
            'Trang web của bạn sẽ có chứng chỉ SSL để giữ an toàn cho thông tin khách hàng và dữ liệu kinh doanh của bạn.',
          icon: '/static/feature/ic_ssl.png'
        },
        {
          title: 'Cập nhật lập tức',
          description:
            'Tất cả các thay đổi của bạn đều tự động, vì vậy bạn sẽ nhận được các tính năng mới nhất ngay lập tức mà không gặp bất kỳ rắc rối nào.',
          icon: '/static/feature/ic_upgrade.png'
        }
      ]
    },
    {
      title: 'Hỗ trợ',
      to: 'support',
      items: [
        {
          title: 'Đội ngũ hỗ trợ tận tâm',
          icon: '/static/feature/ic_support.png',
          description:
            'Nhóm hỗ trợ Trade Zone Map làm việc 24/7, hoặc bạn có thể gửi thông tin qua email, trò chuyện trực tiếp và điện thoại để đảm bảo luôn giải quyết các vấn đề cho bạn.'
        }
      ]
    }
  ];
  return (
    <RootStyle title="Tất cả tính năng | TZM" id="move_top">
      <FeatureHero />
      <ScrollToTop />

      <ContentStyle>
        <Container maxWidth="lg" sx={{ paddingY: 8 }}>
          <Stack direction="row" spacing={4}>
            <MHidden width="mdDown">
              <Box width="25%">
                <StickyNavigation>
                  <List component="nav" aria-label="secondary mailbox folder">
                    {navigation.map((nav, idx) => (
                      <NavHashLink
                        scroll={(el) => scrollWithOffset(el)}
                        key={nav.title}
                        style={{ textDecoration: 'none' }}
                        smooth
                        to={`/features#${nav.to}`}
                      >
                        <ListItemStyle>
                          <ListItemButton
                            classes={{ selected: classes.selected }}
                            selected={currentInviewIdx === idx}
                          >
                            {nav.title}
                          </ListItemButton>
                        </ListItemStyle>
                      </NavHashLink>
                    ))}
                  </List>
                </StickyNavigation>
              </Box>
            </MHidden>
            <Box flex={1}>
              <List sx={{ position: 'relative' }}>
                <Stack spacing={4}>
                  {navigation.map((nav, index) => (
                    <InView
                      threshold={0.5}
                      onChange={(inview) => {
                        if (inview) {
                          setCurrentInviewIdx(index);
                        }
                      }}
                      key={`features-${nav.title}`}
                    >
                      <Box id={nav.to}>
                        <Typography variant="h3" sx={{ mb: 4 }}>
                          {nav.title}
                        </Typography>

                        <Grid container spacing={6} sx={{ paddingLeft: [0, 0, 2] }}>
                          {nav.items?.map((feat, index) => (
                            <Grid
                              alignSelf="stretch"
                              key={`features-item-${nav.title}-${index}`}
                              item
                              xs={12}
                              md={6}
                            >
                              <FeatureCard feature={feat} />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </InView>
                  ))}
                </Stack>
              </List>
            </Box>
          </Stack>
        </Container>
        <LandingAdvertisement />
      </ContentStyle>
    </RootStyle>
  );
};

export default FeaturesPage;
