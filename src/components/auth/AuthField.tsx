"use client";

import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export default function AuthField({ label, hint, id, name, required, ...rest }: Props) {
  const fieldId = id || name;
  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-pepper mb-1.5">
        {label} {required && <span className="text-sienna">*</span>}
      </label>
      <input
        id={fieldId}
        name={name}
        required={required}
        {...rest}
        className="w-full rounded-2xl border border-line bg-bg px-4 py-2.5 text-pepper placeholder:text-pepper/40 focus:border-sienna focus:outline-none focus:ring-2 focus:ring-sienna/30"
      />
      {hint && <p className="mt-1 text-xs text-pepper/60">{hint}</p>}
    </div>
  );
}
