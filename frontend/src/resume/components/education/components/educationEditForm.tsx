import {
  Row,
  Steps,
} from "antd";
import React, { useEffect } from "react";
import { Education, EducationList } from "../../../../types/resume";
// import "./index.css";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

import { DetailForm } from "./detailForm";
import { CourseForm } from "./courseForm";
import { DescriptionForm } from "./descriptionForm";


type SingleEducationFormProps = {
  initialValues?: any;
  onFinish?: (values: any) => Promise<void>;
  saveLoading?: boolean;
};

const SingleEducationForm = ({
  initialValues,
  onFinish,
  saveLoading,
}: SingleEducationFormProps) => {
  const [educationData, setEducationData] = React.useState<any>(
    initialValues || {}
  );

  useEffect(() => {
    if (initialValues?.id === educationData?.id) {
      setState((prev) => ({
        ...prev,
        current: 0,
        finished: false,
      }));
    }

    setEducationData(initialValues || {});
  }, [initialValues]);

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
  const [state, setState] = React.useState({
    current: 0,
    finished: false,
    loading: false,
  });

  const onSave = async (
    key: "description" | "modules" | "details",
    details: any
  ) => {
    setEducationData((prev: any) => ({
      ...prev,
      ...details,
    }));
    if (key === "details") {
      setState((prev) => ({
        ...prev,
        current: 1,
      }));
    } else if (key === "modules") {
      setState((prev) => ({
        ...prev,
        current: 2,
      }));
    } else if (key === "description") {
      // Complete and move to next
      if (onFinish) {
        let finalData = {
          ...educationData,
          ...details,
        };
        setState((prev) => ({
          ...prev,
          loading: true,
        }));
        finalData.startDate = Timestamp.fromDate(
          finalData.dateRange[0].toDate()
        );
        finalData.endDate = finalData.dateRange[1]
          ? Timestamp.fromDate(finalData.dateRange[1].toDate())
          : null;

        delete finalData.dateRange;
        await onFinish(finalData);
        setState((prev) => ({
          ...prev,
          finished: true,
          loading: false,
        }));
      }
    }
  };

  return (
    <div>
      <Steps
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
            title: "Courses",
            // description,
          },
          {
            title: "Description",
            // description,
          },
        ]}
      />

      <Row
        style={{
          marginTop: "24px",
        }}
      >
        {
          {
            0: (
              <DetailForm
                initialValues={educationData}
                onFinish={(details) => onSave("details", details)}
                saveLoading={saveLoading}
              />
            ),
            1: (
              <CourseForm
                initialValues={educationData}
                onFinish={(details) => onSave("modules", details)}
                saveLoading={saveLoading}
              />
            ),
            2: (
              <DescriptionForm
                initialValues={educationData}
                onFinish={(details) => onSave("description", details)}
                saveLoading={saveLoading}
              />
            ),
          }[state.current]
        }
      </Row>
    </div>
  );
};

export default SingleEducationForm;
