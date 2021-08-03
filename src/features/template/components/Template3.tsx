import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import { Icon } from '@iconify/react';
import { Box, Card, IconButton, Typography } from '@material-ui/core';
import { useAppSelector } from 'app/hooks';
import { AttrProps } from 'models/dto/attrProps';
import * as React from 'react';
import { selectAttrProps } from '../templateSlice';

export default function Template3() {
  const attrs: AttrProps = useAppSelector(selectAttrProps);
  const name = 'test';
  const position = 'sdsdsd';
  const follower = 10;
  const totalPost = 10;
  const following = 10;
  const avatarUrl =
    'https://media-cdn.laodong.vn/storage/newsportal/2021/3/8/886874/Nghe-Si-Han-Quoc-IU.jpg';
  const cover =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSztg33o2n7_-zhuHyB0qt7e7um3R45HbJBQmc9AgHz0fodgiH8ueOLj0W9zRbUN3Yxcss&usqp=CAU';
  return (
    <Card key={name} sx={{ p: 1, mx: 1.5 }}>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5 }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        {position}
      </Typography>
      <Box component="img" src={avatarUrl} sx={{ width: '100%', borderRadius: 1.5 }} />
      <Box sx={{ mt: 2, mb: 1 }}>
        {[facebookFill, instagramFilled, linkedinFill, twitterFill].map((social, index) => (
          <IconButton key={index}>
            <Icon icon={social} width={20} height={20} />
          </IconButton>
        ))}
      </Box>
    </Card>
  );
}
