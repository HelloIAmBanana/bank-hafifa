export type Field = {
  id: string;
  label?: string;
  type: string;
  placeholder?: string;
  checked?: boolean;
  options?: { value: string; label: string }[];
  initValue?: string;
};
