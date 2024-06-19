import {
  Form,
  Link,
  useRouteLoaderData,
  redirect,
  useNavigation,
} from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';

import { Button } from '../components/Button';
import { Input } from '../components/Input/Input';
import customFetch from '../utils/customFetch';

const ITEMS_ARRAY = [
  {
    label: '1',
    id: 'item1',
  },
  {
    label: '2',
    id: 'item2',
  },
  {
    label: '3',
    id: 'item3',
  },
  {
    label: '4',
    id: 'item4',
  },
  {
    label: '5',
    id: 'item5',
  },
];

export const AddNotePage = () => {
  const [itemsArray, setItemsArray] = useState(ITEMS_ARRAY);
  const data = useRouteLoaderData('user');
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  const addMoreItems = () => {
    let id = itemsArray.length + 1;
    const newItem = {
      label: id++,
      id: `item${id++}`,
    };
    setItemsArray((prevItems) => {
      return [...prevItems, newItem];
    });
  };

  return (
    <>
      <Helmet>
        <title>Add Note</title>
      </Helmet>
      {data.status !== 'error' && data && (
        <Form className="add-note" method="POST">
          <h3>Add Note</h3>
          <Input label="Title" id="title" />
          <Input isTextarea label="Note Text" id="noteText" rows="7" />
          {itemsArray.map((item) => (
            <Input key={item.id} label={item.label} id={item.id} />
          ))}

          <Button type="button" onClick={addMoreItems}>
            Add More Items
          </Button>
          <Button disabled={isSubmitting}>
            {isSubmitting ? 'Creating Note...' : 'Create Note'}
          </Button>
        </Form>
      )}
      {data.status === 'error' && !data && (
        <p>You must be logged in to create a note.</p>
      )}
      <Link to=".." className="button">
        Back
      </Link>
    </>
  );
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const method = request.method;
  const data = Object.fromEntries(formData);
  let itemsArr = [];
  Object.entries(data).forEach((entry) => {
    if (entry[0].startsWith('item') && entry[1] !== '') {
      itemsArr.push(entry[1]);
    }
  });
  data.listItems = itemsArr;

  try {
    const response = await customFetch(
      'http://localhost:8080/api/v1/notes',
      method,
      JSON.stringify(data)
    );
    // console.log(response);
    if (response.status !== 'success') {
      const responseData = await response.json();
      toast.error(responseData.message, {
        position: 'top-center',
      });
      return null;
    } else {
      toast.success('Note created!', {
        position: 'top-center',
      });
    }
    return redirect('/');
  } catch (error) {
    // console.log(error);
    toast.error('Error creating note!', {
      position: 'top-center',
    });
  }
};
