import React from 'react'
import { shallow, mount } from 'enzyme';
import CheckAccountComponent from '../components/checkAccountComponent'
import '../setupTests'
import {Form, Button} from 'react-bootstrap';
  
describe('<CheckAccountComponent/>', () => {
    it('renders the page', () => {
        const editor = shallow(<CheckAccountComponent/>);
        expect(editor.find('div').length).toEqual(6);
    })

    it('renders a header', () => {
        const editor = shallow(<CheckAccountComponent/>);
        expect(editor.find('h1').length).toEqual(1);
    })

    it('renders a header with Forgot Password Title', () => {
        const editor = shallow(<CheckAccountComponent/>);
        const expected = '<h1>Forgot Password</h1>'
        const output = editor.find('h1').html()
        expect(output.indexOf(expected) > -1).toEqual(true);
    })

    it('renders a form in the page', ()=>{
        const editor = shallow(<CheckAccountComponent/>)
        expect(editor.find(Form).length).toEqual(1)
    })

    it('renders a button to change password in the page', ()=>{
        const editor = shallow(<CheckAccountComponent/>)
        expect(editor.find(Button).length).toEqual(1)
    })

    it('renders no error msg when theres no error', ()=>{
        const editor = shallow(<CheckAccountComponent/>)
        expect(editor.find('li').length).toEqual(0)
    })

    it('renders error msg when theres error', ()=>{
        const editor = shallow(<CheckAccountComponent/>)
        editor.setState({
            'error': "true"
        })
        const errorExpected = '<li class="form-error-msg">Invalid Email/The Email does not exist!</li>'
        const output = editor.find('li').html()
        expect(editor.find('li').length).toEqual(1)
        expect(errorExpected.indexOf(output) > -1).toEqual(true);
    })
});