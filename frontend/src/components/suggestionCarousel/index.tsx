import { Button, Col, Row, Space, Typography } from "antd";
import React from "react";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined, CheckOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CheckIcon } from "../faIcons";
import { useSpring, animated } from 'react-spring';

import "./index.css";
const CustomCarousel = ({
  suggestions,
  onClick,
}: {
  suggestions: string[];
  onClick?: (value: string) => void;
}) => {
  console.log(suggestions);
  const ref = React.useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = React.useState<number>(0);
  const scroll = useSpring({
    transform: `translateX(-${currentSlide * 100}%)`,
    config: { tension: 200, friction: 20 },
  });

  const onSelect = () => {
    onClick && onClick(suggestions[currentSlide]);
  };
  return (
    <Space
      size="small"
      direction="vertical"
      style={{
        width: "100%",
        // width: "700px",
      }}
    >
      <Row align="middle">
        <Col span={16}>
          <Typography.Text type="secondary">
            Select any of the following suggestions
          </Typography.Text>
        </Col>
        <Col
          style={{
            marginLeft: "auto",
          }}
        >
          <Space>
            <Button
              type="link"
              onClick={() => {
                // ref.current?.slickPrev();

                if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
              }}
            >
              <LeftOutlined />
            </Button>
            {currentSlide + 1} / {suggestions.length}
            <Button
              type="link"
              onClick={() => {
                // ref.current?.slickNext();
                if (currentSlide < suggestions.length - 1)
                  setCurrentSlide(currentSlide + 1);
              }}
            >
              <RightOutlined />
            </Button>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div>
            {/* <Slider
            // variableWidth={true}
            ref={ref}
            infinite={false}
            afterChange={(current) => {
              setCurrentSlide(current);
            }}
            arrows={false}
            dots={false}
            // variableWidth={true}
            slidesToShow={1}
          >
            {suggestions.map((suggestion, idx) => {
              return (
                <div key={idx}>
                  <div
                    style={{
                      padding: "12px",
                      border: "1px solid #e8e8e8",
                      borderRadius: "4px",
                      width: "100%",
                    }}
                  >
                    {suggestion}
                  </div>
                </div>
              );
            })}
          </Slider> */}
          </div>
          <div className="corousel-selector">
          <animated.div className="carousel-inner" style={scroll}>

            {suggestions.map((suggestion, idx) => {
              return (
                <div
                  key={idx}
                  className={
                    idx === currentSlide
                      ? "corousel-selector-item corousel-selector-item-selected"
                      : "corousel-selector-item corousel-selector-item-hidden" 
                  }
                  // style={{
                  //   left : `${(idx - currentSlide) * 100}%`

                  // }}
                  onClick={() => {
                    // ref.current?.slickGoTo(idx);
                    if (onClick){
                      onClick(suggestion)
                    }
                  }}
                >
                    <div
                      style={{
                        padding: "12px",
                        border: "1px solid #e8e8e8",
                        borderRadius: "4px",
                        width: "100%",
                      }}
                    >
                      {suggestion}
                    </div>
                </div>
              );
            })}
            </animated.div>
          </div>

        </Col>
      </Row>
      <Row>
        <Button onClick={onSelect}>
          <CheckIcon /> Select this
        </Button>
      </Row>
    </Space>
  );
};

export default CustomCarousel;
