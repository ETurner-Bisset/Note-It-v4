import { motion } from 'framer-motion';

export const Button = ({
  children,
  onClick,
  isText,
  isIcon,
  isEdit,
  ...props
}) => {
  let btnCss = 'button';
  if (isText) {
    btnCss += ' text-btn';
  }

  if (isIcon) {
    btnCss += ' icon';
  }

  if (isEdit) {
    btnCss += ' edit-button';
  }
  return (
    <motion.button
      {...props}
      onClick={onClick}
      className={btnCss}
      whileHover={{ y: -2 }}
    >
      {children}
    </motion.button>
  );
};
