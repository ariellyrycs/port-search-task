
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider';

const railStyle = {
  position: 'absolute',
  width: '100%',
  height: 10,
  marginTop: 35,
  borderRadius: 5,
  backgroundColor: '#8B9CB6',
}

const sliderStyle = {  // Give the slider some width
  position: 'relative',
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  height: 80
}

const formatTime = (date) => {
  const currDate = new Date(date);
  const month = currDate.getMonth() + 1,
    day = currDate.getDate();
  return `${currDate.getFullYear()}-${month < 10 ? '0' + month : '' + month}-${day < 10 ? '0' + day : '' + day}`;
};

const Handle = ({
  handle: { id, value, percent },
  getHandleProps
}) => {
  return (
    <div
      style={{
        left: `${percent}%`,
        position: 'absolute',
        marginLeft: -15,
        marginTop: 25,
        zIndex: 2,
        width: 30,
        height: 30,
        border: 0,
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '50%',
        backgroundColor: '#2C4870',
        color: '#333'
      }}
      {...getHandleProps(id)}
    >
      <div style={{ fontFamily: 'Roboto', fontSize: 11, marginTop: -20, marginLeft: '-32px', width: '100px' }}>
        {formatTime(value)}
      </div>
    </div>
  )
}
const Track = ({ source, target, getTrackProps }) => {
  return (
    <div
      style={{
        position: 'absolute',
        height: 10,
        zIndex: 1,
        marginTop: 35,
        backgroundColor: '#546C91',
        borderRadius: 5,
        cursor: 'pointer',
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  )
};


const SliderTime = (props) => {
  return <Slider
    rootStyle={sliderStyle}
    step={1}
    mode={2}
    {...props}
  >
    <Rail>
      {({ getRailProps }) => (
        <div style={railStyle} {...getRailProps()} />
      )}
    </Rail>
    <Handles>
      {({ handles, getHandleProps }) => (
        <div className="slider-handles">
          {handles.map(handle => (
            <Handle
              key={handle.id}
              handle={handle}
              getHandleProps={getHandleProps}
            />
          ))}
        </div>
      )}
    </Handles>
    <Tracks left={false} right={false}>
      {({ tracks, getTrackProps }) => (
        <div className="slider-tracks">
          {tracks.map(({ id, source, target }) => (
            <Track
              key={id}
              source={source}
              target={target}
              getTrackProps={getTrackProps}
            />
          ))}
        </div>
      )}
    </Tracks>
  </Slider>
};

export default SliderTime;