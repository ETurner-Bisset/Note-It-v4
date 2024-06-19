import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Button } from '../Button';
import { MobileMenu } from './MobileMenu';

export const MainNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState();

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
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
