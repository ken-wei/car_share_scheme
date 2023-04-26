import React from 'react'
import { shallow, mount } from 'enzyme';
import ForgotPasswordComponent from '../components/ForgotPasswordComponent'
import '../setupTests'
import {Form, Button} from 'react-bootstrap';
  
describe('<ForgotPasswordComponent/>', () => {
    it('renders the page', () => {
        const editor = shallow(<ForgotPasswordComponent location = {location}/>);
        expect(editor.find('div').length).toEqual(8);
    })

    it('renders a correct header', () => {
        const editor = shallow(<ForgotPasswordComponent location = {location}/>);
        const expected = '<h1>Forgot Password</h1>'
        const realOutput = editor.find('h1').html()
        expect(realOutput.indexOf(expected) > -1).toEqual(true);
    })

    it('renders a form', () => {
        const editor = shallow(<ForgotPasswordComponent location = {location}/>);
        expect(editor.find(Form).length).toEqual(1);
    })

    it('renders 3 input for email, password, and password confirmation', ()=>{
        const editor = shallow(<ForgotPasswordComponent location = {location}/>);
        expect(editor.find('div.inputWithIcon').length).toEqual(3);
    })

    it('render 1 submit button',()=>{
        const editor = shallow(<ForgotPasswordComponent location = {location}/>);
        expect(editor.find(Button).length).toEqual(1);
    })

    it('if error exists render error <li>', ()=> {
        const editor = shallow(<ForgotPasswordComponent location={location}/>)
        editor.setState({ 'error':"true"})
        expect(editor.find('li.form-error-msg').length).toEqual(1)
    })
})