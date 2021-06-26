import React, { useRef, useState, forwardRef } from 'react';
import CommonSDK, { useSyncState, useHandle, useRegisterHandle } from '../../lib';
import op from 'object-path';

export const UseSyncStateComponent = () => {
    const state = useSyncState({ clicks: 1 });
    const createHandle = () => state;

    useRegisterHandle('EventHandleComponent', createHandle);

    const onClick = () => {
        const clicks = state.get('clicks');
        state.set('clicks', clicks + 1);
    }

    return <button id='click-me' onClick={onClick}>Click Me</button>
};

export const UseSyncStateComponentConsumer = () => {
    const [ , setState ] = useState(new Date);
    const handle = useHandle('EventHandleComponent');

    return (
        <>
            {handle.get('clicks', 1)}
        </>
    );
};
