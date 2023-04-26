import React from 'react'
import { shallow, mount } from 'enzyme';
import AdminSolveIssueComponent from '../components/AdminSolveIssueComponent'
import '../setupTests'
import {Button, Table} from 'react-bootstrap';
  
describe('<AdminSolveIssueComponent />', () => {
    const location = { location: { state: 1234121 } }
    it('renders the page', () => {
        const editor = shallow(<AdminSolveIssueComponent location = {location}/>);
        expect(editor.find('div').length).toEqual(2);
    })

    it('renders no table when issue data are not loaded', () => {
        const editor = shallow(<AdminSolveIssueComponent location = {location}/>);
        expect(editor.find(Table).length).toEqual(0);
    })

    it('renders the table when issue data already loaded', () => {
        const editor = shallow(<AdminSolveIssueComponent location = {location}/>);
        editor.setState({'issueLoaded': true})
        expect(editor.find(Table).length).toEqual(2);
    })

    it('renders the header when issue is not loaded', () => {
        const editor = shallow(<AdminSolveIssueComponent location = {location}/>);
        const expected = '<div class="issue-title"><h2> Issue <span># </span> </h2></div>'
        const realOutput = editor.find('div.issue-title').html();
        expect(realOutput.indexOf(expected) > -1).toEqual(true);
    })

    it('renders the header when issue is loaded', () => {
        const editor = shallow(<AdminSolveIssueComponent location = {location}/>);
        editor.setState({'issueLoaded': true, 'id': 5648660775829504,
            'issue': [{
                'id': 5648660775829504,
                'bookingId': 12340181231,
                'carId': 'C001',
                'category': 'Missing',
                'comment': '',
                'description': 'Help',
                'solved': false,
                'title': 'Car is missing',
                'username': 'testuser@test.com'


        }]})
        const expected = '<div class="issue-title"><h2> Issue <span># 5648660775829504</span> </h2></div>'
        const realOutput = editor.find('div.issue-title').html();
        expect(realOutput.indexOf(expected) > -1).toEqual(true);
    })

    it('renders 2 action option from select button when issue loaded', () => {
        const editor = shallow(<AdminSolveIssueComponent location = {location}/>);
        editor.setState({'issueLoaded': true, 'id': 5648660775829504,
            'issue': [{
                'id': 5648660775829504,
                'bookingId': 12340181231,
                'carId': 'C001',
                'category': 'Missing',
                'comment': '',
                'description': 'Help',
                'solved': false,
                'title': 'Car is missing',
                'username': 'testuser@test.com'


        }]})
        expect(editor.find('select.select-option').length).toEqual(1);
        expect(editor.find('option').length).toEqual(2);
    })

    it('renders no action option from select button when issue not loaded', () => {
        const editor = shallow(<AdminSolveIssueComponent location = {location}/>);
        editor.setState({'issueLoaded': false, 'id': 5648660775829504})
        expect(editor.find('select.select-option').length).toEqual(0);
        expect(editor.find('option').length).toEqual(0);
    })

});