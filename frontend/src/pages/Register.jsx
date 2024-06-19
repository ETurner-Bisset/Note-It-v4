import { Form, Link, redirect, useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input } from '../components/Input/Input';
import { Button } from '../components/Button';
import customFetch from '../utils/customFetch';

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <>
      <h2>Signup</h2>
      <p>
        Already got an account?{' '}
        <Link className="text-link" to="/login">
          Login here
        </Link>
      </p>
      <Form method="POST">
        <Input label="Name" id="name" type="text" required />
        <Input label="Email" id="email" type="email" required />
        <Input label="Password" id="password" type="password" required />
        <Input
          label="Confirm Password"
          id="passwordConfirm"
          type="password"
          required
        />
        <Button title="Signup">
          {isSubmitting ? 'Signing up...' : 'Signup'}
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
      '/api/v1/users/signup',
      method,
      JSON.stringify(data)
    );
    // console.log(response);
    if (response.status === 'success') {
      toast.success('Signed up successfully!', {
        position: 'top-center',
      });
      return redirect('/signupConfirm');
    } else {
      const responseData = await response.json();
      // console.log(responseData);
      toast.error(responseData.message, {
        position: 'top-center',
      });
      return null;
    }
  } catch (error) {
    // console.log(error);
    toast.error('Error signing up!', {
      position: 'top-center',
    });
    return error;
  }
};

export default Register;
