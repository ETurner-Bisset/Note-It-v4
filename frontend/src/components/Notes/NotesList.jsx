import { Link } from 'react-router-dom';

export const NotesList = ({ notesList }) => {
  return (
    <>
      <h3>Your Notes</h3>
      {notesList.length === 0 && (
        <p>
          You have no notes. Click the add note button to start creating notes.
        </p>
      )}
      {notesList.length > 0 && (
        <ul>
          {notesList.map((note) => (
            <li key={note.id}>
              <Link to={`/${note.id}`}>{note.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
