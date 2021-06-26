import React, { useEffect, useState } from 'react';
import CommonSDK, { useAsyncEffect } from '../../lib';

export const AsyncEffectUser = props => {
    const { action } = props;
    useAsyncEffect(async isMounted => {
        await new Promise(resolve => setTimeout(resolve, 50));
        if (isMounted()) {
            action();
        }
    }, [action]);

    return null;
};
