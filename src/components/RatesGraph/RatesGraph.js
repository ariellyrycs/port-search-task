import React, { useState, useEffect } from 'react';
import { generateGraphData } from '../../utils/lineGraphUtil';
import { Spinner } from 'react-bootstrap';
import LineGraph from './LineGraph.js'


export default function RatesGraph({origin, destination}) {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const data = await fetch(`/prod/rates?origin=${origin}&destination=${destination}`)
          .then(res => res.json())
        if(data.message) throw new Error(data.message);
        setRates(generateGraphData(data));
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
