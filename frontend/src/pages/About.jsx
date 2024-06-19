import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <>
      <h1>About</h1>
      <p>An app for keeping notes and lists</p>
      <p className="about-text">
        This site was built using React for the frontend, NodeJS and Express for
        the backend and MongoDB for the database.
      </p>
      <p>
        You can find the code for this site on{' '}
        <Link to="#" target="_blank" className="text-link">
          GitHub
        </Link>
      </p>
      <Link to=".." className="button back">
        Back
      </Link>
    </>
  );
};
