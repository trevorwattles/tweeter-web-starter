import React from "react";

interface Props {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  inputClassName?: string;
  checkSubmitButtonStatus: () => boolean;
  doAction: () => Promise<void>;
}

const AuthenticationField = (props: Props) => {
  const loginOrReigisterOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !props.checkSubmitButtonStatus()) {
      props.doAction();
    }
  };

  return (
    <div className="form-floating">
      <input
        type={props.type ?? "text"}
        className={`form-control ${props.inputClassName ?? ""}`.trim()}
        id={props.id}
        placeholder={props.placeholder ?? props.label}
        value={props.value}
        onKeyDown={loginOrReigisterOnEnter}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
};

export default AuthenticationField;
