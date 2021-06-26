import _ from 'underscore';
import { useIsContainer } from '../../lib';
import React, { useRef, useEffect, useState } from 'react';

export const Matched = () => <div id='matched' />;
export const UnMatched = () => <div id='unmatched' />;

export default () => {
    const refs = {
        container: useRef(),
        element: useRef(),
        other: useRef(),
    };

    const isContainer = useIsContainer();
    const [state, setState] = useState({ matched: null, unmatched: null });

    useEffect(() => {
        if (!refs.element.current) return;

        const newState = { ...state };

        if (refs.container.current && state.matched === null) {
            newState['matched'] = isContainer(
                refs.element.current,
                refs.container.current,
            );
        }

        if (refs.other.current && state.unmatched === null) {
            newState['unmatched'] = !isContainer(
                refs.element.current,
                refs.other.current,
            );
        }

        if (!_.isEqual(state, newState)) setState(newState);
    }, [state.matched, state.unmatched]);

    return (
        <>
            <div ref={refs.other} />
            <div ref={refs.container}>
                <div>
                    <div>
                        <div>
                            <div ref={refs.element} />
                        </div>
                    </div>
                </div>
            </div>
            {state.matched === true && <Matched />}
            {state.unmatched === true && <UnMatched />}
        </>
    );
};
