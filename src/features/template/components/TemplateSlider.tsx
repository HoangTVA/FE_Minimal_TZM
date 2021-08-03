import * as React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface TemplateSliderProps {}

export default function TemplateSlider(props: TemplateSliderProps) {
  const [current, setCurrent] = React.useState(1);
  const [last, setLast] = React.useState(1);
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setLast(next),
    afterChange: (current) => setCurrent(current)
  };
  return (
    <>
      <p>
        BeforeC: <strong>{last}</strong>
      </p>
      <p>
        AfterCh: <strong>{current}</strong>
      </p>
      <Slider {...settings} lazyLoad="ondemand">
        <div>
          <img src="https://dulich.petrotimes.vn/stores/news_dataimages/phamlinh/072021/23/12/0409_iu-dep-het-phan-thien-ha-1625544870260780111548.jpg?rt=20210723120412" />
        </div>
        <div>
          <img src="https://dulich.petrotimes.vn/stores/news_dataimages/phamlinh/072021/23/12/0409_iu-dep-het-phan-thien-ha-1625544870260780111548.jpg?rt=20210723120412" />
        </div>
        <div>
          <img src="https://dulich.petrotimes.vn/stores/news_dataimages/phamlinh/072021/23/12/0409_iu-dep-het-phan-thien-ha-1625544870260780111548.jpg?rt=20210723120412" />
        </div>
        <div>
          <img src="https://dulich.petrotimes.vn/stores/news_dataimages/phamlinh/072021/23/12/0409_iu-dep-het-phan-thien-ha-1625544870260780111548.jpg?rt=20210723120412" />
        </div>
        <div>
          <img src="https://dulich.petrotimes.vn/stores/news_dataimages/phamlinh/072021/23/12/0409_iu-dep-het-phan-thien-ha-1625544870260780111548.jpg?rt=20210723120412" />
        </div>
        <div>
          <img src="https://dulich.petrotimes.vn/stores/news_dataimages/phamlinh/072021/23/12/0409_iu-dep-het-phan-thien-ha-1625544870260780111548.jpg?rt=20210723120412" />
        </div>
      </Slider>
    </>
  );
}
