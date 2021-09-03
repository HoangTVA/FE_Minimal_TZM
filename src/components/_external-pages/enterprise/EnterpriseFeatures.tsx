import { alpha, Container, Stack, Typography, useMediaQuery, Box } from '@material-ui/core';
import { styled, useTheme } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
//
import { MotionInView, varFadeInLeft, varFadeInRight, varWrapEnter } from '../../animate';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const RootStyle = styled(motion.div)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10)
}));

const FeatureContainerStyle = styled(Stack)(({ theme }) => ({
  //   flexDirection: styleProps.reverse ? 'row-reverse' : 'row',
  flexDirection: 'row',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column-reverse'
  }
}));

const HeroImgStyle = styled(motion.img)(({ theme }) => {
  const shadowCard = (opacity: number) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity);

  return {
    borderRadius: '8px',
    height: '35vh',
    marginTop: 0,
    objectFit: 'cover',
    width: 'auto',
    boxShadow: `0px 40px 80px 0 ${shadowCard(0.4)}`,
    [theme.breakpoints.up('lg')]: {
      height: '40vh',
      width: 540,
      backgroundColor: theme.palette.background.paper
    }
  };
});

export default function EnterpriseFeatures() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <Container maxWidth="lg">
          <Stack spacing={[8, 12]}>
            <MotionInView variants={varFadeInLeft}>
              <Stack direction={{ xs: 'column-reverse', md: 'row' }} spacing={4}>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  <Typography variant="h3">Tích hợp với Hệ thống POS yêu thích của bạn.</Typography>
                  <Typography variant="body1">
                    Tăng doanh số bán hàng của bạn bằng cách kết nối bất kỳ hệ thống POS nào với tất
                    cả các cửa hàng của bạn và mang đến cho khách hàng trải nghiệm tốt nhất có thể.
                  </Typography>
                </Stack>
                <Box>
                  <HeroImgStyle alt="feature-1" src="/static/enterprise/pos.jpg" />
                </Box>
              </Stack>
            </MotionInView>
            <MotionInView variants={varFadeInRight}>
              <Stack direction={{ xs: 'column-reverse', md: 'row-reverse' }} spacing={4}>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  <Typography variant="h3">
                    Tùy chỉnh thiết kế & phát triển cho Trang web & Ứng dụng của bạn.
                  </Typography>
                  <Typography variant="body1">
                    Đem những ý tưởng của bạn tạo thành nền tảng đặt hàng tốt nhất với các nhà thiết
                    kế và phát triển của chúng tôi và đảm bảo xây dựng những thứ bạn cần.
                  </Typography>
                </Stack>
                <Box>
                  <HeroImgStyle alt="feature-1" src="/static/enterprise/custom.jpg" />
                </Box>
              </Stack>
            </MotionInView>
          </Stack>
        </Container>
      </RootStyle>
    </>
  );
}
