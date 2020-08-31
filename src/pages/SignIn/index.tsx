import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';

import Input from '../../Components/Input';
import Button from '../../Components/Button';

import getValidationErrors from '../../util/getValidationErrors';

import logo from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

interface SignInFormData {
  email: string;
  password: string;
}

const Signin: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
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

        const { email, password } = data;

        await signIn({ email, password });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        let description = '';

        if (err.response.data.message) {
          description = err.response.data.message;
        }

        addToast({
          type: 'error',
          title: 'Authentication error',
          description:
            description === ''
              ? 'An error ocorrered, please check your email/password combination'
              : description,
        });
      }
    },
    [signIn, addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Log in</h1>

            <Input
              name="email"
              icon={FiMail}
              type="email"
              placeholder="Email"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Password"
            />

            <Button type="submit">Log in</Button>

            <Link to="forgot-password">Forgot my password</Link>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Create new account
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default Signin;
