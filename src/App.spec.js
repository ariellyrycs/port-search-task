import Enzyme, { shallow } from 'enzyme';
import React from 'react';
import { getAvailableRates } from './services/Rates.js';
import RatesGraph from './components/RatesGraph/RatesGraph.js';
import App from './App';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

jest.mock('./services/Rates.js');

const runAllPromises = () => new Promise(setImmediate);

test('App retrive all locations', async () => {
  let useEffect = jest.spyOn(React, 'useEffect');
  const mockUseEffect = () => {
    useEffect.mockImplementationOnce(f => f());
  };
  mockUseEffect();
  getAvailableRates.mockResolvedValueOnce([
    {
      code: 'NOOSL',
      name: 'Oslo'
    },
    {
      code: 'CNSGH',
      name: 'Shanghai'
    },
    {
      code: 'CNSTG',
      name: 'Shantou'
    }
  ]);

  const component = shallow(<App />);
  await runAllPromises();
  component.update();
  const selects = component.find('[as="select"]');
  const options1 = selects.at(0).find('option');
  const options2 = selects.at(1).find('option');
  expect(options1.at(0).text()).toBe('Oslo');
  expect(options1.at(1).text()).toBe('Shanghai');
  expect(options1.at(2).text()).toBe('Shantou');
  expect(options2.at(0).text()).toBe('Oslo');
  expect(options2.at(1).text()).toBe('Shanghai');
  expect(options2.at(2).text()).toBe('Shantou');
  const rgComonent = component.find(RatesGraph).props();
  expect(rgComonent.origin).toBe('NOOSL');
  expect(rgComonent.destination).toBe('CNSGH');
});