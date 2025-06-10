import React from 'react'
import { getId } from '../../utils/util-collection';
import './tab-group.styles.scss';

const id = getId();

const Tab = (props: { active: boolean; type: string; setActive: (arg0: any) => React.MouseEventHandler<HTMLInputElement> | undefined }) => {
    return (
        <div className={`tab ${props.active ? 'tab-active' : 'none'}`} id={id} onClick={props.setActive}>
            {props.type}
        </div>
    )
}

export const TabGroup = (props: { tabTypes: string[], active: string; setActive: any }) => {
    return (
        <div className='tabs-panel'>
            <div className='tab-group'>
                {props.tabTypes.map((tabType) => (
                    <Tab key={tabType} active={props.active === tabType} type={tabType} setActive={() => props.setActive(tabType)}></Tab>
                ))
                }
            </div>
        </div>
    )
}