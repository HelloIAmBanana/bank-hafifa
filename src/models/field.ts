export type Field = {
  id: string;
  type: string;
  label?: string;
  placeholder?: string;
  checked?: boolean;
  options?: { value: string; label: string }[];
  initValue?: string;
};
