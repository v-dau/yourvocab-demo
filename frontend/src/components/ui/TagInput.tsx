import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  tagClassName?: string;
}

export function TagInput({
  id,
  value,
  onChange,
  placeholder,
  className,
  tagClassName,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tags = value ? value.split('&&').filter((tag) => tag.trim() !== '') : [];

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        onChange(newTags.join('&&'));
      }
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    onChange(newTags.join('&&'));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-medium ${tagClassName || 'bg-secondary text-secondary-foreground'}`}
            >
              <span className="break-words max-w-[200px]">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:bg-muted/50 p-0.5 rounded-full transition-colors flex-shrink-0"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <textarea
        id={id}
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden min-h-[40px]"
      />
    </div>
  );
}
