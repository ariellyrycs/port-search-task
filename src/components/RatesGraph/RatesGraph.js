import React, { useState, useEffect } from 'react';
import { generateGraphData } from '../../utils/Rates.js';
import { getDetailRates } from '../../services/Rates.js';
import { Spinner } from 'react-bootstrap';
import LineGraph from './LineGraph.js'


export default function RatesGraph({origin, destination}) {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const json = await getDetailRates(origin, destination);
        if(json.message) throw new Error(json.message);
        setRates(generateGraphData(json));
      } catch(e) {
        setRates(null);
      }
      setLoading(false);
    };
    if(origin && destination) {
      fetchRates();
    }
  }, [origin, destination]);
  

  return <>
    {loading ? <Spinner animation="border" variant="primary" className="position-absolute"/> : rates === null && <div className="position-absolute">There is no available Data</div>}
    <LineGraph data={rates} className={'h-100 w-100' + (rates === null || loading ? ' invisible': '')}/>
  </>
}
