import React from "react";
import SortableComponent from "./sortableList";
import { Button, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Card = ({
  item,
  onClick,
  dragHandle,
}: {
  item: any;
  onClick?: () => void;
  dragHandle: any;
}) => {
  return (
    <div
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {dragHandle}
      <div>
        <div className="title">{item.title}</div>
        <div className="subtitle">{item.subtitle}</div>
      </div>
    </div>
  );
};

const SelectorSidebar = ({
  items,
  onReorder,
  addNew,
  entityTitle,
  detailExtractor,
  selectedKey,
  onSelect,
}: {
  items: unknown[];
  onReorder: (newOrder: any[]) => void;
  addNew: () => void;
  entityTitle: string;
  detailExtractor: (item: any) => any;
  selectedKey?: string | null;
  onSelect?: (key: string) => void;
}) => {
  const renderFn = (item: any, dragHandle: any) => {
    let detail = detailExtractor(item);
    return (
      <div
        className={
          selectedKey === item.id ? "selector-item selected" : "selector-item"
        }
        key={item.id}
      >
        <Card
          item={detail}
          dragHandle={dragHandle}
          onClick={() => {
            if (onSelect) {
              onSelect(item.id);
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="selector-side-bar">
      <SortableComponent
        items={items}
        onReorder={onReorder}
        renderFn={renderFn}
      />

      <Row justify="start">
        <Button style={{ margin: "8px 24px" }} onClick={addNew}>
          <PlusOutlined /> Add {entityTitle}
        </Button>
      </Row>
    </div>
  );
};

export default SelectorSidebar;
