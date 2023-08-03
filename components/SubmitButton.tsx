import React from 'react'

type SubmitButtonProp = {
    value: string;
}

const SubmitButton = ({value}: SubmitButtonProp) => {
  return (
    <input className="cursor-pointer mt-8 bg-primary text-white rounded-lg" type="submit" value={value} />
  )
}

export default SubmitButton
