import React from 'react'
import { shallow, mount } from 'enzyme';
import { Button } from 'react-bootstrap';
import WalletComponent from '../components/WalletComponent'
import '../setupTests'
  
describe('<WalletComponet/>', () => {
    it('renders the page', () => {
        const editor = shallow(<WalletComponent location={location}/>);
        expect(editor.find('div').length).toEqual(8);
    })

    it('renders add balance button on page', () => {
        const editor = shallow(<WalletComponent location={location}/>);
        expect(editor.find('button.add-balance').length).toEqual(1);
    })

    it('renders a heading title for page', () => {
        const editor = shallow(<WalletComponent location={location}/>);
        const expected = '<h2>Your Wallet</h2>'
        const realOutput = editor.find('h2').html();
        expect(realOutput.indexOf(expected) > -1).toEqual(true);
        
    })

    it('renders no form when user didnt press add balance', () => {
        const editor = shallow(<WalletComponent location={location}/>);
        expect(editor.find('form').length).toEqual(0);
    })

    it('renders a form when user press add balance', () => {
        const editor = shallow(<WalletComponent location={location}/>);
        editor.setState({'toggle':true})
        expect(editor.find('form').length).toEqual(1);
    })

    it('renders a form title  when user press add balance', () => {
        const editor = shallow(<WalletComponent location={location}/>);
        editor.setState({'toggle':true})
        const expected = 'Enter Amount to Top Up'
        const realOutput = editor.find('div.top-up-title').html();
        expect(realOutput.indexOf(expected) > -1).toEqual(true);
    })

    it('renders an input when user press add balance', () => {
        const editor = shallow(<WalletComponent location={location}/>);
        editor.setState({'toggle':true})
        expect(editor.find('input').length).toEqual(1);
    })

    it('renders 2 button one for add one for cancel when user press add balance', () => {
        const editor = shallow(<WalletComponent location={location}/>);
        editor.setState({'toggle':true})
        expect(editor.find('button').length).toEqual(2);
    })
})