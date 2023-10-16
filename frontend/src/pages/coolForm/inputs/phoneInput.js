import { Input, Select, Space } from "antd";
import countryCodes from "./callingCodes.json";
import { useState } from "react";

export const PhoneInput = ({ value, onChange, size, ...props }) => {
  const [searchVal, setSearchVal] = useState("In");
  const onPhoneChange = (e) => {
    if (!onChange) return;
    onChange({
      countryCode: value?.countryCode || "+44",
      number: e?.target?.value,
    });
  };

  const onSelectCountryCode = (e) => {
    if (!onChange) return;
    onChange({
      countryCode: e || "+44",
      number: value?.number,
    });
  };


  return (
    <Space.Compact>
      <Select
        size={
          size? size : "large"
        }
        showSearch
        style={{ width: "100px" }}
        defaultValue={value?.countryCode || "+44"}
        value={value?.countryCode }
        onChange={onSelectCountryCode}
        placeholder="Select Country"
        popupMatchSelectWidth={false}
        onSearch={(value) => {
          setSearchVal(value);
        }}
        filterOption={false}
        optionLabelProp="value"

      >
        {countryCodes
          .filter((country) =>
            searchVal
              ? (country.name+country.dial_code)
                  .toLocaleLowerCase()
                  .includes(searchVal.toLocaleLowerCase())
              : true
          )
          .map((country) => {
            return (
              <Select.Option
                value={country.dial_code}
                key={country.dial_code + country.name}
              >
                {country.name} ({country.dial_code})
              </Select.Option>
            );
          })}
      </Select>
      <Input
        size={
          size? size : "large"
        }
        value={value?.number}
        onChange={onPhoneChange}
        placeholder="Phone number"
      />
    </Space.Compact>
  );
};
