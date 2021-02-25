import styled, { keyframes } from 'styled-components';

import { shade } from 'polished';

interface ContainerProps {
  loading: 0 | 1;
}

const loadingAnimation = keyframes`
 {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export const Container = styled.button<ContainerProps>`
  background: #ff9000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  border-radius: 10px;
  border: 0;
  color: #312e38;
  font-weight: 500;
  padding: 0 16px;
  width: 100%;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`;

export const LoadingContainer = styled.div`
  animation: ${loadingAnimation} 800ms linear infinite;
  border: 5px solid #feb248;
  border-radius: 50%;
  border-top: 5px solid #6c657b;
  width: 32px;
  height: 32px;
`;
