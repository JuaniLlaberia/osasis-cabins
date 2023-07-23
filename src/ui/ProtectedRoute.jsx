import { styled } from 'styled-components';
import { useUser } from '../features/authentication/useUser';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  //1. Load the auth user
  const { isLoading, isAuthenticated } = useUser();

  //2. If there is no auth user, redirect to /login
  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate('/login');
  }, [isAuthenticated, isLoading]);

  //3. While loading, show spinner
  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  //4.If there is a user, render the app
  if (isAuthenticated) return children;
};
