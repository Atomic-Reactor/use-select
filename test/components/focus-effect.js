import { useFocusEffect } from '../../lib';
import React, { useRef, useEffect } from 'react';

export const Focused = () => <div id='focused' />;

export default () => {
    const containerRef = useRef();
    const [focused] = useFocusEffect(containerRef, containerRef.current);

    return (
        <form ref={containerRef}>
            <input type='text' data-focus />
            <button type='submit'>Submit</button>
            {focused && <Focused />}
        </form>
    );
};
