// fieldsRegistry.ts

import { Input , Select} from "@mui/material";

type FieldComponent = React.ComponentType<any>;

interface FieldsRegistry {
  [key: string]: FieldComponent;
}

const fieldsRegistry: FieldsRegistry = {
  text: Input,
  email: Input,
  password: Input,
  date: Input,
  select: Select,
};

export default fieldsRegistry;
