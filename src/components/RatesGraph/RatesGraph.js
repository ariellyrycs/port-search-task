import React, { useState, useEffect, useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import D3Component from './GraphContruct.js';
import { debounce } from 'throttle-debounce';

let vis = null; 

export default function RatesGraph({origin, destination}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(700);

  const graphContainerRef = useRef(null);

  useEffect(() => {
    const getRates = async () => {
      setLoading(true);
      try {
        const data = await fetch(`/prod/rates?origin=${origin}&destination=${destination}`)
          .then(res => res.json())
        if(data.message) throw new Error(data.message);
        setData(data);
      } catch(e) {
        setData([]);
      }
      setLoading(false);
    };
    if(origin && destination) {
      getRates();
    }
  }, [origin, destination]);
  
  useEffect(() => {
    if(data && data.length) {
      if(vis) {
        vis.updateLines(data);
      } else {
        const currElement = graphContainerRef.current;
        vis = new D3Component(graphContainerRef.current, {
          data,
          width: currElement.offsetWidth,
          height: currElement.offsetHeight,
        });
      }
    }
  }, [ data ]);


  useEffect(() => {
    const handleResize = debounce(500, () => {
      const currElement = graphContainerRef.current;
      vis.resize({
        width: currElement.offsetWidth,
        height: currElement.offsetHeight,
      })
    });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <>
    {loading ? <Spinner animation="border" variant="primary" className="position-absolute"/> : data.length === 0 && <div className="position-absolute">There is no available Data</div>}
    {<div ref={graphContainerRef} className={'h-100 w-100' + (data.length === 0 || loading ? ' invisible': '')}></div>}
  </>
}
