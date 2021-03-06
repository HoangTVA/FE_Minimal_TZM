import { alpha, Container, Stack, Typography, useMediaQuery, Box, Card } from '@material-ui/core';
import { styled, useTheme } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import React, { useState, useMemo } from 'react';
//
import { MotionInView, varFadeInLeft, varFadeInUp, varWrapEnter } from '../../animate';

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
    boxShadow: `0px 100px 80px 0 ${shadowCard(0.4)}`,
    height: '',
    width: 300
  };
});

const CardShadowLeft = styled(Card)(({ theme }) => {
  const shadowCard = (opacity: number) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity);

  return {
    margin: 'auto',
    padding: theme.spacing(4, 2, 4),
    boxShadow: `-20px 20px 20px 10px ${shadowCard(0.2)}`
  };
});

const CardShadowRight = styled(Card)(({ theme }) => {
  const shadowCard = (opacity: number) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity);

  return {
    margin: 'auto',
    padding: theme.spacing(4, 2, 4),
    boxShadow: `20px 20px 20px 10px ${shadowCard(0.2)}`
  };
});

export default function EnterpriseFeatures() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [id, setId] = useState(1);

  const list = [
    {
      id: '1',
      title: 'Ho??n to??n c?? th??? t??y ch???nh',
      txt: 'Thi???t k??? quy tr??nh theo Tr?????ng h???p s??? d???ng kinh doanh c???a b???n.',
      img: '/static/customer-app/1.webp'
    },

    {
      id: '2',
      title: '?????nh gi?? d???a tr??n h??ng r??o ?????a l??',
      txt: 'S??? d???ng ?????nh gi?? d???a tr??n th??? v?? khu v???c cho nhu c???u b???n ?????a h??a.',
      img: '/static/customer-app/2.webp'
    },

    {
      id: '3',
      title: 'S??? li??n l???c kh???n c???p',
      txt: 'Kh??ch h??ng c?? th??? g???i ??i???n ho???c tr?? chuy???n v???i ?????i l?? b???ng ???ng d???ng ch??? v???i m???t c?? nh???p chu???t',
      img: '/static/customer-app/3.webp'
    },

    {
      id: '4',
      title: 'Hi???u su???t v?? X???p h???ng',
      txt: 'Nh???n ph???n h???i v?? x???p h???ng d??? d??ng t??? kh??ch h??ng ????? l???p k??? ho???ch h??nh ?????ng trong t????ng lai.',
      img: '/static/customer-app/4.webp'
    },
    
    {
      id: '5',
      title: 'Th??ng b??o v?? C???nh b??o',
      txt: 'C???p nh???t tr???ng th??i ????n h??ng tr???c ti???p cho kh??ch h??ng ????? n??ng cao tr???i nghi???m.',
      img: '/static/customer-app/5.webp'
    },

    {
      id: '6',
      title: 'Theo d??i th???i gian th???c',
      txt: 'Theo d??i v??? tr?? ch??nh x??c tr??n b???n ????? v?? giao h??ng ETA.',
      img: '/static/customer-app/6.webp'
    },

    {
      id: '7',
      title: 'V?? kh??ch h??ng t??ch h???p s???n',
      txt: 'Cung c???p cho kh??ch h??ng s??? linh ho???t khi n???p ti???n m???t l???n.',
      img: '/static/customer-app/7.webp'
    },

    {
      id: '8',
      title: 'Khuy???n m??i v?? ??u ????i',
      txt: '?????y gi???m gi?? v?? khuy???n m???i cho kh??ch h??ng b???ng c??ch s??? d???ng m?? phi???u gi???m gi?? v?? th??ng b??o.',
      img: '/static/customer-app/8.webp'
    }
  ];

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <Container maxWidth="lg">
          <Stack spacing={[8, 12]}>
            <MotionInView
              variants={varFadeInUp}
              sx={{ mb: { xs: 10, md: 15 }, textAlign: 'center' }}
            >
              <Typography variant="h3">
                ???ng d???ng kh??ch h??ng TZM s??? gi??p ??ch g?? cho doanh nghi???p c???a b???n?
              </Typography>
            </MotionInView>
            <MotionInView variants={varFadeInLeft}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={12}>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  {list.slice(0, 4).map((item) => (
                    <div onMouseOver={() => setId(parseInt(item.id))}>
                      <CardShadowLeft>
                        <Typography variant="h6">
                          {item.title}
                          <Typography variant="body1">{item.txt}</Typography>
                        </Typography>
                      </CardShadowLeft>
                    </div>
                  ))}
                </Stack>
                <Box>
                  <HeroImgStyle
                    sx={{
                      position: 'relative',
                      top: 70
                    }}
                    alt="feature"
                    src={list[id - 1].img}  
                  />
                </Box>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  {list.slice(4).map((item) => (
                    <div onMouseOver={() => setId(parseInt(item.id))}>
                      <CardShadowRight>
                        <Typography variant="h6">
                          {item.title}
                          <Typography variant="body1">{item.txt}</Typography>
                        </Typography>
                      </CardShadowRight>
                    </div>
                  ))}
                </Stack>
              </Stack>
            </MotionInView>
          </Stack>
        </Container>
      </RootStyle>
    </>
  );
}
