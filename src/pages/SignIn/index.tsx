import React from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Container, Content, Background } from './styles';

import Input from '../../Components/Input';
import Button from '../../Components/Button';

import logo from '../../assets/logo.svg';

const Signin: React.FC = () => (
  <Container>
    <Content>
      <img src={logo} alt="GoBarber" />

      <form>
        <h1>Sign in</h1>

        <Input name="email" icon={FiMail} type="email" placeholder="Email" />
        <Input
          name="password"
          icon={FiLock}
          type="password"
          placeholder="Password"
        />

        <Button type="submit">Sign in</Button>

        <a href="forgot">Forgot my password</a>
      </form>

      <a href="new">
        <FiLogIn />
        Create new account
      </a>
    </Content>
    <Background />
  </Container>
);

export default Signin;
