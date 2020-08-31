import React, { useCallback, useRef, ChangeEvent } from 'react';
import { Form } from '@unform/web';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { useHistory, Link } from 'react-router-dom';
import { Container, Content, AvatarInput } from './styles';
import getValidationErrors from '../../util/getValidationErrors';
import avatarPlaceholder from '../../assets/avatar-placeholder.png';

import Input from '../../Components/Input';
import Button from '../../Components/Button';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .required('E-mail is required.')
            .email('Must be a valid e-mail.'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val,
            then: Yup.string().min(6),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val,
              then: Yup.string().required(),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('password'), null],
              'Password confirmation does not match with password',
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? { old_password, password, password_confirmation }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Profile updated',
          description: 'Your profile was successfully uptaded',
        });
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
          title: 'Error while trying to update your profile',
          description:
            description === ''
              ? 'An erros has occurred, please try again'
              : description,
        });
      }
    },
    [addToast, updateUser, history],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar updated',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          initialData={{ name: user.name, email: user.email }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img
              src={user.avatar_url ? user.avatar_url : avatarPlaceholder}
              alt={user.name}
            />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>My Profile</h1>

          <Input name="name" icon={FiUser} type="text" placeholder="Name" />

          <Input name="email" icon={FiMail} type="email" placeholder="Email" />

          <Input
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Password"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="New password"
          />
          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="New password confirmation"
          />

          <Button type="submit">Update profile</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
