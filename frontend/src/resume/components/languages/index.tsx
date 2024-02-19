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
import React, { useEffect } from "react";
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
    <Row className="skill-item-wrapper" align="middle">
      <Row className="skill-item">
        <Col span={8}>
          <Typography.Text>{language.name}</Typography.Text>
        </Col>

        {/* <Col>
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
      </Col> */}
      </Row>
      <Button
        type="link"
        style={{
          color: "var(--black)",
        }}
        onClick={() => {
          onRemove();
        }}
      >
        <i className="fa-solid fa-trash-can"></i>
      </Button>
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
  const [state, setState] = React.useState({
    loading: false,
    showSaved: false,
  });
  const [showAdd, setShowAdd] = React.useState(false);
  const [languageListState, setLanguageListState] =
    React.useState<Language[]>(languageList);

  React.useEffect(() => {
    setLanguageListState(languageList);
  }, []);

  useEffect(() => {
    syncLang(languageListState);
  }, [languageListState]);

  const syncLang = async (languages: Language[]) => {
    setState((prev) => ({
      ...prev,
      loading: true,
      showSaved: true,
    }));
    await syncLanguages(languageListState);
    setState((prev) => ({
      ...prev,
      loading: false,
    }));
  };
  const handleAddLanguage = (language: string) => {
    setLanguageListState((prev) => [
      ...prev,
      {
        name: language,
        fluency: "Expert",
      },
    ]);
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
  };

  const handleRemoveLanguageItem = async (language: Language) => {
    const newList = languageListState.filter(
      (item) => item.name !== language.name
    );
    setLanguageListState(newList);
  };

  return (
    <div className="resume-edit-detail padding">
      {showTitle && (
        <Row
          style={{
            width: "50%",
          }}
          justify="space-between"
          align="middle"
        >
          <Typography.Title level={4}>Languages</Typography.Title>
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
      )}

      {/* <NewLanguageInput
        selectedLanguages={
          languageListState.map((language) => language.name) || []
        }
        onAdd={handleAddLanguage}
      /> */}

      <Row
        style={{
          marginTop: "24px",
          width: "70%",
        }}
      >
        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
          size="large"
        >
          {/* <Typography.Text strong>Added Languages</Typography.Text> */}
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
          {showAdd ? (
            <Row align="middle">
              <Input
                className="skill-input"
                suffix={<i className="fa-solid fa-arrow-right"></i>}
                onPressEnter={(e) => {
                  handleAddLanguage(e.currentTarget.value);
                  setShowAdd(false);
                }}
              />
              <Button
                type="link"
                style={{
                  color: "var(--black)",
                }}
                onClick={() => setShowAdd(false)}
              >
                <i className="fa-solid fa-trash-can"></i>
              </Button>
            </Row>
          ) : (
            <Button
              type="link"
              className="small-link-btn"
              onClick={() => setShowAdd(true)}
            >
              <i className="fa-solid fa-plus"></i> Add Language
            </Button>
          )}
        </Space>
      </Row>
      {/* <Row style={{ marginTop: "24px" }}>
        <Button type="primary" loading={loading} onClick={handleSave}>
          Save
        </Button>
      </Row> */}
    </div>
  );
};

export default LanguageFlow;
