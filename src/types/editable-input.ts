export interface EditableInputProps {
  inputRef?: React.RefObject<HTMLDivElement | null>;
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  maxHeight?: string;
  className?: string;
  disabled?: boolean;
}
