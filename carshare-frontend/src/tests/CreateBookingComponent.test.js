import React from 'react'
import { shallow, mount } from 'enzyme';
import CreateBookingComponent from '../components/CreateBookingComponent'
import '../setupTests'
import {Table, Button} from 'react-bootstrap';
  
describe('<CreateBookingComponent/>', () => {
    const location = { location: { state: 'C001' } }
    it('renders the page', () => {
        const editor = shallow(<CreateBookingComponent location={location}/>);
        expect(editor.find('div').length).toEqual(3);
    })

    it('renders no table when detail not loaded', () => {
        const editor = shallow(<CreateBookingComponent location={location}/>);
        expect(editor.find(Table).length).toEqual(0);
    })

    it('renders a table when detail loaded', () => {
        const editor = shallow(<CreateBookingComponent location={location}/>);
        editor.setState({'carDetailLoaded':true})
        expect(editor.find(Table).length).toEqual(1);
    })

    it('renders Booking Hours and Total Price headers when detail loaded', () => {
        const editor = shallow(<CreateBookingComponent location={location}/>)
        editor.setState({'carDetailLoaded':true})
        expect(editor.find('h5').length).toEqual(2)
    })

    it('renders 3 Buttons when detail loaded', () => {
        const editor = shallow(<CreateBookingComponent location={location}/>)
        editor.setState({'carDetailLoaded':true})
        expect(editor.find(Button).length).toEqual(3)
    })

    it('if error exists render error <li>', ()=> {
        const editor = shallow(<CreateBookingComponent location={location}/>)
        editor.setState({'carDetailLoaded':true, 'bookingDetailLoaded':true, 'error':"true"})
        expect(editor.find('li.form-error-msg').length).toEqual(1)
    })

})