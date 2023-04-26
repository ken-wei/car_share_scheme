import React from 'react'
import { shallow, mount } from 'enzyme';
import IssueReportComponent from '../components/IssueReportComponent'
import '../setupTests'
import MaterialTable from 'material-table';
  
describe('<IssueReportComponent/>', () => {
    it('renders the page', () => {
        const editor = shallow(<IssueReportComponent/>);
        expect(editor.find('div').length).toEqual(1);
    })

    it('renders the correct div in page', () => {
        const editor = shallow(<IssueReportComponent/>);
        expect(editor.find('div.issue-report').length).toEqual(1);
    })

    it('renders a table in page', () => {
        const editor = shallow(<IssueReportComponent/>);
        expect(editor.find(MaterialTable).length).toEqual(1);
    })
})