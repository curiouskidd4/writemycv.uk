import { Button, Col, Row, Space, Typography } from "antd";
import React from "react";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined, CheckOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CheckIcon } from "../faIcons";
import { useSpring, animated } from "react-spring";

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
      <Row align="middle" justify="center">
          <Button
            type="link"
            className="small-link-btn"
            style={{
              padding: "2px 4px",
              color: "black"
            }}
            onClick={() => {

              if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
            }}
          >
            <LeftOutlined />
          </Button>
          <>{currentSlide + 1} / {suggestions.length}</>
          <Button
           style={{
            padding: "2px 4px",
            color: "black"

          }}
            type="link"
            className="small-link-btn"

            onClick={() => {
              if (currentSlide < suggestions.length - 1)
                setCurrentSlide(currentSlide + 1);
            }}
          >
            <RightOutlined />
          </Button>
      </Row>
      <Row>

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
                      if (onClick) {
                        onClick(suggestion);
                      }
                    }}
                  >
                    <div
                      style={{
                        padding: "4px",
                        border: "1px solid var(--grey)",
                        borderRadius: "6px",
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
