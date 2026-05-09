import { Controller } from 'react-hook-form';
import type { Control, RegisterOptions, FieldPath, FieldValues } from 'react-hook-form';
import { ZrTextInput }  from '@zurich/web-components/react/text-input';
import { ZrCheckbox }   from '@zurich/web-components/react/checkbox';
import { ZrSelect }     from '@zurich/web-components/react/select';
import { ReactDateInput } from '@zurich/css-components/react';

// Construye props kebab-case para pasarlos con spread (JSX no admite guiones en nombres de prop)
function kp(error?: string, helpText?: string, inputType?: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (error)          out['help-text']  = error;
  else if (helpText)  out['help-text']  = helpText;
  if (inputType && inputType !== 'text') out['input-type'] = inputType;
  return out;
}

// ---------------------------------------------------------------------------
// Text / email / tel input  →  ZrTextInput (@zurich/web-components)
// ---------------------------------------------------------------------------
interface InputProps<TFV extends FieldValues> {
  control: Control<TFV>;
  name: FieldPath<TFV>;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  helpText?: string;
  error?: string;
  rules?: RegisterOptions<TFV, FieldPath<TFV>>;
  inputType?: 'text' | 'email' | 'tel';
}

export function ZdsInput<TFV extends FieldValues>({
  control, name, label, required, readOnly, helpText, error, rules, inputType,
}: InputProps<TFV>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules as RegisterOptions<TFV, typeof name>}
      render={({ field }) => (
        <ZrTextInput
          name={field.name}
          model={String(field.value ?? '')}
          label={label}
          required={required}
          readonly={readOnly}
          invalid={!!error}
          onChange={(val: string | null) => field.onChange(val ?? '')}
          onBlur={field.onBlur}
          {...(kp(error, helpText, inputType) as Record<string, unknown>)}
        />
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Date input  →  ReactDateInput (@zurich/css-components)
// ---------------------------------------------------------------------------
export function ZdsDate<TFV extends FieldValues>({
  control, name, label, required, readOnly, helpText, error, rules,
}: Omit<InputProps<TFV>, 'inputType'>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules as RegisterOptions<TFV, typeof name>}
      render={({ field }) => (
        <ReactDateInput
          name={field.name}
          model={String(field.value ?? '')}
          label={label}
          required={required}
          readonly={readOnly}
          invalid={!!error}
          onChange={(val: string | null) => field.onChange(val ?? '')}
          onBlur={field.onBlur}
          {...(kp(error, helpText) as Record<string, unknown>)}
        />
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Checkbox  →  ZrCheckbox (@zurich/web-components)
// ---------------------------------------------------------------------------
export function ZdsCheckboxField<TFV extends FieldValues>({
  control, name, label,
}: {
  control: Control<TFV>;
  name: FieldPath<TFV>;
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
          onChange={(val: boolean | null) => field.onChange(val ?? false)}
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

interface SelectProps<TFV extends FieldValues> {
  control: Control<TFV>;
  name: FieldPath<TFV>;
  label: string;
  options: readonly ZdsOption[];
  rules?: RegisterOptions<TFV, FieldPath<TFV>>;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  helpText?: string;
  placeholder?: string;
  withSearch?: boolean;
}

export function ZdsSelect<TFV extends FieldValues>({
  control, name, label, options, rules, required, disabled, loading,
  error, helpText, placeholder, withSearch,
}: SelectProps<TFV>) {
  const zdsOptions = options.map((o) => ({
    value:    o.value,
    text:     o.text ?? o.label ?? o.value,
    disabled: o.disabled,
  }));

  const allOptions = placeholder
    ? [{ value: '', text: placeholder, disabled: true }, ...zdsOptions]
    : zdsOptions;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules as RegisterOptions<TFV, typeof name>}
      render={({ field }) => (
        <ZrSelect
          name={field.name}
          label={label}
          model={String(field.value ?? '')}
          options={allOptions}
          required={required}
          disabled={disabled || loading}
          invalid={!!error}
          withSearch={withSearch}
          {...(kp(error, helpText ?? (loading ? 'Cargando opciones...' : undefined)) as Record<string, unknown>)}
          onChange={(val: string | null) => field.onChange(val ?? '')}
          onBlur={() => field.onBlur()}
        />
      )}
    />
  );
}
