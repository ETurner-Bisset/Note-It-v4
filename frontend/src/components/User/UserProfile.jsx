import { Link, useRouteLoaderData, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';

import { Input } from '../Input/Input';
import { Button } from '../Button';
import { useHttpHook } from '../../hooks/http-hook';
import { NotificationModal } from '../NotificationModal';

export const UserProfile = () => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { user } = useRouteLoaderData('user');
  const { sendRequest } = useHttpHook();
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    let url = 'http://localhost:8080/api/v1/users/updateMe';
    if (e.target.id === 'passwordForm') {
      url = 'http://localhost:8080/api/v1/users/updatePassword';
    }

    try {
      const response = await sendRequest(url, 'PATCH', JSON.stringify(data));
      // console.log(response);
      if (e.target.id === 'passwordForm' && response.status === 'success') {
        toast.success('Password updated successfully! Please login.', {
          position: 'top-center',
        });
        navigate('/login');
      }
    } catch (error) {
      // console.log(error);
      toast.error('Error updating account!', {
        position: 'top-center',
      });
    }
  };

  const handleStartDelete = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    if (data.delete === 'on') {
      setDeleteConfirm(true);
    } else {
      toast.error('You must check the box to delete your account!', {
        position: 'top-center',
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await sendRequest(
        'http://localhost:8080/api/v1/users/me',
        'DELETE'
      );
      console.log(response);
      if (response.status === 204) {
        // const responseData = await response.json();
        toast.success(response.message, {
          position: 'top-center',
        });
        navigate('/signup');
      } else {
        toast.error('Something went wrong!', {
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

  return (
    <>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <AnimatePresence>
        {deleteConfirm && (
          <NotificationModal onCancelDelete={handleCancelDelete}>
            <h3>Are you sure?</h3>
            <p>This will delete your account and cannot be undone.</p>
            <div className="modal-actions">
              <Button isText onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete}>Delete</Button>
            </div>
          </NotificationModal>
        )}
      </AnimatePresence>
      <h2>User Profile</h2>
      <div className="update-container">
        <form id="detailsForm" onSubmit={handleUpdate}>
          <h4>Update Details</h4>
          <Input
            label="Name"
            id="name"
            type="text"
            required
            defaultValue={user.name}
          />
          <Input
            label="Email"
            id="email"
            type="email"
            required
            defaultValue={user.email}
          />
          <Button title="Update Details">Update Details</Button>
        </form>
        <form id="passwordForm" onSubmit={handleUpdate}>
          <h4>Update Password</h4>
          <Input
            label="Old Password"
            id="passwordCurrent"
            type="password"
            required
          />
          <Input label="New Password" id="password" required />
          <Input
            label="Confirm Password"
            id="passwordConfirm"
            type="password"
            required
          />
          <Button title="Update Password">Update Password</Button>
        </form>
      </div>
      <form onSubmit={handleStartDelete}>
        <h4>Delete Account</h4>
        <p>
          <span className="warning">Warning!</span> This will delete your
          account including all your notes. This action cannot be undone.
        </p>
        <label htmlFor="delete">
          Please confirm account deletion by checking the box below.
        </label>
        <input type="checkbox" id="delete" name="delete" className="checkbox" />
        <Button>Delete Account</Button>
      </form>
      <Link to=".." className="button" title="Back">
        Back
      </Link>
    </>
  );
};
