import React, { useState } from 'react';
import CommonSDK, { useRegisterHandle, useHandle } from '../../lib';

// handle tests
export const someHandleState = 'some state';
export const HandleRegisterer = () => {
    const [handleState] = useState(someHandleState);
    useRegisterHandle('HandleComponent', () => ({
        handleState
    }), []);

    return handleState;
};

export const HandleConsumer = () => {
    const { handleState } = useHandle('HandleComponent');
    return handleState;
}
