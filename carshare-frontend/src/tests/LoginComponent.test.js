import React from 'react'
import { shallow, mount } from 'enzyme';
import { Form, Button } from 'react-bootstrap';
import LoginComponent from '../components/LoginComponent'
import '../setupTests'
  
describe('<LoginComponet/>', () => {
    it('renders the page', () => {
        const editor = shallow(<LoginComponent/>);
        expect(editor.find('div').length).toEqual(7);
    })

    it('renders a form in the page', () => {
        const editor = shallow(<LoginComponent/>);
        expect(editor.find(Form).length).toEqual(1);
    })

    it('renders a header to show login page in the page', () => {
        const editor = shallow(<LoginComponent/>);
        const expected  = '<h1>Sign In</h1>'
        const realOutput = editor.find('h1').html()
        expect(realOutput.indexOf(expected) > -1).toEqual(true);
    })

    it('renders 2 input for the form in the page one for username other for password'
    , () => {
        const editor = shallow(<LoginComponent/>);
        expect(editor.find('div.inputWithIcon').length).toEqual(2);
    })

    it('render 1 submit button for the page'
    , () => {
        const editor = shallow(<LoginComponent/>);
        expect(editor.find(Button).length).toEqual(1);
    })

    it('show no error msg when no error', () => {
        const editor = shallow(<LoginComponent/>);
        expect(editor.find('li.form-error-msg').length).toEqual(0);
    })

    it('show msg when there is error', () => {
        const editor = shallow(<LoginComponent/>);
        editor.setState({'error': 'true'})
        expect(editor.find('li.form-error-msg').length).toEqual(1);
    })
})