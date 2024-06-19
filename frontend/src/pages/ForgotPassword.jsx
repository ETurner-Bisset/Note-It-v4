import { Form, redirect, useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Input } from '../components/Input/Input';
import { Button } from '../components/Button';
import customFetch from '../utils/customFetch';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <>
      <h2>Forgot Your Password?</h2>
      <p>An reset link will be sent to the email address you provide.</p>
      <Form method="POST">
        <Input label="Email" id="email" type="email" required />
        <Button title="Send Link">
          {isSubmitting ? 'Sending...' : 'Send Link'}
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
      '/api/v1/users/forgotPassword',
      method,
      JSON.stringify(data)
    );
    // console.log(response);

    if (response.status !== 'success') {
      const responseData = await response.json();
      // console.log(responseData);
      toast.error(responseData.message || 'Something went wrong!', {
        position: 'top-center',
      });
      return null;
    } else {
      toast.success(response.message, {
        position: 'top-center',
      });
    }
    return redirect('/');
  } catch (error) {
    // console.log(error);
    toast.error('Error sending reset link!', {
      position: 'top-center',
    });
  }
};
export default ForgotPassword;
