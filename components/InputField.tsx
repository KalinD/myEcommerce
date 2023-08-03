import React from 'react'

type InputFieldProp = {
    name: string;
    value: string;
    setValue: (value: string) => void;
    type: string;
    placeholder: string;
}

const InputField = ({name, value, setValue, type, placeholder}: InputFieldProp) => {
  return (
    <div>
    <label htmlFor={name}></label>
    <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className='rounded p-1'
        />
    </div>
  )
}

export default InputField
