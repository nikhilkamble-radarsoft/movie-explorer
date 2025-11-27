import { Form, Select } from "antd";

export default function SelectField({ label, name, options, placeholder, required, ...props }) {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[{ required: required, message: `Please select ${label}` }]}
      className="custom-select"
    >
      <Select size="large" placeholder={placeholder} {...props}>
        {options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}
