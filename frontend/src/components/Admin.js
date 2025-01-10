import React, { Fragment } from "react";
import CreateQuestion from './CreateQuestion';
import DisplayQuestion from "./DisplayQuestion";
import SetTopQuestion from './SetTopQuestion';
import CloseQuestion from "./CloseQuestion";
import { useQuery } from "@tanstack/react-query";

import { getQuestions } from "../services";

import View from "./View";

const Admin = () => {
  const { data } = useQuery({
    queryKey: [`getQuestions`],
    queryFn: async () => getQuestions()
  })

  return (
    <Fragment>
      <View>
        <CreateQuestion />
        <h3>Questions</h3>
        {data ? data.polls.map((i) => {
          return <DisplayQuestion key={i.id} data={i} />
        }) : null}
        <SetTopQuestion />
        <CloseQuestion />
      </View>
    </Fragment>
  );
};

export default Admin;