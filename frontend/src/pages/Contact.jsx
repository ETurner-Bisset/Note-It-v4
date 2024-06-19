import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { Input } from '../components/Input/Input';
import { Button } from '../components/Button';
import { loadingActions } from '../store';

export const ContactPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    // console.log(data);
    dispatch(loadingActions.setIsLoading(true));
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });
      // console.log(response);
      if (!response.ok) {
        dispatch(loadingActions.setIsLoading(false));
        toast.error('Something went wrong!', {
          position: 'top-center',
        });
        return null;
      } else {
        const responseData = await response.json();
        dispatch(loadingActions.setIsLoading(false));
        // console.log(responseData);
        toast.success(responseData.message, {
          position: 'top-center',
        });
        navigate('/');
      }
    } catch (error) {
      // console.log(error);
      dispatch(loadingActions.setIsLoading(false));
      toast.error('Something went wrong!', {
        position: 'top-center',
      });
    }
  };

  return (
    <>
      <h2>Contact Us</h2>
      <p>
        Got any questions, comments or feedback? Send us a message using the
        form below.
      </p>
      <form
        onSubmit={handleSendEmail}
        action="https://api.web3forms.com/submit"
      >
        <input
          type="hidden"
          name="access_key"
          value="1d8b2ef3-c654-4b75-9b0d-fe3a23a8c437"
          id="access_key"
        />
        <input type="hidden" name="subject" value="Note-It-v4" id="subject" />
        <Input label="Name" id="name" type="text" required />
        <Input label="Email" id="email" type="email" required />
        <Input label="Message" id="message" isTextarea required rows="7" />
        <Button title="Send">Send</Button>
      </form>
      <Link to=".." className="button" title="Back">
        Back
      </Link>
    </>
  );
};
