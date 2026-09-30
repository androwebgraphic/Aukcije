import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import watchImage from '../img/watch.jpg';
import recordImage from '../img/records.jpg'
import bubaImage from '../img/buba.jpg'
import ExampleCarouselImage from './ExampleCarouselImage';


function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item key={1}
      >
   <ExampleCarouselImage></ExampleCarouselImage>
        <Carousel.Caption>
          <h3>Stari sat</h3>
          <p>Volite li elegantni sat na  ruci na  pravom ste  mjestu</p>
       
        </Carousel.Caption>
       <img src={watchImage} alt="Watch" />


      </Carousel.Item >
      <Carousel.Item key={2}>
        <ExampleCarouselImage text="Second slide" />
        <Carousel.Caption>
          <h3>Ploče(LP)</h3>
          <p>Volite li dobru glazbu, topli zvuk vinila ovdje  možete odabrati neku od vama omiljenih grupa</p>
        </Carousel.Caption>
        <img src={recordImage} alt="records" />
      </Carousel.Item>
      <Carousel.Item key={3}>
        <ExampleCarouselImage text="Third slide" />
        <Carousel.Caption>
          <h3>Simpa autić</h3>
          <p>
            Da li u vama postoji hippie duh ako da ovo je autić za Vas
          </p>
        </Carousel.Caption>
        <img src={bubaImage} alt="buba wolkswagen" />
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;