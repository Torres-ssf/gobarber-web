import React from 'react';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { Container, Content, Background } from './styles';

import Input from '../../Components/Input';
import Button from '../../Components/Button';

import logo from '../../assets/logo.svg';

const Signin: React.FC = () => (
  <Container>
    <Background />
    <Content>
      <img src={logo} alt="GoBarber" />

      <form>
        <h1>Create new account.</h1>

        <Input name="name" icon={FiUser} type="text" placeholder="Name" />
        <Input name="email" icon={FiMail} type="email" placeholder="Email" />
        <Input
          name="password"
          icon={FiLock}
          type="password"
          placeholder="Password"
        />

        <Button type="submit">Create</Button>
      </form>

      <a href="new">
        <FiArrowLeft />
        Back to sign in page
      </a>
    </Content>
  </Container>
);

export default Signin;
