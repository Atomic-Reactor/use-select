[![Build Status](https://travis-ci.org/Atomic-Reactor/reactium-sdk-core.svg?branch=master)](https://travis-ci.org/Atomic-Reactor/reactium-sdk-core)

# useSelect

React hook useSelect provides a nice interface for responding to Redux state changes, without using connect() or
another method that aggressively rerenders most of your React app for any dispatched action.

With useSelect(), you will only see updates for specific parts of the state tree you care about.

## Install

```
npm install --save @atomic-reactor/use-select
```

There are a number of peer dependencies you will need to use these hooks.. Because these are dependencies
provided in Reactium, they are not required explicitly in this repository. If you
plan to use this on another project, install them:

```
npm install --save-dev react-redux
npm install --save-dev object-path
npm install --save-dev react
npm install --save-dev redux
npm install --save-dev react-dom
npm install --save-dev shallow-equals
```

## Usage

Simple Usage:

```
import React from 'react';
import { useSelect } from '@atomic-reactor/use-select';

// given a Redux state of { "Simple": {"foo": { "bar": "baz" }}}
export default () => {
    // Simple select callback: will update the component only when state.Simple.foo.bar changes, no more.
    const baz = useSelect(state => state.Simple.foo.bar);
    return (
        <div>
            {baz}
        </div>
    );
};
```

Advanced Usage:

```
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
```

This project is best used with [Reactium](https://github.com/Atomic-Reactor/Reactium) but can also be used independently, to make you React / Redux easier.
