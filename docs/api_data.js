define({ "api": [
  {
    "type": "ReactHook",
    "url": "useReduxState(select,shouldUpdate,domain)",
    "title": "useReduxState()",
    "description": "<p>Similar to React useState(), returns selected redux state, and action dispatching function, as the first and second elements of an array.</p> <p>Takes an optional shouldUpdate callback (see useSelect), which does a shallow comparison of previous and current selected state by default. The update callback returned expects to be called with an object, and will cause a dispatch: { type: 'DOMAIN_UPDATE', domain, // the passed domain update, // object passed to update }</p> <p>Note: the boilerplate redux reducer created with <code>arcli component</code> will target action dispatched from this hoook.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Function",
            "optional": true,
            "field": "select",
            "description": "<p>Optional select callback (see useSelect), which selects for the domain by default.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": true,
            "field": "shouldUpdate",
            "description": "<p>Optional shouldUpdate callback (see useSelect), which does a shallow comparison of previous and current selected state by default.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "domain",
            "description": "<p>The targeted redux domain.</p>"
          }
        ]
      }
    },
    "name": "useReduxState",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": "src/named-exports/redux.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useSelect(params)",
    "title": "useSelect()",
    "description": "<p>React hook for subscribing to only the updates from Redux store that you care about, and no more. This is superior to <code>react-redux</code> connect, in that your component will not update on every dispatch, only those state changes you have specifically targeted.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "params",
            "description": "<ol> <li>Callback function taking current state object from Redux store, and returning what you care about, or</li> <li>an Object with <code>select</code>, <code>shouldUpdate</code> and <code>returnMode</code> props.</li> </ol>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "params.select",
            "description": "<p>Callback function taking current state object from Redux store, and returning what you care about.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": true,
            "field": "params.shouldUpdate",
            "description": "<p>Callback function object with 2 properties <code>newState</code> and <code>prevState</code>, containing the current results of the select function, and the previous results of the select function, respectively. Returns true if your component should update, otherwise false. By default, <code>useSelect</code> will do a shallow comparison.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "params.returnMode",
            "defaultValue": "state",
            "description": "<p><code>state</code> to get the current state, <code>ref</code> to get the whole React reference object (for more realtime updates), and <code>get</code> for a getter function that takes object-path</p>"
          }
        ]
      }
    },
    "name": "useSelect",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Simple.js",
        "content": "import React from 'react';\nimport { useSelect } from '@atomic-reactor/use-select';\n\n// given a Redux state of { \"Simple\": {\"foo\": { \"bar\": \"baz\" }}}\nexport default () => {\n    // Simple select callback: will update the component only when state.Simple.foo.bar changes no more.\n    const baz = useSelect(state => state.Simple.foo.bar);\n    return (\n        <div>\n            {baz}\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "Advanced.js",
        "content": "import React from 'react';\nimport { useSelect } from '@atomic-reactor/use-select';\n\n// given a Redux state of {\n//    \"Advanced\": {\n//      \"foo\": { \"bar\": \"baz\" },\n//      \"hello\": \"world\",\n//    }\n//}\nexport default () => {\n   // Advanced select callback: will update the component only conditions of shouldUpdate are true.\n   // All other Redux state changes are ignored.\n   const Advanced = useSelect({\n     select: state => state.Advanced,\n\n     shouldUpdate: ({newState, prevState}) => {\n       // newState and prevState are current and previous outcome of select callback above\n       return newState.foo.bar !== prevState.foo.bar || newState.hello !== prevState.hello;\n     },\n   });\n\n   return (\n       <div>\n           {Advanced.foo.bar}\n           {Advanced.hello}\n       </div>\n   );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/redux.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useStore()",
    "title": "useStore()",
    "description": "<p>Just gimme the store damnit! This React hook provides the Redux store when used on a component declared within the Store Provider.</p>",
    "name": "useStore",
    "group": "ReactHook",
    "examples": [
      {
        "title": "MyComponent.js",
        "content": "import React, { useEffect } from 'react';\nimport { useStore } from '@atomic-reactor/use-select';\n\nexport default () => {\n    const { dispatch, getState, subscribe } = useStore();\n    let count = getState();\n\n    useEffect(() => {\n        const unsubscribe = subscribe(() => {\n            count = getState();\n        });\n\n        return unsubscribe;\n    });\n\n    return (\n        <div>\n            <button onClick={() => dispatch({ type: 'BUTTON_CLICK' })}>\n                Click {count}\n            </button>\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/redux.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "Function",
    "url": "ec(Component)",
    "title": "ec()",
    "description": "<p>ec, short for &quot;easy connect&quot; is a stripped down version of the redux <code>connect</code> function, which will provide your component with any Redux state properties under the name matching your component class (if applicable), as well as a <code>getState</code> function property.</p>",
    "name": "ec",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Component",
            "optional": false,
            "field": "Component",
            "description": "<p>the React component to be decorated with Redux state.</p>"
          },
          {
            "group": "Parameter",
            "type": "domain",
            "optional": true,
            "field": "domain",
            "description": "<p>domain or object path to get from state. if not provided, will used Component.name property.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Utilities",
    "examples": [
      {
        "title": "MyComponent/index.js",
        "content": "import MyComponent from './MyComponent';\nimport { ec } from '@atomic-reactor/use-select';\n\nexport ec(MyComponent);",
        "type": "json"
      },
      {
        "title": "MyComponent/MyComponent.js",
        "content": "import React, { Component } from 'react';\n\nclass MyComponent extends Component {\n    render() {\n        // getState prop provided by ec\n        const state = this.props.getState();\n        // foo property provided by ec\n        const foo = this.props.foo;\n\n        // Given that Redux store has an property MyComponent with property `foo`\n        return (\n            <div>\n                {state.MyComponent.foo}\n                {foo}\n            </div>\n        );\n    }\n}\n\nMyComponent.defaultProps = {\n    getState: () => {},\n    foo: null,\n};\n\nexport default MyComponent;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/redux.js",
    "groupTitle": "Reactium.Utilities"
  }
] });
