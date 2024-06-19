import { Link, useLoaderData, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { TiPencil } from 'react-icons/ti';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

import classes from './Notes.module.css';
import { Button } from '../Button';
import EditForm from './EditForm';
import { ListItems } from './ListItems';
import { NotificationModal } from '../NotificationModal';
import { useHttpHook } from '../../hooks/http-hook';
import customFetch from '../../utils/customFetch';

export const NoteItem = () => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const { sendRequest } = useHttpHook();
  const noteId = useParams().noteId;
  const navigate = useNavigate();
  const note = useLoaderData();

  const handleStartDelete = () => {
    setDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await sendRequest(
        `http://localhost:8080/api/v1/notes/${noteId}`,
        'DELETE'
      );
      // console.log(response);
      if (response.status === 204) {
        toast.success('Note deleted!', {
          position: 'top-center',
        });
      } else {
        toast.error('Error deleting note!', {
          position: 'top-center',
        });
      }
      setDeleteConfirm(false);
      setTimeout(() => {
        location.assign('/');
      }, 500);
    } catch (error) {
      // console.log(error);
      toast.error('Error deleting note!', {
        position: 'top-center',
      });
      setDeleteConfirm(false);
    }
  };

  const handleStartEditTitle = () => {
    setIsEditingTitle(true);
  };

  const handleStopEditTitle = () => {
    setIsEditingTitle(false);
  };

  const handleStartEditText = () => {
    setIsEditingText(true);
  };

  const handleStopEditText = () => {
    setIsEditingText(false);
  };

  const handleDeleteText = async () => {
    try {
      await sendRequest(
        `http://localhost:8080/api/v1/notes/${noteId}/noteText`,
        'DELETE'
      );
      // console.log(response);
      navigate(`/${noteId}`);
    } catch (error) {
      // console.log(error);
      toast.error('Error deleting note text!', {
        position: 'top-center',
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {deleteConfirm && (
          <NotificationModal onCancelDelete={handleCancelDelete}>
            <h3>Are you sure?</h3>
            <p>This will delete your note and cannot be undone.</p>
            <div className="modal-actions">
              <Button isText onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete}>Delete</Button>
            </div>
          </NotificationModal>
        )}
      </AnimatePresence>
      <>
        <Helmet>
          <title>{note.title}</title>
        </Helmet>
        <div className={classes['max-width']}>
          {!isEditingTitle && (
            <div className={classes['edit-container']}>
              <h2>{note.title}</h2>
              <Button title="Edit" isIcon onClick={handleStartEditTitle}>
                <TiPencil />
              </Button>
            </div>
          )}
          {isEditingTitle && (
            <EditForm
              value={note.title}
              type="text"
              id="title"
              onStopEdit={handleStopEditTitle}
              noteid={note.id}
            />
          )}
        </div>
        {!isEditingText && note.noteText && (
          <div className={classes['edit-container-text']}>
            <p>{note.noteText}</p>
            <Button title="Edit" isIcon onClick={handleStartEditText}>
              <TiPencil />
            </Button>
            <Button title="Delete" isIcon onClick={handleDeleteText}>
              <FaTrashAlt />
            </Button>
          </div>
        )}
        {isEditingText && (
          <EditForm
            value={note.noteText}
            id="noteText"
            onStopEdit={handleStopEditText}
            isTextarea
          />
        )}
        <ListItems listItems={note.listItems} noteId={note.id} />
        <div className={classes['note-actions']}>
          <Button onClick={handleStartDelete} title="Delete note">
            Delete Note
          </Button>
        </div>
        <Link to=".." className="button back" title="Back">
          Back
        </Link>
      </>
    </>
  );
};

export const loader = async ({ params }) => {
  const noteId = params.noteId;
  try {
    const response = await customFetch(
      `http://localhost:8080/api/v1/notes/${noteId}`
    );

    if (response.status !== 'success') {
      toast.error('Error loading note!', {
        position: 'top-center',
      });
    }
    return response.note;
  } catch (error) {
    console.log(error);
    toast.error('Error loading note!', {
      position: 'top-center',
    });
    return error;
  }
};
