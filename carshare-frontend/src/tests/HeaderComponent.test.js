import React from 'react'
import { shallow, mount } from 'enzyme';
import HeaderComponent from '../components/HeaderComponent'
import '../setupTests'
import {Navbar, Nav} from 'react-bootstrap';
  
describe('<HeaderComponent/>', () => {
    it('renders the page', () => {
        const editor = shallow(<HeaderComponent/>);
    })
})