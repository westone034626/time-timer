import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [color, setColor] = useState('#ff0000');
  const [targetMinutes, setTargetMinutes] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [isMute, setIsMute] = useState(true);
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    if (value === '') {
      setTargetMinutes(0);
      setCurrentSeconds(0);
    } else {
      setTargetMinutes(parseInt(value, 10));
    }
  };

  useEffect(() => {
    if (!targetMinutes) return;
    let interval = setInterval(() => {
      setCurrentSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      setCurrentSeconds(0);
      clearInterval(interval);
    };
  }, [targetMinutes]);
  const playAudio = async () => {
    try {
      var audio = new Audio('wrist-watch.mp3');
      await audio.play();
    } catch (error) {
      throw Error(error);
    }
  };
  useEffect(() => {
    if (!targetMinutes) return;
    if (currentSeconds === targetMinutes * 60) {
      !isMute && playAudio();
    }
  }, [currentSeconds, isMute]);
  return (
    <div
      style={{
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          paddingTop: '50px',
          display: 'flex',
          flexDirection: 'column',
          width: 'max-content',
          margin: '0 auto',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          목표 시간(분):{' '}
          <input onChange={onChange} value={targetMinutes}></input>
          <button
            onClick={() => {
              setCurrentSeconds(0);
              setTargetMinutes(0);
            }}
          >
            리셋
          </button>
          <button
            onClick={() => {
              setIsMute((prev) => !prev);
            }}
          >
            {isMute ? '알림 사운드 활성화하기' : '알림 음소거하기'}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          색 선택:{' '}
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
            }}
          />
        </div>
      </div>
      <h1>{`목표시간: ${targetMinutes}분`}</h1>
      <h1>{`경과시간: ${
        Math.floor(currentSeconds / 60)
          ? `${Math.floor(currentSeconds / 60)}분`
          : ''
      } ${currentSeconds % 60}초`}</h1>

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
            background: `conic-gradient(white ${
              (currentSeconds / 60 / targetMinutes) * 360 || 0
            }deg, ${color} ${
              (currentSeconds / 60 / targetMinutes) * 360 || 0
            }deg)`,
            borderRadius: '50%',
            border: '1px solid black',
          }}
        ></div>
      </div>
    </div>
  );
}
export default App;
