import {
  AutoComplete,
  Button,
  Col,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React from "react";
import { Language } from "../../../types/resume";
import { DeleteOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { lang } from "moment";

const topLanguages = [
  "Spanish",
  "English",
  "French",
  "German",
  "Chinese",
  "Russian",
  "Portuguese",
  "Italian",
  "Arabic",
  "Japanese",
  "Korean",
  "Hindi",
  "Turkish",
  "Dutch",
  "Swedish",
  "Polish",
  "Indonesian",
  "Greek",
  "Danish",
  "Norwegian",
  "Finnish",
];

const LanguageItem = ({
  language,
  onRemove,
  onChange,
}: {
  language: Language;
  onRemove: () => void;
  onChange: (value: Language) => void;
}) => {
  return (
    <Row>
      <Col span={8}>
        <Typography.Text>{language.name}</Typography.Text>
      </Col>
      <Col>
        <Select
          placeholder="Select Level"
          value={language.fluency}
          onChange={(value) => {
            onChange({
              ...language,
              fluency: value,
            });
          }}
          style={{
            width: "150px",
          }}
        >
          <Select.Option value="Beginner">Beginner</Select.Option>
          <Select.Option value="Intermediate">Intermediate</Select.Option>
          <Select.Option value="Expert">Expert</Select.Option>
        </Select>
      </Col>
      <Col>
        <Button
          danger
          type="link"
          onClick={() => {
            onRemove();
          }}
        >
          <DeleteOutlined />
        </Button>
      </Col>
    </Row>
  );
};

type NewLanguageInputProps = {
  selectedLanguages: string[];
  onAdd: (language: string) => void;
};
const NewLanguageInput = ({
  selectedLanguages,
  onAdd,
}: NewLanguageInputProps) => {
  const [value, setValue] = React.useState("");
  return (
    <AutoComplete
      style={{
        width: 200,
      }}
      value={value}
      options={topLanguages
        .filter((language) => !selectedLanguages.includes(language))
        .slice(0, 5)
        .map((language) => ({
          value: language,
        }))}
      filterOption={(inputValue, option) =>
        option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }
      onSelect={(value) => {
        onAdd(value);
        setValue("");
      }}
      onChange={(value) => {
        setValue(value);
      }}
      placeholder="Add language"
    >
      <Input
        suffix={<ArrowRightOutlined />}
        onPressEnter={() => {
          onAdd(value);
          setValue("");
        }}
      />
    </AutoComplete>
  );
};

const LanguageFlow = ({
  languageList,
  onFinish,
  syncLanguages,
  showTitle = true,
}: {
  languageList: Language[];
  onFinish?: () => void;
  syncLanguages: (languages: Language[]) => Promise<void>;
  showTitle?: boolean;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [languageListState, setLanguageListState] =
    React.useState<Language[]>(languageList);

  React.useEffect(() => {
    setLanguageListState(languageList);
  }, [languageList]);

  const handleAddLanguage = (language: string) => {
    setLanguageListState((prev) => [
      ...prev,
      {
        name: language,
        fluency: "Expert",
      },
    ]);
  };

  const handleSave = async () => {
    setLoading(true);
    await syncLanguages(languageListState);
    setLoading(false);
    if (onFinish) {
      onFinish();
    }
  };

  const handleSaveLanguage = async (language: Language) => {
    const index = languageListState.findIndex(
      (item) => item.name === language.name
    );
    if (index !== -1) {
      const newList = [...languageListState];
      newList[index] = language;
      setLanguageListState(newList);
    } else {
      setLanguageListState((prev) => [...prev, language]);
    }
    await syncLanguages(languageListState);
  };

  const handleRemoveLanguageItem = async (language: Language) => {
    const newList = languageListState.filter(
      (item) => item.name !== language.name
    );
    setLanguageListState(newList);
    await syncLanguages(newList);
  };

  return (
    <div>
      {showTitle && (
        <Row>
          <Col span={24}>
            <Typography.Title level={4}>Languages</Typography.Title>
          </Col>
        </Row>
      )}

      <NewLanguageInput
        selectedLanguages={
          languageListState.map((language) => language.name) || []
        }
        onAdd={handleAddLanguage}
      />

      <Row
        style={{
          marginTop: "24px",
        }}
      >
        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
        >
          <Typography.Text strong>Added Languages</Typography.Text>
          {languageListState.map((language) => (
            <LanguageItem
              key={language.name}
              language={language}
              onRemove={() => {
                handleRemoveLanguageItem(language);
              }}
              onChange={(value) => {
                handleSaveLanguage(value);
              }}
            />
          ))}
        </Space>
      </Row>
      <Row style={{ marginTop: "24px" }}>
        <Button type="primary" loading={loading} onClick={handleSave}>
          Save
        </Button>
      </Row>
    </div>
  );
};

export default LanguageFlow;
