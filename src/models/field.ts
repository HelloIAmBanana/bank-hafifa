export type Field={
    id: string;
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
    checked?: boolean;
    options?: { value: string; label: string }[];
  }