import React, { Component, ReactNode } from "react";
import { render } from "react-dom";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

const DragHandle = sortableHandle(() => (
  <i class="fa-solid fa-grip-vertical drag-grip"></i>
));

const SortableItem = sortableElement(({ value, renderFn }) => (
  <li className="sort-item-container">{renderFn(value, <DragHandle />)}</li>
));

const SortableList = sortableContainer(({ items, renderFn }) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${value.id}`}
          index={index}
          value={value}
          renderFn={renderFn}
        />
      ))}
    </ul>
  );
});

// class SortableComponent extends Component {
//   state = {
//     items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"],
//   };
//   onSortEnd = ({ oldIndex, newIndex }) => {
//     this.setState(({ items }) => ({
//       items: arrayMove(items, oldIndex, newIndex),
//     }));
//   };
//   render() {
//     return <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />;
//   }
// }

const SortableComponent = ({ items, onReorder, renderFn }) => {
  // const [items, setItems] = React.useState([
  //   "Item 1",
  //   "Item 2",
  //   "Item 3",
  //   "Item 4",
  //   "Item 5",
  //   "Item 6",
  // ]);
  const onSortEnd = ({oldIndex, newIndex}) => {
    onReorder(arrayMoveImmutable(items, oldIndex, newIndex));
  };
  return (
    <SortableList
      items={items}
      onSortEnd={onSortEnd}
      renderFn={renderFn}
      useDragHandle
    />
  );
};

export default SortableComponent;
