import { Icon } from '@iconify/react';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
// npm install --save-dev @iconify/react @iconify-icons/logos
import youtubeFilled from '@iconify/icons-ant-design/youtube-filled';

import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
// material
import { alpha, styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Grid,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  IconButton
} from '@material-ui/core';
// utils
import { fShortenNumber } from 'utils/formatNumber';
import SvgIconStyle from 'components/SvgIconStyle';
import { AttrProps } from 'models/dto/attrProps';
import { useAppSelector } from 'app/hooks';
import { selectAttrProps } from '../templateSlice';
// @types
//

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
  paddingTop: 'calc(100% * 9 / 16)',
  '&:before': {
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '0',
    position: 'absolute',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)', // Fix on Mobile
    borderTopLeftRadius: theme.shape.borderRadiusMd,
    borderTopRightRadius: theme.shape.borderRadiusMd,
    backgroundColor: alpha(theme.palette.primary.darker, 0.72)
  }
}));

const CoverImgStyle = styled('img')(({ theme }) => ({
  top: 0,
  zIndex: 8,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
}));

// ----------------------------------------------------------------------

export default function Template1() {
  const attrs: AttrProps = useAppSelector(selectAttrProps);
  return (
    <Card>
      <CardMediaStyle>
        <Avatar
          style={{ bottom: '-10px' }}
          alt={'error'}
          src={attrs.logoImage}
          sx={{
            width: 170,
            height: 170,
            zIndex: 11,
            position: 'absolute',
            transform: 'translateY(-50%)'
          }}
        />
        <CoverImgStyle alt="cover" src={attrs.backgroundImage} />
      </CardMediaStyle>

      <Typography variant="subtitle1" align="center" sx={{ mt: 6 }}>
        {attrs.title}
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
        {attrs.address}
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
        {attrs.website}
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
        {attrs.gmail}
      </Typography>

      <Box sx={{ textAlign: 'center', mt: 2, mb: 2.5 }}>
        <Tooltip key="Facebook" title="Facebook">
          <a href={attrs.facebook} target="_blank" rel="noopener noreferrer">
            <IconButton>
              <Icon icon={facebookFill} width={20} height={20} color="#1877F2" />
            </IconButton>
          </a>
        </Tooltip>
        <Tooltip key="Instagram" title="Instagram">
          <a href={attrs.instagram} target="_blank" rel="noopener noreferrer">
            <IconButton>
              <Icon icon={instagramFilled} width={20} height={20} color="#1877F2" />
            </IconButton>
          </a>
        </Tooltip>
        <Tooltip key="Youtube" title="Youtube">
          <a href={attrs.youtube} target="_blank" rel="noopener noreferrer">
            <IconButton>
              <Icon icon={youtubeFilled} width={20} height={20} color="red" />
            </IconButton>
          </a>
        </Tooltip>
      </Box>

      <Divider />

      {/* <Grid container sx={{ py: 3 }}>
        {InfoItem(follower)}
        {InfoItem(following)}
        {InfoItem(totalPost)}
      </Grid> */}
    </Card>
  );
}
