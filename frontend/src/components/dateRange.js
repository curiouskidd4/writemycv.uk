import { Checkbox, Col, DatePicker, Row, Typography } from "antd";
import { useEffect, useState } from "react";

const CustomDateRange = ({ value, onChange, checkBoxText, ...rest }) => {
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  useEffect(() => {
    if (currentlyWorking) {
      if (!value){
        
      }
      else{
        onChange([value[0], null]);

      }
    }
  }, [currentlyWorking]);

  const CurrentCheckbox = () => {
    return (
      <Checkbox
        checked={currentlyWorking}
        onChange={(e) => {
          setCurrentlyWorking(e.target.checked);
        }}
      >
        <Typography.Text type="secondary"> {checkBoxText}</Typography.Text>
      </Checkbox>
    );
  };
  return (
    <Row gutter={[12, 12]}>
      <Col>
        <DatePicker.RangePicker
          value={value}
          onChange={onChange}
          {...rest}
          renderExtraFooter={() => <CurrentCheckbox />}
          disabled={[false, currentlyWorking]}
        />
      </Col>
      <Col>
        <CurrentCheckbox />
      </Col>
    </Row>
  );
};

export default CustomDateRange;
