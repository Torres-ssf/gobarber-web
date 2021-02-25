import React, { useCallback, useRef, useState } from 'react';
import { Form } from '@unform/web';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import getValidationErrors from '../../util/getValidationErrors';

import Input from '../../Components/Input';
import Button from '../../Components/Button';

import logo from '../../assets/logo.svg';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const Signin: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const history = useHistory();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        setLoading(true);
        // eslint-disable-next-line no-unused-expressions
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .required('E-mail is required.')
            .email('Must be a valid e-mail.'),
          password: Yup.string().min(6, 'At least 6 digits'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Account created successfully',
          description: 'You can already sign in ',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          // eslint-disable-next-line no-unused-expressions
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
          title: 'Error while creating new account',
          description:
            description === ''
              ? 'An error ocorrered, please check your network connection and try again'
              : description,
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Create new account.</h1>

            <Input name="name" icon={FiUser} type="text" placeholder="Name" />
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

            <Button type="submit" loading={loading}>
              Create
            </Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Back to sign in page
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default Signin;
