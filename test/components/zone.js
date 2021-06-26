import React from 'react';
import CommonSDK, { useHookComponent } from '../../lib';

export const A = () => <>A</>;
export const B = () => <>B</>;
export const C = () => <>C</>;
export const ZoneRegistered = () => <>ZoneRegistered</>;
export const Nope = () => <>Nope</>;
export const Another = () => <>Another</>;

export const MyZone = () => {
    const Zone = useHookComponent('Zone');
    return (
        <Zone zone='zone-everything' />
    );
};
