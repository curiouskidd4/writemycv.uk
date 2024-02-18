import { Divider, Menu, Row, Select, Steps, Typography } from "antd";
import React, { useCallback, useEffect } from "react";
import {
  MinusCircleOutlined,
  PlusOutlined,
  DownOutlined,
  UpOutlined,
  HolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Education, EducationList } from "../../../../types/resume";
// import "./index.css";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { DetailForm } from "./DetailForm";
import { AchievementForm } from "./AchievementForm";
import { DescriptionForm } from "./DescriptionForm";
import _ from "lodash";

export const colSpan = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 12,
};
export const fullColSpan = 24;

type SingleExperienceFormProps = {
  initialValues?: any;
  onFinish: (values: any) => void;
  saveLoading?: boolean;
};

const SingleExperienceForm = ({
  initialValues,
  onFinish,
  saveLoading,
}: SingleExperienceFormProps) => {
  let startDate = initialValues.startDate
    ? dayjs(initialValues.startDate.toDate())
    : null;
  let endDate = initialValues.endDate
    ? dayjs(initialValues.endDate.toDate())
    : null;
    initialValues = {
      ...initialValues,
      dateRange: [startDate, endDate],
    };
  const [experienceData, setExperienceData] = React.useState<any>(
    initialValues || {}
  );

 
  const [state, setState] = React.useState({
    current: 0,
    finished: false,
    loading: false,
    showSaved: false,
  });

  const debounceSave = useCallback(
    _.debounce(async (details: any) => {
      await onFinish(details);
      console.log("Saving....");
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    }, 1000),
    []
  );

  const onSave = async (details: any) => {
    setExperienceData((prev: any) => ({
      ...prev,
      ...details,
    }));

    let finalData = {
      ...experienceData,
      ...details,
    };

    // Check mandatory fields are filled
    if (
      !finalData.employerName ||
      !finalData.position ||
      !finalData.dateRange
    ) {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    if (JSON.stringify(finalData) === JSON.stringify(initialValues)) {
      setState((prev) => ({
        ...prev,
        loading: false,
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      loading: true,
    }));
    if (finalData.dateRange) {
      // Complete and move to next
      finalData.startDate = Timestamp.fromDate(finalData.dateRange[0].toDate());
      finalData.endDate = finalData.dateRange[1]
        ? Timestamp.fromDate(finalData.dateRange[1].toDate())
        : null;

      delete finalData.dateRange;
    }
    setState((prev) => ({
      ...prev,
      loading: true,
      showSaved: true,
    }));
    await debounceSave(finalData);
    // setState((prev) => ({
    //   ...prev,
    //   finished: true,
    //   loading: false,
    //   //   current: 0,
    // }));
  };

  return (
    <div>
      <Row
        style={{
          marginTop: "24px",
          width: "100%",
        }}
      >
        <Row align="middle" justify="space-between" style={{ width: "70%" }}>
          <div className="profile-input-section-title">
            <Typography.Text strong>Basic Details</Typography.Text>
          </div>
          {state.loading && state.showSaved ? (
            <div className="auto-save-label-loading">
              Saving changes <i className="fa-solid fa-cloud fa-beat"></i>
            </div>
          ) : state.showSaved ? (
            <div className="auto-save-label-success">
              Saved <i className="fa-solid fa-cloud"></i>
            </div>
          ) : null}
        </Row>
        <div>
          <DetailForm
            initialValues={experienceData}
            onChange={(details) => onSave(details)}
            saveLoading={saveLoading}
          />
          <Divider className="profile-input-section-divider" />
          <DescriptionForm
            initialValues={experienceData}
            onChange={(details) => onSave(details)}
            saveLoading={saveLoading}
          />
          <Divider className="profile-input-section-divider" />
          <AchievementForm
            position={experienceData.position}
            initialValues={experienceData}
            onChange={(details) => onSave(details)}
            saveLoading={saveLoading}
          />
        </div>
      </Row>
    </div>
  );
};

export default SingleExperienceForm;
