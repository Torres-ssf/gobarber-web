import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Container, Content, Background } from './styles';

import Input from '../../Components/Input';
import Button from '../../Components/Button';

import getValidationErrors from '../../util/getValidationErrors';

import logo from '../../assets/logo.svg';

const Signin: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: object) => {
    try {
      // eslint-disable-next-line no-unused-expressions
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail is required.')
          .email('Must be a valid e-mail.'),
        password: Yup.string().required('Password is required.'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (err) {
      const errors = getValidationErrors(err);

      // eslint-disable-next-line no-unused-expressions
      formRef.current?.setErrors(errors);
    }
  }, []);
  return (
    <Container>
      <Content>
        <img src={logo} alt="GoBarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
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
        </Form>

        <a href="new">
          <FiLogIn />
          Create new account
        </a>
      </Content>
      <Background />
    </Container>
  );
};

export default Signin;
