import React, { useEffect } from "react";
import ItemSelector from "../../itemSelector";
import { Education } from "../../../../types/resume";
import { Button, Typography } from "antd";
import moment from "moment";

type EducationSelectorProps = {
  educationList: Education[];
  onSave: (educationList: Education[]) => void;
};

const EducationSelector = ({
  educationList,
  onSave,
}: EducationSelectorProps) => {
  let selectItems = educationList.map((item) => {
    return {
      id: item.id,
      title: item.degree,
      description: item.school,
      dateString: item.startDate
        ? `${moment(item.startDate.toDate()).format("YYYY")} - ${
            item.endDate
              ? moment(item.endDate.toDate()).format("YYYY")
              : "Present"
          }`
        : "",
      selected: true,
    };
  });

  const [items, setItems] = React.useState(selectItems);

  const save = () => {
    let selectedItems = items.filter((item) => item.selected);
    let selectedEducation = educationList.filter((item) =>
      selectedItems.map((i) => i.id).includes(item.id)
    );

    onSave(selectedEducation);
  };

  return (
    <div className="detail-form-body">
      <div className="cv-subheader">
        <Typography.Text type="secondary">
          Select the ones you want to include in your CV
        </Typography.Text>
      </div>
      <div className="detail-form-body">
        <ItemSelector
          items={items}
          onChange={(items) => {
            setItems(items);
          }}
        />
        <div className="cv-submit">
          <Button type="primary" onClick={save}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EducationSelector;
