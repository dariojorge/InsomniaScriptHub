import React, { useState } from 'react';

const CheckboxComponent = (props: { title: string; updateData: any; }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: { target: { name: string; checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIsChecked(event.target.checked);
    props.updateData({name: event.target.name, value: event.target.checked});
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          name={props.title}
          onChange={handleCheckboxChange}
        />
        {props.title}
      </label>
    </div>
  );
}

export default CheckboxComponent;