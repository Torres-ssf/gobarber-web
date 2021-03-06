import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';

import Input from '../../Components/Input';
import Button from '../../Components/Button';

import getValidationErrors from '../../util/getValidationErrors';

import logo from '../../assets/logo.svg';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail is required.')
            .email('Must be a valid e-mail.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'Change password e-mail sent',
          description: 'We sent you an e-mail to confirm your password reset',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        let description = '';

        if (err.response) {
          const { data: errorData } = err.response;
          if (errorData && errorData.message) {
            description = errorData.message;
          }
        }

        addToast({
          type: 'error',
          title: 'Error while sending reset password email',
          description:
            description === ''
              ? 'An error ocorrered, please check your network connection and try again'
              : description,
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Request reset password email</h1>

            <Input
              name="email"
              icon={FiMail}
              type="email"
              placeholder="Email"
            />

            <Button loading={loading} type="submit">
              Request
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Sign in page
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
