import React from 'react'
import { shallow, mount } from 'enzyme';
import { Button } from 'react-bootstrap';
import ReturnCarComponent from '../components/ReturnCarComponent'
import '../setupTests'
import MaterialTable from 'material-table';
  
describe('<ReturnCarComponent/>', () => {
    const location = {state: [
                {'parkId': 1231231},'C001',12312412312
            ]
        
    }
    it('renders the page', () => {
        const editor = shallow(<ReturnCarComponent location={location}/>);
        expect(editor.find('div').length).toEqual(1);
    })

    it('rendering the correct div', () => {
        const editor = shallow(<ReturnCarComponent location={location}/>);
        expect(editor.find('div.return-car-component').length).toEqual(1);
    })

    it('renders a table at the page', () => {
        const editor = shallow(<ReturnCarComponent location={location}/>);
        expect(editor.find(MaterialTable).length).toEqual(1);
    })
})