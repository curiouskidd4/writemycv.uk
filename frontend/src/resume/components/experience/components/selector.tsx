import React, { useEffect } from "react";
import ItemSelector from "../../itemSelector";
import { Experience } from "../../../../types/resume";
import { Button, Typography } from "antd";
import moment from "moment";

type ExperienceSelectorProps = {
  experienceList: Experience[];
  onSave: (educationList: Experience[]) => void;
};

const ExperienceSelector = ({
  experienceList,
  onSave,
}: ExperienceSelectorProps) => {
  let selectItems = experienceList.map((item) => {
    return {
      id: item.id,
      title: item.position,
      description: item.employerName,
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
    let selectedExperience = experienceList.filter((item) =>
      selectedItems.map((i) => i.id).includes(item.id)
    );

    onSave(selectedExperience);
  };

  return (
    <div className="detail-form-body">

      <Typography.Text type="secondary">
        Select the ones you want to include in your CV
      </Typography.Text>

      <ItemSelector
        items={items}
        onChange={(items) => {
          setItems(items);
        }}
      />
      <Button type="primary" onClick={save}>Save</Button>
    </div>
  );
};

export default ExperienceSelector;
