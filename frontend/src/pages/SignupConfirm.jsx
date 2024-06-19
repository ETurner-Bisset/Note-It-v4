import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import customFetch from '../utils/customFetch';

export const SignupConfirmPage = () => {
  const token = useParams().token;

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await customFetch(
          `http://localhost:8080/api/v1/users/signup/${token}`,
          'PATCH'
        );
        console.log(response);
        if (response.status !== 'success') {
          const responseData = await response.json();
          toast.error(responseData.message, {
            position: 'top-center',
          });
        } else {
          toast.success('Account activated!', {
            position: 'top-center',
          });
        }
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong!', {
          position: 'top-center',
        });
      }
    };
    if (token) {
      activateAccount();
    }
  }, [token]);

  let content = (
    <>
      <h1>You have signed up successfully!</h1>
      <p className="p-text">
        An email has been send to the email address you provied which contains
        the link to activate your account. Please check your inboxes and spam
        folders.
      </p>
    </>
  );

  if (token) {
    content = (
      <>
        <h1>Your account has been activated!</h1>
        <p>
          Please{' '}
          <Link className="text-link" to="/login">
            Login
          </Link>{' '}
          to start creating notes.
        </p>
      </>
    );
  }

  return <>{content}</>;
};
