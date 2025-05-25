import { FC, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { getRegisterUser } from '../../services/user/slice';
import { useDispatch } from '../../services/store';
import type { AppDispatch } from '../../services/store';

export const Register: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      getRegisterUser({
        email,
        password,
        name: userName
      })
    );
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
