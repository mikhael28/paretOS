import React, {useEffect, useState} from "react";
import "./style.css";
import alarm from "../../assets/alarm.mp3";

/**
 * Experimental Pomodoro Timer
 * @TODO Issue #29
 *
 */

export default function PomodoroDashboard() {
    const defaultBreakTime = { seconds: 0, minutes: 5 };
    const defaultWorkTime = {seconds: 0, minutes: 25};

    // timer is running
    const [isPlaying, setIsPlaying] = useState(false);
    // time
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    // type of timer - break or work
    const [isBreak, setIsBreak] = useState(false);
    const [timerHeading, setTimerHeading] = useState("Work");

    useEffect(() => {
        if(isPlaying) tick();
    }, [isPlaying]);


    const resetState = () => {
        setMinutes(25);
        setSeconds(0);
        setIsBreak(false);
        setTimerHeading('Work');
        setIsPlaying(false);
    };

    const playSound = async  () => {
        // Play and pause the audio
        let audio = new Audio(alarm);
        await audio.play();

        setTimeout(() => audio.pause(), 1400);
    }

    const tick = () => {
        if(!isPlaying) return;

        console.log('tick');

        console.log(seconds, minutes);
        if (seconds > 0) {
            setSeconds(prevSeconds => prevSeconds - 1);
        } else if (minutes > 0) {
            console.log(seconds);
            console.log(minutes);
            setSeconds(59);
            setMinutes(prevMinutes => prevMinutes - 1);
        } else {
            playSound();
            handleBreak();
        }

        setTimeout(tick, 1000);
    };

    const handleBreak = () => {
        if(isBreak) {
            setIsPlaying(true);
            setIsBreak(false);
            setSeconds(defaultBreakTime.seconds);
            setMinutes(defaultBreakTime.minutes);
            setTimerHeading('Break');
        } else {
            setIsBreak(true);
            setTimerHeading('Work');
            setMinutes(defaultWorkTime.minutes);
            setSeconds(defaultWorkTime.seconds);
        }
    }

    const onToggle = () => {
        if(isPlaying) setIsPlaying(false)
        else setIsPlaying(true);
    };

    return (
        <div>
            <h1>{timerHeading} - {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}</h1>

            <button onClick={onToggle}>Toggle</button>
            <button onClick={resetState}>Reset</button>
        </div>
    )
}