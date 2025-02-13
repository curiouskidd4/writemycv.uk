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
  newItem,
  addButtonText = null
}: {
  items: unknown[];
  onReorder: (newOrder: any[]) => void;
  addNew: () => void;
  entityTitle: string;
  detailExtractor: (item: any) => any;
  selectedKey?: string | null;
  onSelect?: (key: string) => void;
  newItem?: boolean;
  addButtonText?: string | null;
}) => {
  const renderFn = (item: any, dragHandle: any) => {
    let detail = item.id === "new" ? item:  detailExtractor(item);
    return (
      <div
        className={
          selectedKey === item.id ? "selector-item selected" : "selector-item"
        }
        key={item.id}
        onClick={() => {
          if (onSelect) {
            onSelect(item.id);
          }
        }}
      >
        <Card
          item={detail}
          dragHandle={dragHandle}
          
        />
      </div>
    );
  };

  return (
    <div className="selector-side-bar">
      <div>
        <div className="selector-title">
          {entityTitle}
        </div>
      <SortableComponent
        items={newItem ? [...items, 
          {
            id: "new",
            title: `(New  ${entityTitle})`,
            subtitle: " ",
          }
        ] : items}
        onReorder={onReorder}
        renderFn={renderFn}
      />
      </div>

      <Row justify="start">
        <Button style={{ margin: "8px 24px" }} onClick={addNew}>
          <PlusOutlined /> Add {addButtonText || entityTitle}
        </Button>
      </Row>
    </div>
  );
};

export default SelectorSidebar;
