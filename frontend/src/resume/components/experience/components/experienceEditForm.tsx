import { Divider, Menu, Row, Select, Steps } from "antd";
import React, { useEffect } from "react";
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
  onFinish?: (values: any) => void;
  saveLoading?: boolean;
};

const SingleExperienceForm = ({
  initialValues,
  onFinish,
  saveLoading,
}: SingleExperienceFormProps) => {
  const [experienceData, setExperienceData] = React.useState<any>({});

  useEffect(() => {
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
    setExperienceData(initialValues);
    setState((prev) => ({
      ...prev,
      current: 0,
    }));
  }, [initialValues]);

  const [state, setState] = React.useState({
    current: 0,
    finished: false,
  });

  const onSave = async (
    key: "description" | "achievements" | "details",
    details: any
  ) => {
    console.log(details);
    setExperienceData((prev: any) => ({
      ...prev,
      ...details,
    }));
    if (key === "details") {
      setState((prev) => ({
        ...prev,
        current: 1,
      }));
    } else if (key === "description") {
      setState((prev) => ({
        ...prev,
        current: 2,
      }));
    } else if (key === "achievements") {
      let finalData = {
        ...experienceData,
        ...details,
      };
      // Complete and move to next
      if (onFinish) {
        finalData.startDate = Timestamp.fromDate(
          finalData.dateRange[0].toDate()
        );
        finalData.endDate = finalData.dateRange[1]
          ? Timestamp.fromDate(finalData.dateRange[1].toDate())
          : null;

        delete finalData.dateRange;

        setState((prev) => ({
          ...prev,
          loading: true,
        }));
        await onFinish(finalData);
        setState((prev) => ({
          ...prev,
          finished: true,
          loading: false,
          //   current: 0,
        }));
      }
    }
  };

  return (
    <div>
      {/* <Steps
        style={{
          marginTop: "12px",
        }}
        onChange={(current) => {
          setState({ ...state, current });
        }}
        direction="horizontal"
        size="small"
        current={state.current}
        items={[
          { title: "Basic Details" },
          {
            title: "Description",
            // description,
          },
          {
            title: "Achievements",
            // description,
          },
        ]}
      /> */}

      <Row
        style={{
          marginTop: "24px",
          width: "100%",
        }}
      >
        {/* {experienceData?
          {
            0: (
              <DetailForm
                initialValues={experienceData}
                onFinish={(details) => onSave("details", details)}
                saveLoading={saveLoading}
              />
            ),
            1: (
              <DescriptionForm
                initialValues={experienceData}
                onFinish={(details) => onSave("description", details)}
                saveLoading={saveLoading}
              />
            ),
            2: (
              <AchievementForm
                position={experienceData.position}
                initialValues={experienceData}
                onFinish={(details) => onSave("achievements", details)}
                saveLoading={saveLoading}
              />
            ),
          }[state.current]
        : null} */}
        <>
          <DetailForm
            initialValues={experienceData}
            onFinish={(details) => onSave("details", details)}
            saveLoading={saveLoading}
          />
          <Divider className="profile-input-section-divider" />
          <DescriptionForm
            initialValues={experienceData}
            onFinish={(details) => onSave("description", details)}
            saveLoading={saveLoading}
          />
          <Divider className="profile-input-section-divider" />
          <AchievementForm
            position={experienceData.position}
            initialValues={experienceData}
            onFinish={(details) => onSave("achievements", details)}
            saveLoading={saveLoading}
          />
        </>
      </Row>
    </div>
  );
};

export default SingleExperienceForm;
