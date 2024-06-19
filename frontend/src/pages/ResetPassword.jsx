import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input } from '../components/Input/Input';
import { Button } from '../components/Button';
import { useHttpHook } from '../hooks/http-hook';

const ResetPassword = () => {
  const { sendRequest } = useHttpHook();
  const token = useParams().token;
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await sendRequest(
        `http://localhost:8080/api/v1/users/resetPassword/${token}`,
        'PATCH',
        JSON.stringify(data)
      );
      console.log(response);
      if (response.status !== 'success') {
        const responseData = await response.json();
        toast.error(responseData.message || 'Something went wrong!', {
          position: 'top-center',
        });
      } else {
        toast.success('Password reset!', {
          position: 'top-center',
        });
        setTimeout(() => {
          navigate('/');
        }, 500);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!', {
        position: 'top-center',
      });
    }
  };

  return (
    <>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleResetPassword}>
        <Input label="Password" id="password" type="password" required />
        <Input
          label="Confirm Password"
          id="passwordConfirm"
          type="password"
          required
        />
        <Button title="Reset Password">Reset Password</Button>
      </form>
    </>
  );
};
export default ResetPassword;
