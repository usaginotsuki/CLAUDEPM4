import { Controller } from 'react-hook-form';
import type { Control, RegisterOptions, FieldPath } from 'react-hook-form';
import { ZrTextInput }  from '@zurich/web-components/react/text-input';
import { ZrCheckbox }   from '@zurich/web-components/react/checkbox';
import { ZrSelect }     from '@zurich/web-components/react/select';
import { ReactDateInput } from '@zurich/css-components/react';
import type { FfFlSolicitudFormData } from './variables';

type ZControl = Control<FfFlSolicitudFormData>;
type ZField   = FieldPath<FfFlSolicitudFormData>;

// Construye props kebab-case para pasarlos con spread (JSX no admite guiones en nombres de prop)
function kp(error?: string, helpText?: string, inputType?: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (error)           out['help-text']  = error;
  else if (helpText)   out['help-text']  = helpText;
  if (inputType && inputType !== 'text') out['input-type'] = inputType;
  return out;
}

// ---------------------------------------------------------------------------
// Text / email / tel input  →  ZrTextInput (@zurich/web-components)
// ---------------------------------------------------------------------------
interface InputProps {
  control: ZControl;
  name: ZField;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  helpText?: string;
  error?: string;
  rules?: RegisterOptions;
  inputType?: 'text' | 'email' | 'tel';
}

export function ZdsInput({
  control, name, label, required, readOnly, helpText, error, rules, inputType,
}: InputProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <ZrTextInput
          name={field.name}
          model={String(field.value ?? '')}
          label={label}
          required={required}
          readonly={readOnly}
          invalid={!!error}
          onChange={(val: string) => field.onChange(val)}
          onBlur={field.onBlur}
          {...(kp(error, helpText, inputType) as any)}
        />
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Date input  →  ReactDateInput (@zurich/css-components) — ZrDatePicker pendiente
// ---------------------------------------------------------------------------
export function ZdsDate({
  control, name, label, required, readOnly, helpText, error, rules,
}: Omit<InputProps, 'inputType'>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <ReactDateInput
          name={field.name}
          model={String(field.value ?? '')}
          label={label}
          required={required}
          readonly={readOnly}
          invalid={!!error}
          onChange={(val: string) => field.onChange(val)}
          onBlur={field.onBlur}
          {...(kp(error, helpText) as any)}
        />
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Checkbox  →  ZrCheckbox (@zurich/web-components)
// ---------------------------------------------------------------------------
export function ZdsCheckboxField({
  control, name, label,
}: {
  control: ZControl;
  name: ZField;
  label: string;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ZrCheckbox
          name={field.name}
          model={!!field.value}
          label={label}
          onChange={(val: boolean) => field.onChange(val)}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Select  →  ZrSelect (@zurich/web-components)
// ---------------------------------------------------------------------------
type ZdsOption = { value: string; label?: string; text?: string; disabled?: boolean };

interface SelectProps {
  control: ZControl;
  name: ZField;
  label: string;
  options: readonly ZdsOption[];
  rules?: RegisterOptions;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  helpText?: string;
  placeholder?: string;
  withSearch?: boolean;
}

export function ZdsSelect({
  control, name, label, options, rules, required, disabled, loading,
  error, helpText, placeholder, withSearch,
}: SelectProps) {
  const zdsOptions = options.map((o) => ({
    value: o.value,
    text:  o.text ?? o.label ?? o.value,
    disabled: o.disabled,
  }));

  const allOptions = placeholder
    ? [{ value: '', text: placeholder, disabled: true }, ...zdsOptions]
    : zdsOptions;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <ZrSelect
          name={field.name}
          label={label}
          model={String(field.value ?? '')}
          options={allOptions}
          required={required}
          disabled={disabled || loading}
          invalid={!!error}
          helpText={error ?? helpText ?? (loading ? 'Cargando opciones...' : undefined)}
          withSearch={withSearch}
          onChange={(val: string) => field.onChange(val)}
          onBlur={() => field.onBlur()}
        />
      )}
    />
  );
}
