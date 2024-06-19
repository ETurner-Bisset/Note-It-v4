import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RootLayout, loader as userLoader } from './pages/RootLayout';
import { ErrorPage } from './pages/Error';
import { UserPage } from './pages/User';
import { AddNotePage, action as addNoteAction } from './pages/AddNote';
import { ContactPage } from './pages/Contact';
import { AboutPage } from './pages/About';
import Login, { action as loginAction } from './pages/Login';
import Register, { action as signupAction } from './pages/Register';
import { SignupConfirmPage } from './pages/SignupConfirm';
import { NoteItem, loader as noteLoader } from './components/Notes/NoteItem';
import { HomePage } from './pages/Home';
import ForgotPassword, {
  action as forgotPasswordAction,
} from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    loader: userLoader,
    id: 'user',
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: 'addNote', element: <AddNotePage />, action: addNoteAction },
      {
        path: ':noteId',
        element: <NoteItem />,
        id: 'note',
        loader: noteLoader,
      },

      { path: 'login', element: <Login />, action: loginAction },

      {
        path: 'signup',
        element: <Register />,
        action: signupAction,
      },
      {
        path: 'user',
        element: <UserPage />,
      },

      { path: 'contact', element: <ContactPage /> },
      { path: 'about', element: <AboutPage /> },
      {
        path: 'signupConfirm',
        element: <SignupConfirmPage />,
        children: [
          {
            path: ':token',
            element: <SignupConfirmPage />,
          },
        ],
      },
      {
        path: 'forgotPassword',
        element: <ForgotPassword />,
        action: forgotPasswordAction,
      },
      { path: 'resetPassword/:token', element: <ResetPassword /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
