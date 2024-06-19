import { FaTrashAlt, FaUndo } from 'react-icons/fa';
import { TiPencil } from 'react-icons/ti';
import { MdDone } from 'react-icons/md';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import classes from './Notes.module.css';
import { Button } from '../Button';
import EditForm from './EditForm';
import { useHttpHook } from '../../hooks/http-hook';

export const ListItem = ({ item }) => {
  const [itemState, setItemState] = useState(item);
  const [isChecked, setIsChecked] = useState(item.isChecked);
  const [isEditing, setIsEditing] = useState(false);
  const noteId = useParams().noteId;
  const { sendRequest } = useHttpHook();

  const handleCheckedToggle = async (iId) => {
    try {
      const response = await sendRequest(`/api/v1/items/${iId}`, 'PATCH');
      // console.log(response);
      if (response.status === 'success') {
        setItemState(response.item);
        setIsChecked(response.item.isChecked);
      }
    } catch (error) {
      // console.log(error);
      toast.error('Error checking off item!', {
        position: 'top-center',
      });
    }
  };

  const handleDeleteItem = async (iId) => {
    try {
      const response = await sendRequest(
        `/api/v1/items/${noteId}/${iId}`,
        'DELETE'
      );
      // console.log(response);
      if (response.status === 'success') {
        setItemState(null);
      } else {
        return null;
      }
    } catch (error) {
      // console.log(error);
      toast.error('Something went wrong', {
        position: 'top-center',
      });
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };
  const handleStopEdit = () => {
    setIsEditing(false);
  };

  const handleItemUpdate = (identifier, value) => {
    setItemState((prevItem) => {
      return { ...prevItem, [identifier]: value };
    });
  };

  return (
    <>
      {itemState && (
        <div className={classes.item}>
          {!isEditing && (
            <>
              <input
                className={classes.hidden}
                type="checkbox"
                name="checkbox"
                id={itemState._id}
              />
              <label
                htmlFor={itemState._id}
                className={isChecked ? classes.checked : undefined}
                title="Drag and drop to reorder"
              >
                {itemState.item}
              </label>
              {!isChecked && (
                <div className={classes['input-container']}>
                  <Button
                    title="Done"
                    isIcon
                    onClick={() => handleCheckedToggle(itemState._id)}
                  >
                    <MdDone />
                  </Button>
                  <Button title="Edit" isIcon onClick={handleStartEdit}>
                    <TiPencil />
                  </Button>
                </div>
              )}
              {isChecked && (
                <div className={classes['input-container']}>
                  <Button
                    title="Undo"
                    isIcon
                    onClick={() => handleCheckedToggle(itemState._id)}
                  >
                    <FaUndo />
                  </Button>
                  <Button
                    title="Delete"
                    isIcon
                    onClick={() => handleDeleteItem(itemState._id)}
                  >
                    <FaTrashAlt />
                  </Button>
                </div>
              )}
            </>
          )}
          {isEditing && (
            <EditForm
              value={itemState.item}
              type="text"
              id={itemState._id}
              isItem
              onStopEdit={handleStopEdit}
              onUpdateItem={handleItemUpdate}
            />
          )}
        </div>
      )}
    </>
  );
};
