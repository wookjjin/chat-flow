import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import type { EditableInputProps } from '@/types/editable-input';

export default function EditableInput({
  inputRef,
  value,
  onChange,
  onEnter,
  placeholder = '',
  maxHeight = 'max-h-52',
  className,
  disabled,
}: EditableInputProps) {
  useEffect(() => {
    if (inputRef?.current) {
      if (inputRef.current.textContent !== value) {
        inputRef.current.textContent = value;
      }
    }
  }, [value, inputRef]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    onChange(text);

    if (!text.trim()) {
      e.currentTarget.textContent = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onEnter?.();
    }
  };

  return (
    <div
      ref={inputRef}
      contentEditable={!disabled}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      aria-disabled={disabled}
      className={cn(
        'flex-1 cursor-text outline-none min-h-6 overflow-y-auto',
        'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400',
        disabled && 'cursor-not-allowed',
        maxHeight,
        className,
      )}
      suppressContentEditableWarning
    />
  );
}
