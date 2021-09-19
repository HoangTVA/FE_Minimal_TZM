import { alpha, Container, Stack, Typography, useMediaQuery, Box, Button } from '@material-ui/core';
import { styled, useTheme } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import React, { useState, useMemo } from 'react';
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


  //hover features of "Tạo tác vụ"
  let srcNotHover = "/static/enterprise/pos.jpg";
  let srcHoverForm = "/static/enterprise/form.jpg";
  let srcHoverApp = "/static/enterprise/app.jpg";
  let srcHoverManage = "/static/enterprise/manage.jpg";
  
  let [src, setSrc] = useState(
    srcHoverManage && srcHoverForm && srcHoverApp );
  
  const mouseEnterForm = () => {
    setSrc(srcHoverForm);
  }
  const mouseLeaveForm = () => {
    setSrc(srcNotHover);
  }

  
  const mouseEnterApp = () => {
    setSrc(srcHoverApp);
  }
  const mouseLeaveApp = () => {
    setSrc(srcNotHover);
  }

  
  const mouseEnterManage = () => {
    setSrc(srcHoverManage);
  }
  const mouseLeaveManage = () => {
    setSrc(srcNotHover);
  }

  //hover features of "Phân tích & báo cáo"
  let srcOrigin = "/static/enterprise/custom.jpg";
  let srcHover1 = "/static/enterprise/time.jpg";
  let srcHover2 = "/static/enterprise/rate.jpg";
  let srcHover3 = "/static/enterprise/finance.jpg";
  
  let [source, setSource] = useState(
    srcHover1 && srcHover2 && srcHover3 );
  
  const mouseEnter1 = () => {
    setSource(srcHover1);
  }
  const mouseLeave1 = () => {
    setSource(srcOrigin);
  }

  
  const mouseEnter2 = () => {
    setSource(srcHover2);
  }
  const mouseLeave2 = () => {
    setSource(srcOrigin);
  }

  
  const mouseEnter3 = () => {
    setSource(srcHover3);
  }
  const mouseLeave3 = () => {
    setSource(srcOrigin);
  }
 

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <Container maxWidth="lg">
          <Stack spacing={[8, 12]}>
            <MotionInView variants={varFadeInLeft}>
              <Stack direction={{ xs: 'column-reverse', md: 'row' }} spacing={4}>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  <Typography variant="h3">Tạo tác vụ</Typography>
                  <Typography variant="h6">
                    1. Bảng điều khiển - một hay nhiều tác vụ hay CSV 
                    <Typography variant="body1">
                    Tạo một hoặc nhiều tác vụ trong một lần thông qua bảng điều khiển TZM.
                    </Typography>              
                  </Typography>
                  
                  <Typography variant="h6" onMouseEnter={mouseEnterForm} onMouseLeave={mouseLeaveForm}>
                    2. Biểu mẫu
                    <Typography variant="body1">
                    Biểu mẫu TZM cho phép bạn tạo các tác vụ ngay lập tức trong bảng điều khiển 
                    bằng cách chấp nhận đơn đặt hàng từ khách hàng của bạn qua việc sử dụng biểu mẫu đặt phòng trên web.
                    </Typography>              
                  </Typography>

                  <Typography variant="h6" onMouseEnter={mouseEnterApp} onMouseLeave={mouseLeaveApp}>
                    3. Ứng dụng của khách hàng
                    <Typography variant="body1">
                    Nhận đơn đặt hàng trực tiếp của khách hàng thông qua các ứng dụng có sẵn.
                    </Typography>              
                  </Typography>

                  <Typography variant="h6" onMouseEnter={mouseEnterManage} onMouseLeave={mouseLeaveManage}>
                    4. Nền tảng quản lý đơn hàng / Thị trường / POS / API
                    <Typography variant="body1">
                    Tạo đơn đặt hàng của bạn thông qua trang web của bên thứ 3 một cách suôn sẻ và hiệu quả.
                    </Typography>              
                  </Typography>

                  <Button
                  size="large"
                  variant="contained"
                  disableElevation
                  sx={{ width: '125px', height: ['48px', '100%'] }}
                  >
                  Bắt đầu
                  </Button>
                </Stack>
                <Box>
                  <HeroImgStyle
                  sx={{ 
                    position: 'relative',
                    top: 90
                    
                  }} 
                  alt="feature-1" 
                  src={src}
                  />
                </Box>
              </Stack>
            </MotionInView>
            <MotionInView variants={varFadeInRight}>
              <Stack direction={{ xs: 'column-reverse', md: 'row-reverse' }} spacing={4}>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  <Typography variant="h3">
                  Phân tích & Báo cáo
                  </Typography>
                  
                  <Typography variant="h6">
                    1. Hiệu quả dựa trên thời gian và khoảng cách
                    <Typography variant="body1">
                    Nhận ngay báo cáo hiệu quả của các đại lý của bạn trên bảng điều khiển 
                    dựa trên Thời gian và Khoảng cách.
                    </Typography>              
                  </Typography>
                  
                  <Typography variant="h6" onMouseEnter={mouseEnter1} onMouseLeave={mouseLeave1}>
                    2. Phân tích thời gian thực
                    <Typography variant="body1">
                    Tăng hiệu quả của đại lý và sự hài lòng của khách hàng 
                    bằng cách sử dụng báo cáo thời gian thực của mọi tác vụ.
                    </Typography>              
                  </Typography>

                  <Typography variant="h6" onMouseEnter={mouseEnter2} onMouseLeave={mouseLeave2}>
                    3. Theo dõi và đánh giá người giao hàng
                    <Typography variant="body1">
                    Giám sát quá trình làm việc, vận chuyển dựa trên đánh giá thực tế của khách hàng 
                    và minh bạch hơn với khách hàng cuối.
                    </Typography>              
                  </Typography>

                  <Typography variant="h6"  onMouseEnter={mouseEnter3} onMouseLeave={mouseLeave3}>
                    4. Định giá và thu nhập
                    <Typography variant="body1">
                    Quản lý các khoản thanh toán cho tài xế một cách hiệu quả với Ví đại lý.
                    </Typography>              
                  </Typography>

                  <Button
                  size="large"
                  variant="contained"
                  disableElevation
                  sx={{ width: '125px', height: ['48px', '100%'] }}
                  >
                  Bắt đầu
                  </Button>
                </Stack>
                <Box>
                
                  <HeroImgStyle 
                  sx={{ 
                    position: 'relative',
                    top: 100
                    
                  }} 
                  alt="feature-1" src={source} />
                </Box>
              </Stack>
            </MotionInView>
          </Stack>
        </Container>
      </RootStyle>
    </>
  );
}
