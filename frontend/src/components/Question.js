import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';

const Question = ({ question, session }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isError, setIsError] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

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
        voterId: localStorage.getItem('voterID'),
        sessionId: session
      })
      setHasVoted(true)
      localStorage.setItem('lastPoll', question[0].id);
      localStorage.setItem('lastVote', selectedOption)
    } catch (error) {
      console.error("Error", error);
      setIsError(true);

    }
  };

  useEffect(() => {
    setHasVoted(false);
  }, [questionId])

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
              </Fragment>
              :
              <Fragment>
                <p>You picked {question.find((item) => item.pollItemsId === parseInt(localStorage.getItem('lastVote'))).answer}.</p> 
              </Fragment>
            :
            <p>You did not participate in this round.</p>}
        </Fragment> 
      ):null}
    </div>
  );
};

export default Question;