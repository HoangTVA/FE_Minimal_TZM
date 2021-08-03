import { Icon } from '@iconify/react';
import { paramCase } from 'change-case';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { Link as RouterLink } from 'react-router-dom';
import shareFill from '@iconify/icons-eva/share-fill';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Card, Grid, Avatar, Typography, CardContent } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from 'routes/paths';
// utils
import { fDate } from 'utils/formatTime';
import { fShortenNumber } from 'utils/formatNumber';
// @types
import SvgIconStyle from 'components/SvgIconStyle';
import { AttrProps } from 'models';
import { useAppSelector } from 'app/hooks';
import { selectAttrProps } from '../templateSlice';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
}));

const TitleStyle = styled(RouterLink)(({ theme }) => ({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline'
  }
}));

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2)
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled
}));

const CoverImgStyle = styled('img')(({ theme }) => ({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
}));

// ----------------------------------------------------------------------

type Template2Props = {
  index: number;
};

export default function Template2({ index }: Template2Props) {
  const attrs: AttrProps = useAppSelector(selectAttrProps);
  const title = 'test';
  const view = 'sdsdsd';
  const author = 'sdsdsd';
  const date = 'sdsdsd';
  const comment = 10;
  const share = 10;
  const following = 10;
  const avatarUrl =
    'https://media-cdn.laodong.vn/storage/newsportal/2021/3/8/886874/Nghe-Si-Han-Quoc-IU.jpg';
  const cover =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSztg33o2n7_-zhuHyB0qt7e7um3R45HbJBQmc9AgHz0fodgiH8ueOLj0W9zRbUN3Yxcss&usqp=CAU';
  const linkTo = `${PATH_DASHBOARD.root}/post/${paramCase(title)}`;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;

  const POST_INFO = [
    { number: comment, icon: messageCircleFill },
    { number: view, icon: eyeFill },
    { number: share, icon: shareFill }
  ];

  return (
    <Card sx={{ position: 'relative' }}>
      <CardMediaStyle
        sx={{
          ...((latestPostLarge || latestPost) && {
            pt: 'calc(100% * 4 / 3)',
            '&:after': {
              top: 0,
              content: "''",
              width: '100%',
              height: '100%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          }),
          ...(latestPostLarge && {
            pt: {
              xs: 'calc(100% * 4 / 3)',
              sm: 'calc(100% * 3 / 4.66)'
            }
          })
        }}
      >
        <SvgIconStyle
          color="paper"
          src="/static/icons/shape-avatar.svg"
          sx={{
            width: 80,
            height: 36,
            zIndex: 9,
            bottom: -15,
            position: 'absolute',
            ...((latestPostLarge || latestPost) && { display: 'none' })
          }}
        />
        <AvatarStyle
          alt={author}
          src={avatarUrl}
          sx={{
            ...((latestPostLarge || latestPost) && {
              zIndex: 9,
              top: 24,
              left: 24,
              width: 40,
              height: 40
            })
          }}
        />

        <CoverImgStyle alt={title} src={cover} />
      </CardMediaStyle>

      <CardContent
        sx={{
          pt: 4,
          ...((latestPostLarge || latestPost) && {
            bottom: 0,
            width: '100%',
            position: 'absolute'
          })
        }}
      >
        <Typography
          gutterBottom
          variant="caption"
          sx={{ color: 'text.disabled', display: 'block' }}
        >
          {date}
        </Typography>

        <TitleStyle
          to={linkTo}
          // color="inherit"
          // variant="subtitle2"
          // component={RouterLink}
          sx={{
            color: 'inherit',
            typography: 'subtitle2',
            ...(latestPostLarge && { typography: 'h5', height: 60 }),
            ...((latestPostLarge || latestPost) && {
              color: 'common.white'
            })
          }}
        >
          {title}
        </TitleStyle>

        <InfoStyle>
          {POST_INFO.map((info, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: index === 0 ? 0 : 1.5,
                ...((latestPostLarge || latestPost) && {
                  color: 'grey.500'
                })
              }}
            >
              <Box component={Icon} icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />
              <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
            </Box>
          ))}
        </InfoStyle>
      </CardContent>
    </Card>
  );
}
