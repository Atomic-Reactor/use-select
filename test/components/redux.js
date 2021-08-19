import React, { useState } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
    useReduxState,
} from '../../lib';
import {
    useRegisterHandle,
    useHandle,
} from '@atomic-reactor/reactium-sdk-core/lib/named-exports/handle';
import op from 'object-path';

const domainReducer = (state = {}, action) => {
    switch (action.type) {
        case 'DOMAIN_UPDATE': {
            const newState = {
                ...state,
                [action.domain]: {
                    ...state[action.domain],
                    ...action.update,
                },
            };

            return newState;
        }

        default:
            return state;
    }
};

export const store = createStore(domainReducer, {
    TestDomain: {
        value: 'initial',
    },
});

export const StoreProvider = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);
export const StateChanger = () => {
    const { updateDomain } = useHandle('TestDomain');
    return (
        <button id="state-changer" onClick={() => updateDomain({ value: 'updated' })}>
            Update Me
        </button>
    );
};
export const StateUser = () => {
    const [domain, updateDomain] = useReduxState('TestDomain');
    useRegisterHandle(
        'TestDomain',
        () => {
            return {
                updateDomain,
            };
        },
        [],
    );

    return op.get(domain, 'value');
};
