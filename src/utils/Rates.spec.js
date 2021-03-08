import { generateGraphData } from './Rates.js'
import { TestScheduler } from 'jest';

describe('Rates', () => {
  let rates = [
    {
      day: '2021-01-01',
      mean: 690,
      low: 68,
      high: 1366
    },
    {
      day: '2021-01-02',
      mean: 690,
      low: 68,
      high: 1366
    },
    {
      day: '2021-01-03',
      mean: 690,
      low: 68,
      high: 1366
    }
  ]
  test('map correctly', () => {
    let lineOption = generateGraphData(rates);
    expect(lineOption).toStrictEqual({
      lines: [{
        color: 'red',
        data: [{
          x: '2021-01-01',
          y: 690
        }, {
          x: '2021-01-02',
          y: 690
        },
        {
          x: '2021-01-03',
          y: 690
        }],
        label: 'Mean'
      }, {
        color: 'blue',
        data: [{
          x: '2021-01-01',
          y: 68
        }, {
          x: '2021-01-02',
          y: 68
        }, {
          x: '2021-01-03',
          y: 68
        }],
        label: 'Low'
      }, {
        color: 'green',
        data: [{
          x: '2021-01-01',
          y: 1366
        },
        {
          x: '2021-01-02',
          y: 1366
        }, {
          x: '2021-01-03',
          y: 1366,
        }],
        label: 'High'
      }],
      xAxis: [
        '2021-01-01',
        '2021-01-02',
        '2021-01-03'
      ],
      xFormat: '%Y-%m-%d',
      yFormat: '$,.2s',
      yRange: [0, 1755.4]
    });
  });

  test('empty data', () => {
    let lineOption = generateGraphData([]);
    expect(lineOption).toBe(null);
  })

  test('data with nulls', () => {
    let lineOption = generateGraphData([{
      day: '2021-01-01',
      mean: null,
      low: null,
      high: null
    }]);
    expect(lineOption).toBe(null);
  })
});