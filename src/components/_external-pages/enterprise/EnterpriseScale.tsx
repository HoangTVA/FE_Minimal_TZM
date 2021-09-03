import { alpha, Container, Stack, Typography, useMediaQuery, Box, Grid } from '@material-ui/core';
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

export default function EnterpriseScale() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <Container maxWidth="lg">
          <MotionInView variants={varFadeInLeft}>
            <Stack direction={{ xs: 'column-reverse', md: 'row' }} spacing={4}>
              <Stack spacing={6} sx={{ flex: 1 }}>
                <Typography variant="h3">Khả năng mở rộng & Hiệu suất</Typography>
                <Box>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h5" sx={{ mb: 4 }}>
                        Amazon Web Services
                      </Typography>
                      <Typography>
                        Lưu lượng, dữ liệu và băng thông luôn được kiểm soát với sức mạnh và bảo mật
                        của máy chủ AWS. Đảm bảo thời gian hoạt động máy chủ đến 99,998%
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
              <Box>
                <HeroImgStyle alt="feature-1" src="/static/enterprise/happy_working.jpg" />
              </Box>
            </Stack>
          </MotionInView>
        </Container>
      </RootStyle>
    </>
  );
}
