import React, { useState } from "react";
import { useOpenAI } from "../../../../utils";
import FormLabel from "../../../../components/labelWithActions";
import { Button, Popover, Skeleton, Typography } from "antd";
import { MagicWandIcon } from "../../../../components/faIcons";

type CourseLabelWithAIActionsProps = {
  degree: string;
  school: string;
  onAddCourses: (value: string) => void;
};
const CourseLabelWithAIActions = ({ degree, school, onAddCourses }: CourseLabelWithAIActionsProps) => {
    let openai = useOpenAI();
    const [popoverOpen, setPopoverOpen] = useState(false);
  
    // AI Actions helper
  
    const handleGenSuggestions = () => {
      setPopoverOpen(true);
      openai.getEducationCoursesSuggestion({
        degree,
        school,
        // role: "machine learning engineer",
      });
    };
  
    const handleAdd = (value: string) => {
      onAddCourses(value);
      setPopoverOpen(false);
    };
  
    return (
      <FormLabel
        action={
          <Popover
            open={popoverOpen}
            onOpenChange={(open) => {
              setPopoverOpen(open);
            }}
            trigger="click"
            placement="bottomRight"
            content={
              <div
                style={{
                  width: "500px",
                }}
              >
                <Typography.Text type="secondary">
                  Courses Suggestions
                </Typography.Text>
                <>
                  {openai.loading ? <Skeleton /> : null}
                  {!openai.loading &&
                    openai.data?.results?.map((item:any, idx: number) => (
                      <div
                        key={idx}
                        className="openai-generated-content-item"
                        onClick={() => handleAdd(item.content)}
                      >
                        {item.content}
                      </div>
                    ))}
                </>
              </div>
            }
          >
            <Button type="link" size="small" onClick={handleGenSuggestions}>
              <MagicWandIcon /> CV Wizard
            </Button>
          </Popover>
        }
        label="Key Modules (add relevant courses you undertook as part of degree)"
        required={true}
      />
    );
  };

export default CourseLabelWithAIActions;