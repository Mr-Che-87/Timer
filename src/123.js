
import { useState } from 'react';
import PropTypes from 'prop-types';

function HistoryList() {
  const [history, setHistory] = useState([])
 

  
 const onSaveTime = () => {
   const prevHistory = history
    const newTime = `${formatTime(currTimeMin)}:${formatTime(currTimeSec)}:${formatTime(currTimeMs, 'ms')}`
    prevHistory.unshift(newTime)
    setHistory({ history: prevHistory })
  }
  
 const onClearHistory = () => {
  setHistory({history: []});
 }

  return <div className='history-list'>
            <div className='history-list__header'>
              <h3 className='history-list__title'>History</h3>
              <button className='history-list__button' onClick={onSaveTime}>
              Save time
              </button>
              <button className='history-list__button' onClick={onClearHistory}>
              Clear history
              </button>
            </div>
            <ul className="history-list__list">
              <li className="history-list__item">
              Item
             </li>
            </ul>
          </div>
}


function App() {
  const [timer, setTimer] = useState({ running: false,
                                       currTimeMs: 0,
                                       currTimeSec: 0,
                                       currTimeMin: 0,
                                       //watch: null // Добавляем начальное значение для свойства watch
                                      })
  
  const formatTime = (val, ...rest) => {
    let value = val.toString()  //не понял зачем???
    if (value.length < 2) {
      value = '0' + value
    }
    if (rest[0] === 'ms' && value.length < 3) {
      value = '0' + value
    }
    return value
  }
  
  const onStart = () => {
    if (!timer.running) {
      setTimer({ running: true })
      setTimer.watch = setInterval(() => setTimer.step(), 10)
    }
  }
  
  const onStop = () => {
    setTimer({running: false}) //почему нельзя написать setTimer.running: false - ???
    clearInterval(setTimer.watch)
  }
  
  const onReset = () => {
    setTimer({
      currTimeMs: 0,
      currTimeSec: 0,
      currTimeMin: 0,
    })
  }
  
  const step = () => {
    setTimer({currTimeMs: timer.currTimeMs + 10})
    if (timer.currTimeMs >= 1000) {
      setTimer({currTimeSec: timer.currTimeSec + 1})
      setTimer({currTimeMs: 0})
    }
    if (timer.currTimeSec >= 60) {
      setTimer({currTimeMin: timer.currTimeMin + 1})
      setTimer({currTimeSec: 0})
    }
  }

    return (
      <div className='stopwatch'>
        <div className='stopwatch__watch'>
          <span className='stopwatch__watch-unit'>
            {formatTime(timer.currTimeMin)}
          </span>
          :
          <span className='stopwatch__watch-unit'>
            {formatTime(timer.currTimeSec)}
          </span>
          :
          <span className='stopwatch__watch-unit'>
            {formatTime(timer.currTimeMs, 'ms')}
          </span>
        </div>
        <div className='stopwatch__button-block'>
          <button className='stopwatch__button' disabled={timer.running} onClick={onStart}>
            Start
          </button>
          <button className='stopwatch__button' onClick={onReset}>
            Reset
          </button>
          <button className='stopwatch__button' onClick={onStop}>
            Stop
          </button>
        </div>
        <HistoryList {...timer} formatTime={formatTime} /> //{...timer} - не факт
      </div>
    )
}


HistoryList.propTypes = {
  running: PropTypes.bool,
  currTimeMs: PropTypes.number,
  currTimeSec: PropTypes.number,
  currTimeMin: PropTypes.number,
  formatTime: PropTypes.func
}

export default App;
