import { NavLink } from 'react-router-dom';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Modal } from '../Modal';
import { Button } from '../Button';
import classes from './MainNav.module.css';
import { useHttpHook } from '../../hooks/http-hook';

export const MobileMenu = ({ onClose }) => {
  const { user } = useRouteLoaderData('user');
  const { sendRequest } = useHttpHook();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await sendRequest('/api/v1/users/logout');
      // console.log(response);
      onClose();
      navigate('/login');
    } catch (error) {
      // console.log(error);
      toast.error('Error logging out!', {
        position: 'top-center',
      });
    }
    onClose();
  };

  return (
    <Modal onClose={onClose} cssClass={classes.mobileMenu}>
      <div>
        <Button title="Close Menu" onClick={onClose}>
          Menu <i className="fa-solid fa-chevron-up"></i>
        </Button>
        {user && (
          <ul>
            <li>
              <NavLink
                onClick={onClose}
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onClose}
                to="/user"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                User Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onClose}
                to="/contact"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Contact Us
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onClose}
                to="/about"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <Button onClick={logout}>Logout</Button>
            </li>
          </ul>
        )}
        {!user && (
          <ul>
            <li>
              <NavLink
                onClick={onClose}
                to="/"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onClose}
                to="/contact"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Contact Us
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={onClose}
                to="about"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink onClick={onClose} to="login" className="button">
                Login
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </Modal>
  );
};
