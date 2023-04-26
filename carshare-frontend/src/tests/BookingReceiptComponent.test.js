import React from 'react'
import { shallow, mount } from 'enzyme';
import BookingReceiptComponent from '../components/BookingReceiptComponent'
import '../setupTests'
import {Button, ButtonGroup} from 'react-bootstrap';
import MaterialTable, { MTableToolbar }   from 'material-table';

describe('<BookingReceiptcomponent />', () => {
    it('renders the page', () => {
        const editor = shallow(<BookingReceiptComponent />);
        expect(editor.find('div').length).toEqual(1);
    })

    it('renders the correct div in page', () => {
        const editor = shallow(<BookingReceiptComponent />);
        expect(editor.find('div.my-booking-page').length).toEqual(1);
    })
    
    it('render a table', () =>{
        const editor = shallow(<BookingReceiptComponent />);
        expect(editor.find(MaterialTable).length).toEqual(1);
    })
});