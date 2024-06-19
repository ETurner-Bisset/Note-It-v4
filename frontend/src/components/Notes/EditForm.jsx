import { IoClose } from 'react-icons/io5';
import { FaRegSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import classes from './Notes.module.css';
import { Button } from '../Button';
import { useHttpHook } from '../../hooks/http-hook';

const EditForm = ({
  value,
  onStopEdit,
  type,
  id,
  isTextarea,
  isItem,
  onUpdateItem,
}) => {
  const navigate = useNavigate();
  const noteId = useParams().noteId;
  const { sendRequest } = useHttpHook();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    let url = `http://localhost:8080/api/v1/items/${id}/edit`;

    if (id === 'noteText') {
      url = `http://localhost:8080/api/v1/notes/${noteId}/noteText`;
    } else if (id === 'title') {
      url = `http://localhost:8080/api/v1/notes/${noteId}/title`;
    }

    try {
      const response = await sendRequest(url, 'PATCH', JSON.stringify(data));
      // console.log(response);
      if (response.status !== 'success') {
        return null;
      } else {
        if (id === 'title' || id === 'noteText') {
          onStopEdit();
          return navigate(`/${noteId}`);
        }
        onUpdateItem('item', response.item.item);
        onStopEdit();
        navigate(`/${noteId}`);
      }
    } catch (error) {
      toast.error('Error updating note!', {
        position: 'top-center',
      });
      // console.log(error);
    }
  };

  return (
    <form className={classes['edit-form']} onSubmit={handleFormSubmit}>
      <div
        className={
          isTextarea ? classes['textarea'] : classes['input-container']
        }
      >
        {!isTextarea && !isItem && (
          <input
            type={type}
            defaultValue={value}
            id={id}
            name={id}
            autoFocus
            required
          />
        )}
        {isTextarea && (
          <textarea
            defaultValue={value}
            id={id}
            name={id}
            autoFocus
            rows="7"
            cols="24"
          ></textarea>
        )}
        {isItem && (
          <input
            type={type}
            defaultValue={value}
            id="item"
            name="item"
            autoFocus
          />
        )}
        <Button title="Save" isIcon>
          <FaRegSave />
        </Button>
        <Button title="Close" type="button" isIcon onClick={onStopEdit}>
          <IoClose />
        </Button>
      </div>
    </form>
  );
};
export default EditForm;
