import Enzyme, { shallow } from 'enzyme';
import { getDetailRates } from '../../services/Rates.js';
import RatesGraph from './RatesGraph.js';
import { generateGraphData } from '../../utils/Rates.js';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

jest.mock('../../services/Rates.js');
jest.mock('../../utils/Rates.js');

let mockLastDeps = {};
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: (f, deps) => {
    const effect = new Error().stack.split('\n')[2]; // <-- to find fileName and lineNumber, since we can't identify by `f`
    if (!mockLastDeps[effect] || deps.some((dep, i) => dep !== mockLastDeps[effect][i])) {
      f();
      mockLastDeps[effect] = deps;
    }
  },
}));

const runAllPromises = () => new Promise(setImmediate);

test('App retrive all locations', async () => {
  getDetailRates.mockResolvedValueOnce([
    {
      day: '2021-01-01',
      mean: 1615,
      low: 1037,
      high: 2436
    },
    {
      day: '2021-01-02',
      mean: 1615,
      low: 1037,
      high: 2436
    },
    {
      day: '2021-01-03',
      mean: 1615,
      low: 1037,
      high: 2436
    }
  ]);
  const generatedData = {
    xAxis: ['2021-01-01', '2021-01-02', '2021-01-03'],
    yRange: [617.3, 2855.7],
    lines: [{
      color: 'red',
      label: 'Mean',
      data: [{
        x: '2021-01-01',
        y: 1615
      }, {
        x: '2021-01-02',
        y: 1615
      }, {
        x: '2021-01-03',
        y: 1615
      }]
    }, {
      color: 'blue',
      label: 'Low',
      data: [{
        x: '2021-01-01',
        y: 1037
      }, {
        x: '2021-01-02',
        y: 1037
      }, {
        x: '2021-01-03',
        y: 1037
      }]
    },
    {
      color: 'green',
      label: 'High',
      data: [{
        x: '2021-01-01',
        y: 2436
      }, {
        x: '2021-01-02',
        y: 2436
      }, {
        x: '2021-01-03',
        y: 2436
      }]
    }],
    yFormat: '$,.2s',
    xFormat: '%Y-%m-%d'
  };

  generateGraphData.mockImplementationOnce(() => generatedData);

  let component = shallow(<RatesGraph origin='NOOSL' destination='CNSGH'/>);
  await runAllPromises();
  component.update();
  expect(component.find('LineGraph').props().data).toBe(generatedData);
});