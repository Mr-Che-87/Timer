import React from 'react';


//СЕКУНДОМЕР. Реализуйте таймер, который можно запускать, обнулять, останавливать, выводить значения кругов и очищать историю кругов.

import { useState } from 'react';
import PropTypes from 'prop-types';


function HistoryList({ formatTime, currTimeMin, currTimeSec, currTimeMs }) {  //передать деструктуризированные пропсы из App - в обяз!
  const [history, setHistory] = useState([]);

  const onSaveTime = () => {
    const newTime = `${formatTime(currTimeMin)}:${formatTime(currTimeSec)}:${formatTime(currTimeMs, 'ms')}`; //записываем в новую переменную итоговое время из formatTime
    
    setHistory(prevHistory => [...prevHistory, newTime]);  //функция обратного вызова, передаваемая в setHistory. Она получает предыдущее состояние history в качестве аргумента (prevHistory), а затем возвращает новое состояние. 
    //prevHistory - название может быть любым, реакт итак помнит, что аргумент функции etHistory - это history. То есть переменной prevHistory присваивается значение history
  };

  const onClearHistory = () => {
    setHistory([]);  //просто обнуляет массив, который затем передаётся в див
  };

  return (
    <div className='history-list'>
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
        { 
        history.map((item, index) => (
          <li key={index} className="history-list__item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [timer, setTimer] = useState({
    running: false,
    currTimeMs: 0,
    currTimeSec: 0,
    currTimeMin: 0,
    watch: null  //добавляем новое свойство "слежения"
  });


//Функция формирования строки времени под определённый формат. Принимает 2 аргумента: val - значение конкретного уровня(мс, сек или мин) + unit - следующий уровень(изначально пустой).
   //ЗА СЧЁТ ЧЕГО АРГУМЕНТЫ ФУНКЦИИ FORMATTIME (VAL, UNIT)  СВЯЗЫВАЮТСЯ С ТЕКУЩИМ ЗНАЧЕНИЕМ ПЕРЕМЕННОЙ TIMER??? НУ ИЛИ НЕ TIMER, А  В ЦЕЛОМ КАК ПОТОМ ЗНАЧЕНИЕ VAL И UNIT ПЕРЕДАЁТСЯ В ЛОГИКУ ПО ЦЕПОЧКЕ? 
  const formatTime = (val, unit = '') => {
    let value = val.toString(); //НЕ ПОНЯЛ ЗАЧЕМ??? МЫ ЖЕ ИТАК В КОДЕ НИЖЕ ЗАДАЁМ КАК ДОЛЖНО ПРЕОБРАЗОВЫВАТЬСЯ ЧИСЛО????
     if (value.length < 2) {
      value = '0' + value;
    }
     if (unit === 'ms' && value.length < 3) {
      value = '0' + value;
    }
    return value;
  };

  
  const onStart = () => {
    //если таймер не запущен, то  запускаем его и записываем значение в intervalId, которое передаётся в watch:
    if (!timer.running) {
      const intervalId = setInterval(() => step(), 10); //внутри JS-функции setInterval - функция step() обновляет состояние таймера, увеличивая время на 10 миллисекунд
      //ДАЛЕЕ STEP НИГДЕ НЕ ПРОПИСЫВАЕТСЯ И НЕ ВЫЗЫВАЕТСЯ. STEP - ЭТО РАЗВЕ КАКОЙ-ТО БАЗОВЫЙ СИНТАКСИС ДЛЯ SETINTERVAL?
      setTimer(prevState => ({
        ...prevState,
        running: true,
        watch: intervalId 
      }));
    }
  };
  
  const onStop = () => {
    //Если таймер запущен, то очищаем текущее значение watch, а setTimer стоппиться на предыдущем значении
    if (timer.running) { 
      clearInterval(timer.watch);
      //Функция setTimer получает предыдущее состояние в качестве аргумента и возвращает новое состояние, в котором running устанавливается в false. 
      setTimer(prevState => ({
        ...prevState,
        running: false
      }));
      // Я ПРАВИЛЬНО ПОНЯЛ, ЧТО НЕСМОТРЯ НА ОЧИСТКУ ВЫШЕ ЗНАЧЕНИЕ несмотря на очистку выше, ЗНАЧЕНИЕ prevState ВСЁ РАВНО ЗАПОМИНАЕТСЯ????
    }
  };


  const onReset = () => {
    setTimer({
      currTimeMs: 0,
      currTimeSec: 0,
      currTimeMin: 0
    });
    clearInterval(timer.watch);
  };

  const step = () => {
    setTimer(prevState => {
      let { currTimeMs, currTimeSec, currTimeMin } = prevState;
      currTimeMs += 10;  
      if (currTimeMs >= 1000) {
        currTimeSec++;  
        currTimeMs = 0;
      }
      if (currTimeSec >= 60) {
        currTimeMin++;
        currTimeSec = 0;
      }
      return {
        ...prevState,
        currTimeMs,
        currTimeSec,
        currTimeMin
      };
    });
  };

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
      <HistoryList {...timer} formatTime={formatTime} />
    </div>
  );
}

HistoryList.propTypes = {
  running: PropTypes.bool,
  currTimeMs: PropTypes.number,
  currTimeSec: PropTypes.number,
  currTimeMin: PropTypes.number,
  formatTime: PropTypes.func
}

export default App;
