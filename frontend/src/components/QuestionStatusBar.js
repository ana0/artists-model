import React from "react";
import { useQuery } from "@tanstack/react-query";

import { getTopQuestion } from "../services";

const QuestionStatusBar = () => {
  const topquestion = useQuery({
    queryKey: [`getTopQuestion`],
    queryFn: async () => getTopQuestion(),
    refetchInterval: 3000,
  });

  const poll = topquestion.data?.poll?.[0];
  const isClosed = !poll || poll.closed;

  return (
    <div className={`question-status-bar ${isClosed ? "closed" : "open"}`}>
      {isClosed ? "CLOSED" : `OPEN — ${poll.question}`}
    </div>
  );
};

export default QuestionStatusBar;
