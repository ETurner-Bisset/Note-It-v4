import { useRouteLoaderData } from 'react-router-dom';
import { UserProfile } from '../components/User/UserProfile';

export const UserPage = () => {
  const { user } = useRouteLoaderData('user');

  return (
    <>
      {!user && <p>You need to be logged in to view your profile.</p>}
      {user && <UserProfile />}
    </>
  );
};
