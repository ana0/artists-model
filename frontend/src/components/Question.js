import React, { useState, useEffect, Fragment, useRef } from 'react';
import axios from 'axios';

const Question = ({ question, updatePoints }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isError, setIsError] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [won, setWon] = useState(false);
  const quizReward = 2;
  const predReward = 3;

  console.log("question", question)
  const questionId = question[0].id;

  const handleOptionChange = (event) => {
    setSelectedOption(parseInt(event.target.value));
  };

  const handleSubmit = async () => {
    // Send the user's answer to the server
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}votes`, {
        pollId: question[0].id,
        pollItemsId: selectedOption,
        sessionId: localStorage.getItem('voterID'),
      })
      setHasVoted(true)
      localStorage.setItem('lastPoll', question[0].id);
      localStorage.setItem('lastVote', selectedOption)
    } catch (error) {
      console.error("Error", error);
      setIsError(true);

    }
  };

  const wonRef = useRef(null);

  useEffect(() => {
    setHasVoted(false);
  }, [questionId])

  useEffect(() => {
    console.log("question", question)
    if (question[0].closed) {
      if (parseInt(localStorage.getItem('lastPoll')) === question[0].id && localStorage.getItem('voteCalcDone') === 'false') {
        let w;
        let reward;
        if (question[0].type === "pred") {
          w = question[0].votes > question[1].votes > 0 ? question[0].pollItemsId : question[1].pollItemsId;
          reward = predReward;
        } else {
          w = question[0].correct ? question[0].pollItemsId : question[1].pollItemsId;
          reward = quizReward;
        }
        wonRef.won = w;
        setWon(w);
        localStorage.setItem('voteCalcDone', true);
        //setHasVoted(false)
        updatePoints(parseInt(localStorage.getItem('points')) + (parseInt(localStorage.getItem('lastVote')) === wonRef.won ? reward : -reward));
      }

    }
  }, [setWon, question, updatePoints, won, wonRef])

  return (
    <div className="questionBody">
      {isError && <div>There was an error submitting your answer - did you already vote?</div>}
      {!hasVoted && !question[0].closed && (
        <Fragment>
          <h3>{question[0].question}</h3>
          <label>
            <input type="radio" value={question[0].pollItemsId} checked={selectedOption === question[0].pollItemsId} onChange={handleOptionChange} />
            {question[0].answer}
          </label>
          <label>
            <input type="radio" value={question[1].pollItemsId} checked={selectedOption === question[1].pollItemsId} onChange={handleOptionChange} />
            {question[1].answer}
          </label>
          <button onClick={handleSubmit}>Submit</button>
      </Fragment>
      )}
      {hasVoted && <div>Thank you for voting!</div>}
      {question[0].closed ? (
        <Fragment>
          <div>The poll is closed. Results: </div>
          <p>{`${question[0].answer}: ${question[0].votes}`}</p>
          <p>{`${question[1].answer}: ${question[1].votes}`}</p>
          {parseInt(localStorage.getItem('lastPoll')) === question[0].id ? 
            question[0].type === "pred" ?
              <Fragment>
                <p>You voted for {question.find((item) => item.pollItemsId === parseInt(localStorage.getItem('lastVote'))).answer}.</p> 
                <p>You were part of the {parseInt(localStorage.getItem('lastVote')) === won ? "winning" : "losing"} side. You {parseInt(localStorage.getItem('lastVote')) === won ? "gain" : "lose"} {predReward} points.</p>
              </Fragment>
              :
              <Fragment>
                <p>You picked {question.find((item) => item.pollItemsId === parseInt(localStorage.getItem('lastVote'))).answer}.</p> 
                <p>You were {parseInt(localStorage.getItem('lastVote')) === won ? "correct" : "incorrect"} side. You {parseInt(localStorage.getItem('lastVote')) === won ? "gain" : "lose"} {quizReward} points.</p>
              </Fragment>
            :
            <p>You did not participate in this round.</p>}
        </Fragment> 
      ):null}
    </div>
  );
};

export default Question;