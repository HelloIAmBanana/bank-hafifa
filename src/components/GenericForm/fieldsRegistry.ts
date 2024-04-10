import { Checkbox, Input, Select } from "@mui/material";

type FieldComponent = React.ComponentType<any>;

interface FieldsRegistry {
  [key: string]: FieldComponent;
}

const fieldsRegistry: FieldsRegistry = {
  text: Input,
  email: Input,
  password: Input,
  number: Input,
  date: Input,
  time: Input,
  select: Select,
  checkbox: Checkbox,
};

export default fieldsRegistry;
