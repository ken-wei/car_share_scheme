import React from 'react'
import { shallow, mount } from 'enzyme';
import { Form, Button } from 'react-bootstrap';
import RegisterComponent from '../components/RegisterComponent'
import '../setupTests'
  
describe('<RegisterComponet/>', () => {
    it('renders the page', () => {
        const editor = shallow(<RegisterComponent/>);
        expect(editor.find('div').length).toEqual(8);
    })

    it('renders a form in the page', () => {
        const editor = shallow(<RegisterComponent/>);
        expect(editor.find(Form).length).toEqual(1);
    })

    it('renders a header to show register page in the page', () => {
        const editor = shallow(<RegisterComponent/>);
        const expected  = '<h1>Sign Up</h1>'
        const realOutput = editor.find('h1').html()
        expect(realOutput.indexOf(expected) > -1).toEqual(true);
    })

    it('renders 2 input for the form in the page one for username, password, and name'
    , () => {
        const editor = shallow(<RegisterComponent/>);
        expect(editor.find('div.inputWithIcon').length).toEqual(3);
    })

    it('render 1 submit button for the page'
    , () => {
        const editor = shallow(<RegisterComponent/>);
        expect(editor.find(Button).length).toEqual(1);
    })

    it('show no error msg when no error', () => {
        const editor = shallow(<RegisterComponent/>);
        expect(editor.find('div.form-error-msg').length).toEqual(0);
    })

    it('show msg when there is error', () => {
        const editor = shallow(<RegisterComponent/>);
        editor.setState({'error': 'true'})
        expect(editor.find('div.form-error-msg').length).toEqual(1);
    })
})