import { Button, Row } from "antd";

type SaveButtonProps = {
  onDone: () => void;
  nextDisabled: boolean;
  showPressEnter: boolean;
    size?: "large" | "middle" | "small";
};

const SaveButton = ({
    size,
  onDone,
  nextDisabled,
  showPressEnter,
}: SaveButtonProps) => {
    size = size || "middle";
  return (
    <Row style={{ marginTop: "1rem" }}>
      <Button
        type="primary"
        size={size}
        onClick={() => onDone()}
        disabled={nextDisabled}
      >
        Next
      </Button>
      {/* {questionItem.isOptional == "optional" ? (
          <Button size="large" onClick={onDone}>
            Skip
          </Button>
        ) : null} */}

      {showPressEnter ? (
        <Button type="link" disabled={nextDisabled}>
          press Enter ↵
        </Button>
      ) : null}
    </Row>
  );
};

export default SaveButton;