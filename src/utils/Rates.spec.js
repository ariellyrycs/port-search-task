import { generateGraphData, getRange, sortLinesByDate, filterOutOfRangeDates } from './Rates.js'

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
  ];
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
  });

  test('generate range', () => {
    expect(getRange([{
      day: '2021-04-31'
    }, {
      day: '2021-07-02'
    }])).toStrictEqual([1619827200000, 1625184000000]);
  });

  test('not generate range when no sufficient data', () => {
    expect(getRange([])).toStrictEqual([]);
  });

  test('sort rates date by time', () => {
    const data = [
      {
        day: '2021-04-01',
        mean: 690,
        low: 68,
        high: 1366
      },
      {
        day: '2019-01-02',
        mean: 690,
        low: 68,
        high: 1366
      },
      {
        day: '2021-02-03',
        mean: 690,
        low: 68,
        high: 1366
      }
    ];
    sortLinesByDate(data);
    expect(data).toStrictEqual([{
        day: '2019-01-02',
        mean: 690,
        low: 68,
        high: 1366
      }, {
        day: '2021-02-03',
        mean: 690,
        low: 68,
        high: 1366
      }, {
        day: '2021-04-01',
        mean: 690,
        low: 68,
        high: 1366
      }
    ]);
  });

  test('filter by range', () => {
    expect(filterOutOfRangeDates(rates, [1609545600000, 1609545600000]))
      .toStrictEqual([{
        day: '2021-01-02',
        mean: 690,
        low: 68,
        high: 1366
      }]);
  });
});