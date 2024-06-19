import { useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import { Button } from '../Button';
import { MobileMenu } from './MobileMenu';

// import classes from './MainNav.module.css';

import { modalIdActions } from '../../store';
import { useState } from 'react';

export const MainNav = () => {
  // const modalId = useSelector((state) => state.modalId.modalId);
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState();

  const openMenu = () => {
    dispatch(modalIdActions.setModalId('menu'));
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    dispatch(modalIdActions.setModalId(''));
    setIsMenuOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && <MobileMenu onClose={closeMenu} />}
      </AnimatePresence>

      <Button title="Open Menu" onClick={openMenu}>
        Menu <i className="fa-solid fa-chevron-down"></i>
      </Button>
    </>
  );
};
