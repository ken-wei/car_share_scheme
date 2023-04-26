import React from 'react'
import { shallow, mount } from 'enzyme';
import { Button } from 'react-bootstrap';
import PayWithPayPalComponent from '../components/PayWithPayPal'
import '../setupTests'
  
describe('<PayWithPayPalComponent/>', () => {
    it('renders the page', () => {
        const editor = shallow(<PayWithPayPalComponent/>);
        expect(editor.find('div').length).toEqual(4);
    })

    it('renders the app div', () => {
        const editor = shallow(<PayWithPayPalComponent/>);
        expect(editor.find('div.app').length).toEqual(1);
    })

    it('renders the input box div', () => {
        const editor = shallow(<PayWithPayPalComponent/>);
        expect(editor.find('div.input-box').length).toEqual(1);
    })
})