import { useState, useRef, useEffect } from "react";
import "./App.css";

type TimerState = { state: "NOT_SOLVING"; lastSolveTime: number } | { state: "SOLVING"; startTime: number };
type Solve = { time: number };

function Timer() {
  const [timerState, setTimerState] = useState<TimerState>({
    state: "NOT_SOLVING",
    lastSolveTime: 0,
  });
  const [time, setTime] = useState<number>(Date.now());
  const [solves, setSolves] = useState<Solve[]>([]);
  const intervalID = useRef<number | null>(null);

  let timerColor;
  if (timerState.state === "NOT_SOLVING" || timerState.state === "SOLVING") {
    timerColor = "black";
  } else if (timerState.state === "preReady") {
    timerColor = "red";
  } else if (timerState.state === "ready") {
    timerColor = "green";
  }

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === " " && timerState.state === "SOLVING") {
        stopTimer();
      }
      if (event.key === " " && timerState.state === "NOT_SOLVING") {
        startTimer();
      }
    };

    function stopTimer() {
      if (intervalID.current) {
        clearInterval(intervalID.current);
        intervalID.current = null;
        if (timerState.state === "SOLVING") {
          const solveTime = time - timerState.startTime;
          setTimerState({ state: "NOT_SOLVING", lastSolveTime: solveTime });
          setSolves([...solves, { time: solveTime }]);
        }
      }
    }
    function startTimer() {
      if (intervalID.current) {
        return;
      }
      setTimerState({ state: "SOLVING", startTime: Date.now() });
      intervalID.current = setInterval(() => setTime(Date.now()));
    }

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [timerState, time]);

  function formatNum(num: number): string {
    return (num / 1000).toFixed(2);
  }

  return (
    <div>
      {timerState.state === "SOLVING" && (
        <div>
          <h1 style={{ color: timerColor }}>{formatNum(time - timerState.startTime)}</h1>
        </div>
      )}
      {timerState.state === "NOT_SOLVING" && (
        <>
          <h1 style={{ color: timerColor }}>{formatNum(solves.length != 0 ? timerState.lastSolveTime : 0)}</h1>
          <h2>
            <button onClick={() => setSolves([])}>Clear Solves</button>
            <ul>
              {solves.map((solve) => (
                <li>{formatNum(solve.time)}</li>
              ))}
            </ul>
          </h2>
        </>
      )}
    </div>
  );
}

export default Timer;
