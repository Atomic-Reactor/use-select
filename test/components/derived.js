import React, { useEffect, useState, useRef } from 'react';
import CommonSDK, { useDerivedState } from '../../lib';
import op from 'object-path';

export const DerivedUser = props => {
    // The state
    const [state, setState] = useDerivedState(
        props,
        ['world'],
        props.allTheThings,
    );

    const fetchData = () => {
        setTimeout(() => {
            setState({
                status: 'READY',
                data: {
                    foo: 'bar',
                },
            });
        }, 250);
    };

    useEffect(() => {
        const { data, status } = state;
        if (!status && !data) {
            setState({ world: 'HiAgain', status: 'WAITING', unsubscribedValue: '' });
            fetchData();
        }
    }, [op.get(state, 'data'), op.get(state, 'status')]);

    // Renderer
    const render = () => {
        const { data, status, world, unsubscribedValue } = state;
        return status + op.get(data, 'foo') + world + unsubscribedValue;
    };

    // Render
    return render();
};

export const DerivedParent = ({ update = false, allTheThings = false }) => {
    const [world, setWorld] = useState('hello');
    useEffect(() => {
        setTimeout(() => {
            if (update) setWorld('goodbye');
        }, 260);
    });

    return (
        <DerivedUser
            unsubscribedValue={'unsubscribedValue'}
            world={world}
            subscribe={['world']}
            allTheThings={allTheThings}
        />
    );
};
