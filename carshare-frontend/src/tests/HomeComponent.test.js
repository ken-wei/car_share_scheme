import React from 'react'
import { shallow, mount } from 'enzyme';
import HomeComponent from '../components/HomeComponent'
import '../setupTests'
import {Button} from 'react-bootstrap';
import MapComponent from '../components/MapComponent'
  
describe('<HomeComponent />', () => {
    it('renders the page', () => {
        const editor = shallow(<HomeComponent />);
        expect(editor.find('div').length).toEqual(2);
    })
    it('renders Map Component', () => {        
        const editor = shallow(<HomeComponent />);
        expect(editor.find(MapComponent).length).toEqual(1);
    })

    it('renders the correct Map Component Elements' , () =>{
        const expected = '<div id="map-component" style="height:40vh;width:100%"><div style="width:100%;height:100%;margin:0;padding:0;position:relative"><div style="width:100%;height:100%;left:0;top:0;margin:0;padding:0;position:absolute"></div><div style="width:50%;height:50%;left:50%;top:50%;margin:0;padding:0;position:absolute"><div style="width:100%;height:100%;left:0;top:0;margin:0;padding:0;position:absolute"><div style="width:0;height:0;left:0;top:0;background-color:transparent;position:absolute"><div><div class="pin bounce" style="cursor:pointer" title="You"></div><div class="pulse"></div></div></div></div></div></div></div>'
        const editor = shallow(<HomeComponent/>);
        const realOutput = editor.find(MapComponent).html();
        expect(realOutput.indexOf(expected) > -1).toEqual(true);
    })

    it('renders the booking table', () => {
        const editor = shallow(<HomeComponent />);
        expect(editor.find('div.home-booking-table').length).toEqual(1)
    })
});