import React, {useEffect, useState} from "react";
import "./style.css";
import alarm from "../../assets/alarm.mp3";

/**
 * Experimental Pomodoro Timer
 * @TODO Issue #29
 *
 */

export default function PomodoroDashboard() {
    const [sessionLength, setSessionLength] = useState(2);
    const [breakLength, setBreakLength] = useState(1);
    const [timerLabel, setTimerLabel] = useState('Session');
    const [secondsLeft, setSecondsLeft] = useState(2 * 60);
    const [timerRunning, setTimerRunning] = useState(false);

    const playSound = async  () => {
        // Play and pause the audio
        let audio = new Audio(alarm);
        await audio.play();

        setTimeout(() => audio.pause(), 1400);
    }

    let minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;

    useEffect(() => {
            const handleSwitch = () => {
                if (timerLabel === 'Session') {
                    setTimerLabel('Break');
                    setSecondsLeft(breakLength * 60);
                } else if (timerLabel === 'Break') {
                    setTimerLabel('Session');
                    setSecondsLeft(sessionLength * 60);
                }
            }

            let countdown = null;
            if (timerRunning && secondsLeft > 0) {
                countdown = setInterval(() => {
                    setSecondsLeft(secondsLeft - 1);
                }, 1000);
            } else if (timerRunning && secondsLeft === 0) {
                countdown = setInterval(() => {
                    setSecondsLeft(secondsLeft - 1);
                }, 1000);
                playSound();
                handleSwitch();
            } else {
                clearInterval(countdown);
            }
            return () => clearInterval(countdown);
        },
        [timerRunning, secondsLeft, timerLabel, breakLength, sessionLength]);

    const handleStart = () => {
        playSound();
        setTimerRunning(true);
    }

    const handleStop = () => {
        playSound();
        setTimerRunning(false);
    }

    const handleReset = () => {
        setSessionLength(25);
        setBreakLength(5);
        setSecondsLeft(25 * 60);
        setTimerLabel('Session');
        setTimerRunning(false);
    }

    return (
        <div>
            <h2 id='timer-label'>{timerLabel}</h2>
            <h3 id='time-left'>
                {minutes < 10 ? ("0" + minutes).slice(-2) : minutes}:{seconds < 10 ? ("0" + seconds).slice(-2) : seconds}
            </h3>

            <button
                id='start_stop'
                onClick={timerRunning ? handleStop : handleStart}
            >
                Start/Stop
            </button>
            <button
                onClick={handleReset}
                id='reset'
            >
                Reset
            </button>
        </div>
    )
}