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
    
  let srcNotHover = "/static/enterprise/noti.jpg";
  let srcHoverForm = "/static/enterprise/control.jpg";
  let srcHoverApp = "/static/enterprise/commu.jpg";
  let srcHoverManage = "/static/enterprise/proof.jpg";
  
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

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <Container maxWidth="lg">
          <MotionInView variants={varFadeInLeft}>
            <Stack direction={{ xs: 'column-reverse', md: 'row' }} spacing={4}>
              <Stack spacing={6} sx={{ flex: 1 }}>
                <Typography variant="h3">Khả năng mở rộng & Hiệu suất</Typography>
                <Typography variant="h6">
                    1. Thông báo trong ứng dụng
                    <Typography variant="body1">
                    Đơn hàng do khách hàng đặt sẽ được kiểm tra đối chiếu với hàng trong 
                    kho của tất cả tài xế và sau đó thông báo được gửi đến tài xế có đủ hàng.
                    </Typography>              
                  </Typography>
                  
                  <Typography variant="h6" onMouseEnter={mouseEnterForm} onMouseLeave={mouseLeaveForm}>
                    2. Theo dõi nhiệm vụ
                    <Typography variant="body1">
                    Khách hàng nhận được liên kết theo dõi SMS & theo dõi ứng dụng Để theo dõi tài xế và thời gian đến dự kiến.
                    </Typography>              
                  </Typography>

                  <Typography variant="h6" onMouseEnter={mouseEnterApp} onMouseLeave={mouseLeaveApp}>
                    3. Giao tiếp trong ứng dụng
                    <Typography variant="body1">
                    Cho phép khách hàng trò chuyện trực tiếp với đại lý được chỉ định của họ từ ứng dụng và tránh sự chậm trễ không mong muốn.
                    </Typography>              
                  </Typography>

                  <Typography variant="h6" onMouseEnter={mouseEnterManage} onMouseLeave={mouseLeaveManage}>
                    4. Bằng chứng giao hàng
                    <Typography variant="body1">
                    Cho phép các đại lý của bạn quét mã vạch, thêm ghi chú, hình ảnh và thu thập chữ ký điện tử.
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
        </Container>
      </RootStyle>
    </>
  );
}
