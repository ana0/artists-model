import React, { Fragment, useState, useEffect, useRef } from "react";
import { nanoid } from 'nanoid';
import axios from 'axios';

import Question from './Question';

import View from "./View";

const Home = () => {
  const voterId = localStorage.getItem('voterID') || nanoid();
  //const [points, setPoints] = useState(0);
  localStorage.setItem('voterID', voterId);
  const points = parseInt(localStorage.getItem('points')) || 6; 
  if (!localStorage.getItem('points') || isNaN(parseInt(localStorage.getItem('points')))) {
    localStorage.setItem('points', 6);
  }
  const [currentQuestion, setCurrentQuestion] = useState(null); 
  const [data, setData] = useState(null);

  const updatePoints = (newPoints) => {
    //setPoints(newPoints);
    console.log("updating points", newPoints)
    localStorage.setItem('points', newPoints);
  };

  const currentQuestionRef = useRef(null);

    useEffect(() => {
      setInterval(async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}polls/top`);
          setData(response.data);
          console.log("response full", response.data)
          if (response.data.poll[0].id !== currentQuestionRef.current) {
            console.log("current", currentQuestion)
            console.log("response", response.data.poll[0].id)
            currentQuestionRef.current = response.data.poll[0].id;
            setCurrentQuestion(response.data.poll[0].id)

            localStorage.setItem('voteCalcDone', false);
            console.log("current question updated")
          }
        } catch (error) {
          console.log("error", error)
        }
      }, 3000);
    }, [currentQuestion]);

  return (
    <Fragment>
      <View>
        <div className="header">
          <p>Voter ID: {voterId}</p>
          <p>Points: {points}</p>
        </div>
        {points <= 0 ? <p>Game Over</p> : 
          data && <Question question={data.poll} updatePoints={updatePoints} />
        }
      </View>
    </Fragment>
  );
};

export default Home;