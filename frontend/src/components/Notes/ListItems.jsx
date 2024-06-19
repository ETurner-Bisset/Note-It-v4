import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { IoMdAdd } from 'react-icons/io';
import { toast } from 'react-toastify';

import { ListItem } from './ListItem';
import classes from './Notes.module.css';
import { Button } from '../Button';
import { useHttpHook } from '../../hooks/http-hook';

export const ListItems = ({ listItems, noteId }) => {
  const [items, setItems] = useState(listItems);
  const { sendRequest } = useHttpHook();

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    if (data.item !== '') {
      try {
        const response = await sendRequest(
          `http://localhost:8080/api/v1/notes/${noteId}/addItem`,
          'POST',
          JSON.stringify(data)
        );
        // console.log(response);
        if (response.status === 'success') {
          setItems((prevItems) => {
            return [...prevItems, response.item];
          });
        }
      } catch (error) {
        // console.log(error);
        toast.error('Error adding item!', {
          position: 'top-center',
        });
      }
    } else {
      toast.error('You must enter a value!', {
        position: 'top-center',
      });
    }
    e.target.reset();
  };

  const handleListOrderUpdate = async (items) => {
    try {
      await sendRequest(
        `http://localhost:8080/api/v1/notes/${noteId}/list`,
        'PATCH',
        JSON.stringify(items)
      );
      // console.log(response);
    } catch (error) {
      // console.log(error);
      toast.error('Error reordering list!', {
        position: 'top-center',
      });
    }
  };

  return (
    <>
      <Reorder.Group
        values={items}
        onReorder={setItems}
        className={classes['max-width']}
      >
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            onDragEnd={() => handleListOrderUpdate(items)}
          >
            <ListItem item={item} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <form onSubmit={handleAddItem}>
        <label htmlFor="addItem">Add Item</label>
        <div>
          <input type="text" id="item" name="item" />
          <Button isIcon title="Add Item">
            <IoMdAdd />
          </Button>
        </div>
      </form>
    </>
  );
};
