import { Card, Col, Row, Space } from "antd";
import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";

import "./index.css";
type ItemType = {
  title: string;
  description: string;
  dateString: string;
  id: string;
  selected: boolean;
};

type ItemSelectorProps = {
  items: ItemType[];
  onChange: (items: ItemType[]) => void;
};

const ItemSelector = ({ items, onChange }: ItemSelectorProps) => {
  const [selected, setSelected] = React.useState<ItemType[]>(items);

  React.useEffect(() => {
    onChange(selected);
  }, [selected]);

  const toggleSelect = (item: ItemType) => {
    // Change the flag of the item
    let newItems = items.map((i) => {
      if (i.id === item.id) {
        return {
          ...i,
          selected: !i.selected,
        };
      }
      return i;
    });

    // Update the state
    setSelected(newItems);
  };

  return (
    <Space direction="vertical" style={{ width: "100%", margin: "16px 0px" }}>
      {selected.map((item, idx) => {
        return (
          <Card
            className={
              item.selected
                ? "item-selector-card item-selector-card-selected"
                : "item-selector-card"
            }
            hoverable
            key={idx}
            onClick={() => {
              toggleSelect(item);
            }}
          >
            <Row justify="center" align="middle">
              <Col flex="auto">
                <div className="title">{item.title}</div>
                <div className="description">{item.description}</div>
                <div className="dateString">{item.dateString}</div>
              </Col>
              <Col style={{ marginLeft: "auto" }}>
                <CheckCircleOutlined
                  style={{
                    fontSize: "24px",
                  }}
                />
              </Col>
            </Row>
          </Card>
        );
      })}
    </Space>
  );
};

export default ItemSelector;
