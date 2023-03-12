import React from 'react';
import {useAppDispatch, useAppSelector} from "../hooks";
import {setIsRuntime} from '../store/modeSlice'
import {clear} from "../store/calculateSlice";

const Mode = () => {
    const dispatch = useAppDispatch()
    const isRuntime = useAppSelector(state => state.mode.isRuntime);

    return (
        <div className='mode'>
            <div className="mode__container">
                <input
                    type="radio"
                    id='runtime'
                    name='radio-mode'
                    onChange={() => dispatch(setIsRuntime(true))}
                />
                <label htmlFor="runtime">Runtime</label>

                <input
                    type="radio"
                    id='constructor'
                    name='radio-mode'
                    defaultChecked={true}
                    onChange={() => {
                        dispatch(setIsRuntime(false))
                        dispatch(clear())
                    }}
                />
                <label htmlFor="constructor">Constructor</label>
            </div>
        </div>
    )
};

export default Mode;