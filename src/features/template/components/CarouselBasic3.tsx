import faker from 'faker';
import Slider from 'react-slick';
import { useRef } from 'react';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
// utils
import { mockImgFeed } from 'utils/mockImages';
import CarouselControlsArrowsBasic2 from './CarouselControlsArrowsBasic2';
import CarouselControlsPaging2 from './CarouselControlsPaging2';
import Template1 from './Template1';
import Template2 from './Template2';
import Template3 from './Template3';
import { makeStyles } from '@material-ui/styles';
//

// ----------------------------------------------------------------------
const useStyles = makeStyles((theme) => ({
  divPreview: {
    height: '40vh'
  }
}));
const CAROUSELS = [...Array(5)].map((_, index) => {
  const setIndex = index + 1;
  return {
    title: faker.name.title(),
    description: faker.lorem.paragraphs(),
    image: mockImgFeed(setIndex)
  };
});

const RootStyle = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .slick-list': {
    boxShadow: theme.customShadows.z16,
    borderRadius: theme.shape.borderRadiusMd
  }
}));
export interface CarouselBasic3Props {
  onChange: (index: number) => void;
}
export default function CarouselBasic3({ onChange }: CarouselBasic3Props) {
  const theme = useTheme();
  const carouselRef = useRef<Slider | null>(null);
  const classes = useStyles();
  const settings = {
    speed: 500,
    dots: true,
    arrows: false,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => onChange(current + 1),
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselControlsPaging2({
      sx: { mt: 3 }
    })
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <RootStyle>
      <Slider ref={carouselRef} {...settings}>
        <Box className={classes.divPreview}>
          <Template1 />
        </Box>
        <Box className={classes.divPreview}>
          <Template2 index={1} />
        </Box>
        <Box className={classes.divPreview}>
          <Template3 />
        </Box>
      </Slider>
      <CarouselControlsArrowsBasic2 onNext={handleNext} onPrevious={handlePrevious} />
    </RootStyle>
  );
}
