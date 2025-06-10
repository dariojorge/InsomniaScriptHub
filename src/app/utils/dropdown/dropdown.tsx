import React from 'react'
import './dropdown.styles.scss';

const DropdownList = (props: { dataList: Data[]; dataValue: string; isDisabled: boolean; updateSelected: any }) => {
    return (
        <div className="dropdown">
            <select value={props.dataValue} onChange={props.updateSelected} disabled={props.isDisabled}>
                {props.dataList?.map((service, index) => (
                    <option key={index} value={service.type}>
                        {service.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export const Dropdown = (props: { dataList: DataList; dataValue: string; isDisabled: boolean; updateSelected: any }) => {
    return (
        <>
            <DropdownList dataList={props.dataList.types} dataValue={props.dataValue} isDisabled={props.isDisabled} updateSelected={props.updateSelected} />
        </>
    );
}