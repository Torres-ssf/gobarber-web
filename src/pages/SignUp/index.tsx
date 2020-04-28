import React, { useCallback, useRef } from 'react';
import { Form } from '@unform/web';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';
import { Container, Content, Background, AnimationContainer } from './styles';
import getValidationErrors from '../../util/getValidationErrors';

import Input from '../../Components/Input';
import Button from '../../Components/Button';

import logo from '../../assets/logo.svg';

const Signin: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: object) => {
    try {
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
    } catch (err) {
      const errors = getValidationErrors(err);

      // eslint-disable-next-line no-unused-expressions
      formRef.current?.setErrors(errors);
    }
  }, []);

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

            <Button type="submit">Create</Button>
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
