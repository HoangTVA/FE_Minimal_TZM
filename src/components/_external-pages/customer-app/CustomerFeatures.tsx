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
    width: 300,
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
    boxShadow: `-20px 20px 20px 10px ${shadowCard(0.2)}`,
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
    boxShadow: `20px 20px 20px 10px ${shadowCard(0.2)}`,
  };
});

export default function EnterpriseFeatures() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  let srcNotHover = "/static/customer-app/1.webp";
  let src1 = "/static/customer-app/1.webp";
  let src2 = "/static/customer-app/2.webp";
  let src3 = "/static/customer-app/3.webp";
  let src4 = "/static/customer-app/4.webp";
  let src5 = "/static/customer-app/5.webp";
  let src6 = "/static/customer-app/6.webp";
  let src7 = "/static/customer-app/7.webp";
  let src8 = "/static/customer-app/8.webp";
  
  let [src, setSrc] = useState(
    src1 && src2 && src3 && src4 && src5 && src6 && src7 && src8 );
  
  const mouseEnter1 = () => {
    setSrc(src1);
  }
  const mouseLeave1 = () => {
    setSrc(srcNotHover);
  }

  
  const mouseEnter2 = () => {
    setSrc(src2);
  }
  const mouseLeave2 = () => {
    setSrc(srcNotHover);
  }

  
  const mouseEnter3 = () => {
    setSrc(src3);
  }
  
  const mouseLeave3 = () => {
    setSrc(srcNotHover);
  }
  
  const mouseEnter4 = () => {
    setSrc(src4);
  }
  
  const mouseLeave4 = () => {
    setSrc(srcNotHover);
  }
  
  const mouseEnter5 = () => {
    setSrc(src5);
  }
  
  const mouseLeave5 = () => {
    setSrc(srcNotHover);
  }
  
  const mouseEnter6 = () => {
    setSrc(src6);
  }
  
  const mouseLeave6 = () => {
    setSrc(srcNotHover);
  }
  
  const mouseEnter7 = () => {
    setSrc(src7);
  }
  
  const mouseLeave7 = () => {
    setSrc(srcNotHover);
  }
  
  const mouseEnter8 = () => {
    setSrc(src8);
  }
  const mouseLeave8 = () => {
    setSrc(srcNotHover);
  }

  return (
    <>
      <RootStyle initial="initial" animate="animate" variants={varWrapEnter}>
        <Container maxWidth="lg">
          <Stack spacing={[8, 12]}>
            <MotionInView variants={varFadeInUp} sx={{ mb: { xs: 10, md: 15 }, textAlign: 'center' }}>
                <Typography variant="h3">
                Ứng dụng khách hàng TZM sẽ giúp ích gì cho doanh nghiệp của bạn?              
                </Typography>
            </MotionInView>
            <MotionInView variants={varFadeInLeft}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={12}>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  <CardShadowLeft>  
                    <Typography variant="h6"  onMouseEnter={mouseEnter1} onMouseLeave={mouseLeave1}>
                      Hoàn toàn có thể tùy chỉnh
                      <Typography variant="body1">
                      Thiết kế quy trình theo Trường hợp sử dụng kinh doanh của bạn.                    
                      </Typography>              
                    </Typography>
                  </CardShadowLeft>
                  <CardShadowLeft>  
                  <Typography variant="h6" onMouseEnter={mouseEnter2} onMouseLeave={mouseLeave2}>
                    Định giá dựa trên hàng rào địa lý
                    <Typography variant="body1">
                    
                    Sử dụng định giá dựa trên thẻ và khu vực cho nhu cầu bản địa hóa
                    </Typography>              
                  </Typography>
                  </CardShadowLeft>  
                  <CardShadowLeft>  
                  <Typography variant="h6" onMouseEnter={mouseEnter3} onMouseLeave={mouseLeave3}>
                    Sự liên lạc khẩn cấp
                    <Typography variant="body1">
                    
                    Khách hàng có thể gọi điện hoặc trò chuyện với đại lý 
                    bằng ứng dụng chỉ với một cú nhấp chuột                    
                    </Typography>              
                  </Typography>
                  </CardShadowLeft>  
                  <CardShadowLeft>  
                  <Typography variant="h6" onMouseEnter={mouseEnter4} onMouseLeave={mouseLeave4}>
                    Hiệu suất và Xếp hạng
                    <Typography variant="body1">
                    
                    Nhận phản hồi và xếp hạng dễ dàng từ khách hàng 
                    để lập kế hoạch hành động trong tương lai
                    </Typography>              
                  </Typography>
                  </CardShadowLeft>  
                </Stack>
                <Box>
                  <HeroImgStyle
                  sx={{ 
                    position: 'relative',
                    top: 70
                    
                  }} 
                  alt="feature-1" 
                  src={src}
                  />
                </Box>
                <Stack spacing={6} sx={{ flex: 1 }}>
                  <CardShadowRight> 
                    <Typography variant="h6" onMouseEnter={mouseEnter5} onMouseLeave={mouseLeave5}>
                      Thông báo và Cảnh báo
                      <Typography variant="body1" >         
                      Cập nhật trạng thái đơn hàng trực tiếp cho khách hàng để nâng cao trải nghiệm
                      </Typography>              
                    </Typography>
                  </CardShadowRight> 
                  
                  <CardShadowRight> 
                    <Typography variant="h6" onMouseEnter={mouseEnter6} onMouseLeave={mouseLeave6}>
                      Theo dõi thời gian thực
                      <Typography variant="body1">
                      Theo dõi vị trí chính xác trên bản đồ và giao hàng ETA

                      </Typography>              
                    </Typography>
                  </CardShadowRight> 
                  
                  <CardShadowRight> 
                    <Typography variant="h6" onMouseEnter={mouseEnter7} onMouseLeave={mouseLeave7}>
                      Ví khách hàng tích hợp sẵn
                      <Typography variant="body1">
                      Cung cấp cho khách hàng sự linh hoạt khi nạp tiền một lần
                      </Typography>              
                    </Typography>
                  </CardShadowRight> 

                  <CardShadowRight> 
                    <Typography variant="h6" onMouseEnter={mouseEnter8} onMouseLeave={mouseLeave8}>
                      Khuyến mãi và ưu đãi
                      <Typography variant="body1">
                      Đẩy giảm giá và khuyến mại cho khách hàng bằng cách sử dụng mã phiếu giảm giá và thông báo
                      </Typography>              
                    </Typography>
                  </CardShadowRight> 
                </Stack>
              </Stack>
            </MotionInView>
          </Stack>
        </Container>
      </RootStyle>
    </>
  );
}
