import React from "react";
import { InputClass } from "../../model/input-class";

const InputImpl = (props: { id: React.Key, title: string, name: string, value: string }) => {
    return (
        <div className="label-and-input">
            <label htmlFor={props.name} >{props.title}</label>
            <input
                key={props.id}
                name={props.name}
                value={props.value}
            />
        </div>
    )
}

export const Input = InputImpl;

const InputUpdateImpl = (props: { id: React.Key, title: string, name: string, updateInput: (arg: any) => React.MouseEventHandler<HTMLInputElement> }) => {
    return (
        <>
            <label htmlFor={props.name}> {props.title} </label>
            <input
                key={props.id}
                id={props.name}
                name={props.name}
                onChange={props.updateInput}
            />
        </>
    )
}

export const InputUpdate = (props: { inputClass: InputClass, updateInput: any }) => {
    return (
        <>
            <InputUpdateImpl updateInput={props.updateInput} {...props.inputClass} />
        </>
    )
}