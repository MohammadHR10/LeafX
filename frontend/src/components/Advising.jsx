import React from 'react';
import styled from 'styled-components';
import Chatbot from './Chatbot';
import FreeTierVoiceChat from './FreeTierVoiceChat';

const AdvisingContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 70px); // Adjust based on your navbar height
  background-color: #fff;
`;

const SplitPane = styled.div`
  flex: 1;
  padding: 20px;
  border-right: ${props => props.showBorder ? '1px solid #eee' : 'none'};
  overflow-y: auto;
`;

const Advising = () => {
  return (
    <AdvisingContainer>
      <SplitPane showBorder>
        <Chatbot />
      </SplitPane>
      <SplitPane>
        <FreeTierVoiceChat />
      </SplitPane>
    </AdvisingContainer>
  );
};

export default Advising;