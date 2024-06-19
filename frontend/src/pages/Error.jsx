import { Link } from 'react-router-dom';

import { MainNav } from '../components/Nav/MainNav';
import { Footer } from '../components/Footer';

export const ErrorPage = ({ message }) => {
  return (
    <>
      <MainNav />
      <main className="main-error">
        <h1>Something Went Wrong!</h1>
        <p className="error-text">
          {message ? message : 'There was an error, please try again later.'}
        </p>
        <Link to="/" className="text-link">
          Home
        </Link>
      </main>
      <Footer />
    </>
  );
};
