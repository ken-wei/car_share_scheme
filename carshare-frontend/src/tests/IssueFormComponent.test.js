import React from 'react'
import { shallow, mount } from 'enzyme';
import IssueFormComponent from '../components/IssueFormComponent'
import '../setupTests'
  
describe('<IssueFormComponent/>', () => {
    it('renders the page', () => {
        const editor = shallow(<IssueFormComponent/>);
        expect(editor.find('div').length).toEqual(1);
    })

    it('renders a header displaying Report Issue Form', () => {
        const editor = shallow(<IssueFormComponent/>);
        const expected  = '<h2>Report Issue Form</h2>'
        const realOutput = editor.find('h2').html()
        expect(realOutput.indexOf(expected) > -1).toEqual(true);
    })

    it('renders a select button for picking car to be reported', () => {
        const editor = shallow(<IssueFormComponent/>);
        expect(editor.find('select').length).toEqual(1);
    })

    it('renders some labels to show details', () => {
        const editor = shallow(<IssueFormComponent/>);
        expect(editor.find('label').length).toEqual(5);
    })

    it('renders a legend to pick category', () => {
        const editor = shallow(<IssueFormComponent/>);
        expect(editor.find('legend').length).toEqual(1);
    })

    it('show no error msg when no error', () => {
        const editor = shallow(<IssueFormComponent/>);
        expect(editor.find('p').length).toEqual(0);
    })

    it('show msg when there is error', () => {
        const editor = shallow(<IssueFormComponent/>);
        editor.setState({'error': true})
        expect(editor.find('p').length).toEqual(1);
    })
})