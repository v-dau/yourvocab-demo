import React from 'react';
import CreatableSelect from 'react-select/creatable';
import type { ActionMeta, MultiValue } from 'react-select';
import { useTranslation } from 'react-i18next';

export interface TagOption {
  value: string;
  label: string;
  __isNew__?: boolean;
}

interface TagCreatableSelectProps {
  value: TagOption[];
  onChange: (newValue: MultiValue<TagOption>, actionMeta: ActionMeta<TagOption>) => void;
  onBlur: () => void;
  options: TagOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

const slugify = (str: string) => {
  return str
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD') // Remove accents
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const TagCreatableSelect: React.FC<TagCreatableSelectProps> = ({
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  disabled,
  className,
  error,
}) => {
  const { t } = useTranslation();

  return (
    <CreatableSelect
      isMulti
      isDisabled={disabled}
      options={options}
      value={value}
      onChange={(newValue, actionMeta) => {
        if (actionMeta.action === 'create-option') {
          const mappedValue = (newValue as TagOption[]).map((val) =>
            val.__isNew__ ? { ...val, value: slugify(val.value), label: slugify(val.label) } : val
          );
          onChange(mappedValue as MultiValue<TagOption>, actionMeta);
        } else {
          onChange(newValue, actionMeta);
        }
      }}
      onBlur={onBlur}
      placeholder={placeholder || t('common.typeToCreateTags', 'Nhập để tạo hoặc chọn nhãn...')}
      formatCreateLabel={(inputValue) => {
        const slug = slugify(inputValue) || inputValue;
        return t('common.createTag', `Tạo nhãn mới #{{inputValue}}`, {
          inputValue: slug,
        });
      }}
      formatOptionLabel={(option) => {
        if (option.__isNew__) {
          return option.label;
        }
        return option.label.startsWith('#') ? option.label : `#${option.label}`;
      }}
      noOptionsMessage={() => t('common.noTagsFound', 'Không có nhãn nào')}
      className={className}
      classNames={{
        control: () =>
          `flex w-full rounded-md border min-h-10 bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
            error
              ? 'border-destructive focus-within:ring-destructive'
              : 'border-input focus-within:border-ring'
          }`,
        input: () => 'text-foreground',
        menu: () =>
          'mt-2 rounded-md border border-border bg-popover text-popover-foreground shadow-md',
        option: (state) =>
          `relative flex cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors ${
            state.isFocused ? 'bg-accent text-accent-foreground' : ''
          } ${state.isSelected ? 'bg-primary text-primary-foreground' : ''}`,
        multiValue: () => 'bg-secondary text-secondary-foreground rounded-sm mr-1.5',
        multiValueLabel: () => 'text-xs px-1.5 py-0.5',
        multiValueRemove: () =>
          'hover:bg-destructive hover:text-destructive-foreground px-1 rounded-r-sm transition-colors',
        indicatorSeparator: () => 'hidden',
        dropdownIndicator: () => 'text-muted-foreground p-1 hover:text-foreground',
        clearIndicator: () => 'text-muted-foreground p-1 hover:text-foreground',
        placeholder: () => 'text-muted-foreground text-sm',
      }}
      unstyled
    />
  );
};
