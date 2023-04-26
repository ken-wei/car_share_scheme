import React from 'react'
import { shallow, mount } from 'enzyme';
import { Button } from 'react-bootstrap';
import MapComponent from '../components/MapComponent'
import '../setupTests'
import GoogleMapReact from 'google-map-react';
  
describe('<MapComponent/>', () => {
    it('renders the page', () => {
        const editor = shallow(<MapComponent/>);
        expect(editor.find('div').length).toEqual(1);
    })

    it('renders a google map in the page', () => {
        const editor = shallow(<MapComponent/>);
        expect(editor.find(GoogleMapReact).length).toEqual(1);
    })

})