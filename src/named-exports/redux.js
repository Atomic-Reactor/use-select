import { useContext, useState, useEffect, useRef } from 'react';
import op from 'object-path';
import { useSyncState } from '@atomic-reactor/reactium-sdk-core/lib/named-exports/useSyncState';
import { connect, ReactReduxContext } from 'react-redux';

const shallowEquals = require('shallow-equals');
const noop = () => {};

/**
 * @api {Function} ec(Component) ec()
 * @apiDescription ec, short for "easy connect" is a stripped down version of the
redux `connect` function, which will provide your component with any Redux state
properties under the name matching your component class (if applicable),
as well as a `getState` function property.
 * @apiName ec
 * @apiParam {Component} Component the React component to be decorated with Redux state.
 * @apiParam {domain} [domain] domain or object path to get from state. if not provided, will used Component.name property.
 * @apiGroup Reactium.Utilities
 * @apiExample MyComponent/index.js
import MyComponent from './MyComponent';
import { ec } from '@atomic-reactor/use-select';

export ec(MyComponent);
 * @apiExample MyComponent/MyComponent.js
import React, { Component } from 'react';

class MyComponent extends Component {
    render() {
        // getState prop provided by ec
        const state = this.props.getState();
        // foo property provided by ec
        const foo = this.props.foo;

        // Given that Redux store has an property MyComponent with property `foo`
        return (
            <div>
                {state.MyComponent.foo}
                {foo}
            </div>
        );
    }
}

MyComponent.defaultProps = {
    getState: () => {},
    foo: null,
};

export default MyComponent;
 */
export const ec = (Component, domain) => {
    domain = domain ? domain : op.get(Component, 'name', '');
    const propNames = domain.split('.');
    const propName =
        propNames.length > 0 ? propNames[propNames.length - 1] : 'domain';

    return connect(state => {
        let data = op.get(state, domain, {});
        data =
            typeof data !== 'undefined'
                ? typeof data === 'object' || Array.isArray(data)
                    ? data
                    : { [propName]: data }
                : {};
        return {
            ...op.get(state, domain, {}),
            getState: () => state,
        };
    })(Component);
};

/**
 * @api {ReactHook} useStore() useStore()
 * @apiDescription Just gimme the store damnit! This React hook provides the Redux
store when used on a component declared within the Store Provider.
 * @apiName useStore
 * @apiGroup ReactHook
 * @apiExample MyComponent.js
import React, { useEffect } from 'react';
import { useStore } from '@atomic-reactor/use-select';

export default () => {
    const { dispatch, getState, subscribe } = useStore();
    let count = getState();

    useEffect(() => {
        const unsubscribe = subscribe(() => {
            count = getState();
        });

        return unsubscribe;
    });

    return (
        <div>
            <button onClick={() => dispatch({ type: 'BUTTON_CLICK' })}>
                Click {count}
            </button>
        </div>
    );
};
 */
export const useStore = () =>
    op.get(useContext(ReactReduxContext), 'store', {
        getState: () => ({}),
        subscribe: noop,
        dispatch: noop,
    });

/**
 * Default to shallow equals.
 */
const defaultShouldUpdate = ({ prevState, newState }) =>
    !shallowEquals(prevState, newState);

/**
 * @api {ReactHook} useSelect(params) useSelect()
 * @apiDescription React hook for subscribing to only the updates from Redux store
that you care about, and no more. This is superior to `react-redux` connect, in
that your component will not update on every dispatch, only those state changes
you have specifically targeted.
 * @apiParam {Mixed} params
 1. Callback function taking current state object from Redux store, and
 returning what you care about, or
 2. an Object with `select`, `shouldUpdate` and `returnMode` props.
 * @apiParam {Function} params.select Callback function taking current state object from Redux store, and
 returning what you care about.
 * @apiParam {Function} [params.shouldUpdate] Callback function object with 2 properties `newState` and `prevState`, containing the current
 results of the select function, and the previous results of the select function, respectively. Returns true if your component should update, otherwise
 false. By default, `useSelect` will do a shallow comparison.
 * @apiParam {String} [params.returnMode=state] `state` to get the current state, `ref` to get the whole React reference object (for more realtime updates), and `get` for a getter function that takes object-path
 * @apiName useSelect
 * @apiGroup ReactHook
 * @apiExample Simple.js
import React from 'react';
import { useSelect } from '@atomic-reactor/use-select';

// given a Redux state of { "Simple": {"foo": { "bar": "baz" }}}
export default () => {
    // Simple select callback: will update the component only when state.Simple.foo.bar changes no more.
    const baz = useSelect(state => state.Simple.foo.bar);
    return (
        <div>
            {baz}
        </div>
    );
};
* @apiExample Advanced.js
import React from 'react';
import { useSelect } from '@atomic-reactor/use-select';

// given a Redux state of {
//    "Advanced": {
//      "foo": { "bar": "baz" },
//      "hello": "world",
//    }
//}
export default () => {
   // Advanced select callback: will update the component only conditions of shouldUpdate are true.
   // All other Redux state changes are ignored.
   const Advanced = useSelect({
     select: state => state.Advanced,

     shouldUpdate: ({newState, prevState}) => {
       // newState and prevState are current and previous outcome of select callback above
       return newState.foo.bar !== prevState.foo.bar || newState.hello !== prevState.hello;
     },
   });

   return (
       <div>
           {Advanced.foo.bar}
           {Advanced.hello}
       </div>
   );
};
 */
export const useSelect = params => {
    let select = newState => newState;
    let shouldUpdate = defaultShouldUpdate;
    let returnMode = 'state';

    if (typeof params === 'function') {
        select = params;
    } else {
        select = op.get(params, 'select', select);
        shouldUpdate = op.get(params, 'shouldUpdate', shouldUpdate);
        returnMode = op.get(params, 'returnMode', 'state');
    }

    const store = useStore();
    const syncState = useSyncState(select(store.getState()));
    const deprecatedRef = useRef(syncState.get());
    const setState = () => {
        const newState = select(store.getState());
        const prevState = syncState.get();

        if (
            shouldUpdate({
                newState,
                prevState,
            })
        ) {
            syncState.set(newState);
        }
    };

    useEffect(() => {
        setState();
        return store.subscribe(setState);
    }, []);

    const getter = (key, defaultValue) =>
        op.get(syncState.current, key, defaultValue);

    switch (returnMode) {
        case 'ref':
            console.log(
                'useSelect() returnMode "ref" is deprecated, use "syncState" instead.',
            );
            deprecatedRef.current = syncState.get();
            return deprecatedRef;
        case 'get':
            return syncState.get;
        case 'syncState':
            return syncState;
        default:
            return syncState.get();
    }
};

/**
 * @api {ReactHook} useReduxState(select,shouldUpdate,domain) useReduxState()
 * @apiDescription Similar to React useState(), returns selected redux state, and action
 * dispatching function, as the first and second elements of an array.
 *
 * Takes an optional shouldUpdate callback (see useSelect), which does a shallow comparison of
 * previous and current selected state by default.
 * The update callback returned expects to be called with an object, and will cause a dispatch:
{
    type: 'DOMAIN_UPDATE',
    domain, // the passed domain
    update, // object passed to update
}
 *
 * Note: the boilerplate redux reducer created with `arcli component` will target action dispatched from this hoook.
 * @apiParam {Function} [select] Optional select callback (see useSelect), which selects for the domain by default.
 * @apiParam {Function} [shouldUpdate] Optional shouldUpdate callback (see useSelect), which does a shallow comparison of
 * previous and current selected state by default.
 * @apiParam {String} domain The targeted redux domain.
 * @apiName useReduxState
 * @apiGroup ReactHook
 */
export const useReduxState = (...params) => {
    const domain = params.pop();
    if (typeof domain !== 'string')
        throw 'useReduxState domain parameter required.';

    const [
        select = state => op.get(state, domain),
        shouldUpdate = defaultShouldUpdate,
    ] = params;

    if (typeof select !== 'function')
        throw 'select parameter must be a function';
    if (typeof shouldUpdate !== 'function')
        throw 'shouldUpdate parameter must be a function';

    const state = useSelect({ select, shouldUpdate });
    const store = useStore();
    return [
        state,
        update =>
            store.dispatch({
                type: 'DOMAIN_UPDATE',
                domain,
                update,
            }),
    ];
};
