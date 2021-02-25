import React, { ButtonHTMLAttributes } from 'react';

import { Container, LoadingContainer } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
  <Container type="button" loading={loading ? 1 : 0} {...rest}>
    {loading ? <LoadingContainer /> : children}
  </Container>
);

export default Button;
