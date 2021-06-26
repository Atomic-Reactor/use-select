import { render } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import {
    SDK,
    store,
    StoreProvider,
    StateUser,
    StateChanger,
} from './components';
import { mount } from './enzyme';

test('store init', async () => {
    expect(store.getState()).toMatchObject({
        TestDomain: {
            value: 'initial',
        },
    });
});

test('useReduxState() no dispatch', async () => {
    const reduxUser = mount(<StoreProvider>
        <StateUser />
    </StoreProvider>);
    expect(reduxUser.text()).toEqual('initial');
});

test('useReduxState() and useHandle() dispatch update', async () => {
    let reduxUser, changer;
    reduxUser = document.createElement('div');

    await ReactTestUtils.act(async () => {
        // the subscribing component
        ReactDOM.render(
            <StoreProvider>
                <StateUser />
            </StoreProvider>,
            reduxUser,
        );

        // dispatches change through handle
        changer = mount(<StateChanger />);
        await changer.find('button').simulate('click')
    });

    expect(reduxUser.innerHTML).toEqual('updated');
    ReactDOM.unmountComponentAtNode(reduxUser);
});
