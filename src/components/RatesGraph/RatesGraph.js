import React, { useState, useEffect } from 'react';
import { generateGraphData, filterOutOfRangeDates, getRange, sortLinesByDate } from '../../utils/Rates.js';
import { getDetailRates } from '../../services/Rates.js';
import { Spinner } from 'react-bootstrap';
import LineGraph from './LineGraph.js';
import SliderTime from './SliderTime.js';

export default function RatesGraph({origin, destination}) {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [domainRange, setDomainRange] = useState([]);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const data = await getDetailRates(origin, destination);
        if(data.message) throw new Error(data.message);
        sortLinesByDate(data);
        const graphData = generateGraphData(data);
        setDomainRange(getRange(data));
        setData(data);
        setRates(graphData);
      } catch(e) {
        setRates(null);
      }
      setLoading(false);
    };
    if(origin && destination) {
      fetchRates();
    }
  }, [origin, destination]);
  
  const updateRange = (range) => {
    const filteredDates = filterOutOfRangeDates(data, range);
    setRates(generateGraphData(filteredDates));
  };


  return <>
    {loading ? <Spinner animation="border" variant="primary" className="position-absolute"/> : rates === null && <div className="position-absolute">There is no available Data</div>}
    <div className={'h-100 w-100 d-flex flex-column' + (rates === null || loading ? ' invisible': '')}>
      <LineGraph data={rates} className="flex-fill w-100"/>
      {rates && (
        <SliderTime 
          domain={domainRange}
          values={domainRange}
          className="w-75"
          onChange={updateRange}
        />
      )}
    </div>
  </>
}
