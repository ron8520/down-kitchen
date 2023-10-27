import styled from 'styled-components'
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { sliderItems } from './data';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'


/*
This is the slider use to slide the recipe's step page

*/
const Container = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  position: relative;
  overflow: hidden;
  padding-top: 63px;
  
`;

const Arrow = styled.div`
  width: 50px;
  height: 50px;
  background-color: #fff7f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => props.direction === "left" && "10px"};
  right: ${(props) => props.direction === "right" && "10px"};
  margin: auto;
  cursor: pointer;
  opacity: 0.5;
  z-index: 2;
`;

const Wrapper = styled.div`
  height: 50%;
  display: flex;
  transition: all 1.5s ease;
  transform: translateX(${(props) => props.slideIndex * -100}vw);
`;

const Slide = styled.div`
  width: 100vw;
  height: 50vh;
  display: flex;
  align-items: center;
  background-color: #${(props) => props.bg};
`;

const ImageContainer = styled.div`
  height: 100%;
  flex: 1;
`;

const Image = styled.img`
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 50px;
`;

const Title = styled.h1`
  font-size: 70px;
  color: #${(props) => props.titleColor};
`;

const Desc = styled.p`
  margin: 50px 0px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 3px;
`;

const Slider = (props) => {
   const {steps} = props;
    const [slideIndex, setSlideIndex] = useState(0);
    const navigate = useNavigate();
     
    const steplength =steps.length;
    const handleClick = (direction) => {
        if (direction === "left") {
            setSlideIndex(slideIndex > 0 ? slideIndex - 1 : steplength-1);
        } else {
            setSlideIndex(slideIndex < steplength-1 ? slideIndex + 1 : 0);
        }
    };

    return (
        <Container>
            <Arrow direction="left" onClick={() => handleClick("left")}>
                <KeyboardArrowLeftOutlinedIcon />
            </Arrow>

            <Wrapper slideIndex={slideIndex}>
                {steps.map((item) => (
                    <Slide  key={item.order}>
                        <ImageContainer>
                            <Image src={item.img_url}/>
                        </ImageContainer>
                        <InfoContainer>
                            {/* <Title >{item.name}</Title> */}
                            <Typography sx={{
                              marginTop: 5,
                              marginBottom: 4,
                              marginRight:3,
                              fontSize: '1.3vw',
                              fontWeight: '400',
                              letterSpacing: '1.5px'
                            }}>{'Step '+item.order}</Typography>
                         
                        </InfoContainer>
                    </Slide>

                ))}
            </Wrapper>
            <Arrow direction="right" onClick={() => handleClick("right")}>
                <KeyboardArrowRightOutlinedIcon />
            </Arrow>
        </Container>
    )
}

export default Slider;