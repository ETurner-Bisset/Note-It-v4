import { Link, useRouteLoaderData } from 'react-router-dom';
import { FaPenNib } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

import { NotesContainer } from '../components/Notes/NotesContainer';

export const HomePage = () => {
  const data = useRouteLoaderData('user');
  console.log(data);

  return (
    <>
      <Helmet>
        <title>Note It</title>
      </Helmet>

      {!data.user && (
        <>
          <h1>
            Note It <FaPenNib />
          </h1>
          <p>One app for keeping all your notes and lists.</p>
          <p>
            <Link className="text-link" to="/login">
              Login
            </Link>{' '}
            or{' '}
            <Link className="text-link" to="/signup">
              Signup
            </Link>{' '}
            to start creating notes{' '}
          </p>
        </>
      )}
      {data.status === 'success' && <NotesContainer />}
    </>
  );
};
