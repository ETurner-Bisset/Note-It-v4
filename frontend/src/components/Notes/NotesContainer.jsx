import { Link, Form, useRouteLoaderData, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FaSort } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useState } from 'react';

import { Input } from '../Input/Input';
import { Button } from '../Button';
import { NotesList } from './NotesList';
import classes from './Notes.module.css';
import { useHttpHook } from '../../hooks/http-hook';

export const NotesContainer = () => {
  const { user } = useRouteLoaderData('user');
  const [notesList, setNotesList] = useState(user.notes);
  const navigate = useNavigate();
  const { sendRequest } = useHttpHook();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await sendRequest(
        'http://localhost:8080/api/v1/notes/searchNotes',
        'POST',
        JSON.stringify(data)
      );
      // console.log(response);
      if (response.status === 'success') {
        return navigate(`/${response.note.id}`);
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSortOption = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.sort === 'alpha') {
      try {
        const response = await sendRequest(
          'http://localhost:8080/api/v1/notes/sortAlphabetically'
        );
        // console.log(response);
        if (response.status !== 'success') {
          toast.error('Error sorting notes!', {
            position: 'top-center',
          });
        }
        setNotesList(response.notes);
      } catch (error) {
        console.log(error);
      }
    } else {
      setNotesList(user.notes);
    }
  };

  return (
    <div className={classes['notes-page']}>
      <h2>Welcome {user.name.split(' ')[0]}</h2>
      <Link className="button" to="/addNote">
        Add Note
      </Link>
      <div className={classes['form-container']}>
        <Form
          className={classes['search-container']}
          onSubmit={handleSearchSubmit}
        >
          <Input label="Search" id="title" placeholder="Enter note title..." />
          <Button isIcon title="Search">
            <FaSearch />
          </Button>
        </Form>
        <Form
          className={classes['search-container']}
          onSubmit={handleSortOption}
        >
          <label htmlFor="sort">Currently Sorted By:</label>
          <select className={classes.select} name="sort" id="sort">
            <option value="date">Date Created</option>
            <option value="alpha">Alphabetically</option>
          </select>
          <Button title="Sort" isIcon>
            <FaSort />
          </Button>
        </Form>
      </div>
      <NotesList notesList={notesList} />
    </div>
  );
};
