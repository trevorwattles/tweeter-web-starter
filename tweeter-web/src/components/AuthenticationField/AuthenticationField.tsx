import React from "react";

interface Props {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  inputClassName?: string;
}

const AuthenticationField = (props: Props) => {
  return (
    <div className="form-floating">
      <input
        type={props.type ?? "text"}
        className={`form-control ${props.inputClassName ?? ""}`.trim()}
        id={props.id}
        placeholder={props.placeholder ?? props.label}
        value={props.value}
        onKeyDown={props.onKeyDown}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
};

export default AuthenticationField;
