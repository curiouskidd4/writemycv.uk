import { Button, Col, Form, Row } from "antd";
import React, { useEffect } from "react";
import Achievements from "./achievements";

type AchievementFormProps = {
  initialValues?: any;
  position: string;
  onChange: (values: any) => void;
  saveLoading?: boolean;
};
export const AchievementForm = ({
  initialValues,
  position,
  onChange,
}: AchievementFormProps) => {
  const [achievements, setAchievements] = React.useState(
    initialValues?.achievements || []
  );


  useEffect(() => {
    onChange({
      achievements: achievements,
    });
  }, [achievements]);

  return (
    <Achievements
      jobTitle={position}
      value={achievements}
      onChange={setAchievements}
    />
  );
};
