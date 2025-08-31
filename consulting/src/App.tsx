import React from 'react';
import styled from 'styled-components';

const Frame = styled.iframe`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  border: 0;
`;

function App() {
  return <Frame src="/topology/index.html" title="Topology Replica" />;
}

export default App;
