import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-canvas-mock';
import React from 'react'

React.useLayoutEffect = React.useEffect

configure({ adapter: new Adapter() })
