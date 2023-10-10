import React from "react";
import { Card, Collapse, Typography } from "antd";

const text = (
  <p style={{ paddingLeft: 24 }}>
    A dog is a type of domesticated animal. Known for its loyalty and
    faithfulness, it can be found as a welcome guest in many households across
    the world.
  </p>
);

const FAQs = () => {
  const items = [
    {
      key: "1",
      label: <Typography.Title level={5}>This is panel header 1</Typography.Title>,
      children: text,
    },
    {
      key: "2",
      label: <Typography.Title level={5}>This is panel header 2</Typography.Title>,
      children: text,
    },
    {
      key: "3",
      label: <Typography.Title level={5}>This is panel header 3</Typography.Title>,
      children: text,
    },
  ];

  return (
    <>
      <Typography.Title level={2}>FAQs</Typography.Title>
      <Card style={{
        marginTop: "1.5rem",
      }}>
      <Collapse items={items} bordered={false} defaultActiveKey={["1"]} />
      </Card>
    </>
  );
};

export default FAQs;
