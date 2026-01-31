import React from "react";

export type AuthenticationFieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  size?: number;
  onChange: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

const AuthenticationField = (props: AuthenticationFieldProps) => {
  return (
    <div className="form-floating">
      <input
        type={props.type ?? "text"}
        className="form-control"
        id={props.id}
        placeholder={props.placeholder ?? props.label}
        size={props.size ?? 50}
        value={props.value}
        onKeyDown={props.onKeyDown}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
};

export default AuthenticationField;
