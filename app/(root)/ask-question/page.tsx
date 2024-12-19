import React from 'react';
import QuestonForm from '@/components/forms/QuestonForm';

const AskQuestions = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <QuestonForm />
      </div>
    </div>
  );
};
export default AskQuestions;
