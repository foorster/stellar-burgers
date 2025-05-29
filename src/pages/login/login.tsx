import { FC, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LoginUI } from '@ui-pages';
import { getLoginUser, selectUserState } from '../../services/user/slice';
import type { AppDispatch } from '../../services/store';

interface LoginForm {
  email: string;
  password: string;
}

export const Login: FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });

  const { error, isAuthenticated } = useSelector(selectUserState);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.email && formData.password) {
      dispatch(getLoginUser(formData));
    }
  };

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <LoginUI
      errorText={error ?? ''}
      email={formData.email}
      setEmail={(value) =>
        handleChange({
          target: { name: 'email', value }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      password={formData.password}
      setPassword={(value) =>
        handleChange({
          target: { name: 'password', value }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      handleSubmit={handleSubmit}
    />
  );
};
