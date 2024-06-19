import { createPortal } from 'react-dom';

import { motion } from 'framer-motion';

export const Modal = ({ children, onClose, cssClass }) => {
  return createPortal(
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="backdrop"
        onClick={onClose}
      />
      <motion.dialog
        variants={{
          hidden: { opacity: 0, y: -100 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        exit="hidden"
        open
        id={cssClass}
        onClose={onClose}
        className={cssClass}
      >
        {children}
      </motion.dialog>
    </>,
    document.getElementById('modal')
  );
};
