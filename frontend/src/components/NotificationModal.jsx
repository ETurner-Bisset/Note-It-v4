import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

export const NotificationModal = ({ children, onCancelDelete }) => {
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
        onClick={onCancelDelete}
      ></motion.div>
      <motion.dialog
        variants={{
          hidden: { opacity: 0, y: -30 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        exit="hidden"
        open
        className="notification-modal"
      >
        {children}
      </motion.dialog>
    </>,
    document.getElementById('modal')
  );
};
