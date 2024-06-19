import { Form, Link, redirect, useNavigation } from 'react-router-dom';
import { Input } from '../components/Input/Input';
import { Button } from '../components/Button';
import { toast } from 'react-toastify';

import customFetch from '../utils/customFetch';

const Login = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <>
      <h2>Login</h2>
      <p>
        No Acount?{' '}
        <Link className="text-link" to="/signup">
          Signup here
        </Link>
      </p>
      <Form method="POST">
        <Input label="Email" id="email" type="email" required />
        <Input label="Password" id="password" type="password" required />
        <Link className="text-link link" to="/forgotPassword">
          Forgot Password
        </Link>
        <Button title="Login">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
    </>
  );
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const method = request.method;
  const data = Object.fromEntries(formData);
  try {
    const response = await customFetch(
      '/api/v1/users/login',
      method,
      JSON.stringify(data)
    );
    // console.log(response);
    if (response.status === 'success') {
      toast.success('Logged in successfully!', {
        position: 'top-center',
      });
      return redirect('/');
    } else {
      const responseData = await response.json();
      toast.error(responseData.message, {
        position: 'top-center',
      });
      return null;
    }
  } catch (error) {
    // console.log(error);
    toast.error('Error logging in!', {
      position: 'top-center',
    });
    return error;
  }
};

export default Login;
