import React from 'react'
import { shallow, mount } from 'enzyme';
import BookingReceiptDetailComponent from '../components/BookingReceiptDetailComponent'
import '../setupTests'
import {Button} from 'react-bootstrap';
  
describe('<BookingReceiptDetailComponent />', () => {
    const location = { location: {carId: 'C001' }}
    it('renders the page', () => {
        const editor = shallow(<BookingReceiptDetailComponent location={location}/>);
        expect(editor.find('div').length).toEqual(1);
    })

    it('renders the correct div page', () => {
        const editor = shallow(<BookingReceiptDetailComponent location={location}/>);
        expect(editor.find('div.input-box').length).toEqual(1);
    })

    it('renders header in the page', () => {
        const editor = shallow(<BookingReceiptDetailComponent location={location}/>);
        expect(editor.find('h4').length).toEqual(1);
    })

    it('renders header saying greeting to the current user', () => {
        const editor = shallow(<BookingReceiptDetailComponent location={location}/>);
        const beforeLoaded =
            '<div class="input-box" id="booking-receipt"><h4>Hi <span></span>! Thank you for booking.</h4><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-notch" class="svg-inline--fa fa-circle-notch fa-w-16 fa-spin fa-5x loading-icon" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z"></path></svg></div>';
        const beforeLoadedOutput = editor.find('div.input-box').html();
        expect(beforeLoadedOutput.indexOf(beforeLoaded) > -1).toEqual(true);
        editor.setState({
            'username': 'Testing',
            'carDetailLoaded': true,
            'bookingDetailLoaded': true
        })
        const afterLoadedOutput = editor.find('div.input-box').html();
        expect(afterLoadedOutput.indexOf(beforeLoaded) > -1).toEqual(false);
        
    })
});