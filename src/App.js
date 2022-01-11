import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [color, setColor] = useState('#ff0000');
  const [targetMinutes, setTargetMinutes] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [isMute, setIsMute] = useState(true);
  const [isStart, setIsStart] = useState(false);
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    if (value === '') {
      setTargetMinutes(0);
      setCurrentSeconds(0);
    } else if (value >= 60) {
      setTargetMinutes(60);
      setCurrentSeconds(60 * 60);
      setIsStart(false);
    } else {
      setTargetMinutes(parseInt(value, 10));
      setCurrentSeconds(parseInt(value, 10) * 60);
      setIsStart(false);
    }
  };

  useEffect(() => {
    if (!targetMinutes || !isStart) return;
    let interval = setInterval(() => {
      setCurrentSeconds((prev) => {
        return !prev ? prev : prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [targetMinutes, isStart]);
  const playAudio = async () => {
    try {
      var audio = new Audio('/time-timer/wrist-watch.mp3');
      await audio.play();
    } catch (error) {
      throw Error(error);
    }
  };
  useEffect(() => {
    if (!targetMinutes) return;
    if (!currentSeconds) {
      !isMute && playAudio();
    }
  }, [currentSeconds, isMute]);
  return (
    <div
      style={{
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto',
        paddingBottom: '50px',
        paddingLeft: '50px',
        paddingRight: '50px',
      }}
    >
      <div
        style={{
          paddingTop: '50px',
          paddingBottom: '50px',
          display: 'grid',
          gridAutoRows: 'minmax(40px, auto)',
          gridTemplateColumns: '1fr 1fr 1fr',
          alignItems: 'center',
          margin: '0 auto',
          gap: '10px',
        }}
      >
        <p
          style={{
            wordBreak: 'keep-all',
            gridRow: '1 / 2',
            gridColumn: '1 / 2',
          }}
        >
          목표 시간(최대 60분):
        </p>
        <input
          list="tickmarks"
          style={{ gridRow: '1 / 2', gridColumn: '2 / 4' }}
          onChange={onChange}
          value={targetMinutes}
          type="range"
          min={0}
          max={60}
          step={5}
        ></input>
        <datalist id="tickmarks">
          {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((o) => (
            <option key={o} value={parseInt(o, 10)}></option>
          ))}
        </datalist>

        <p style={{ gridRow: '2 / 3', gridColumn: '1 / 2' }}> 색 선택:</p>
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
          }}
          style={{ gridRow: '2 / 3', gridColumn: '2 / 4' }}
        />

        <button
          style={{ gridRow: '3 / 4', gridColumn: '1 / 2' }}
          onClick={() => {
            setIsMute((prev) => !prev);
          }}
        >
          {isMute ? '알림 on' : '알림 off'}
        </button>
        <button
          disabled={!targetMinutes}
          style={{ gridRow: '3 / 4', gridColumn: '2 / 4' }}
          onClick={() => {
            isStart
              ? (() => {
                  setCurrentSeconds(0);
                  setTargetMinutes(0);
                  setIsStart(false);
                })()
              : setIsStart(true);
          }}
        >
          {isStart ? '리셋' : '시작'}
        </button>
      </div>
      {/* <h1>{`목표시간: ${targetMinutes}분`}</h1>
      <h1>{`남은시간: ${
        Math.floor(currentSeconds / 60)
          ? `${Math.floor(currentSeconds / 60)}분`
          : ''
      } ${currentSeconds % 60}초`}</h1> */}

      <div
        style={{
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundImage: `url(/time-timer/images/transperant-clock.png)`,
          height: 0,
          paddingBottom: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 0.8,
            background: `conic-gradient(${color} ${
              (currentSeconds / 60) * 6
            }deg, 
            white ${(currentSeconds / 60) * 6}deg)`,
            borderRadius: '50%',
          }}
        ></div>
      </div>
    </div>
  );
}
export default App;
