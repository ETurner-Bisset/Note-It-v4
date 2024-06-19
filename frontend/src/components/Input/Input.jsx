import { motion } from 'framer-motion';
import { useState } from 'react';

import { Button } from '../Button';
import classes from './Inputs.module.css';

export const Input = ({ isTextarea, label, id, ...props }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleTogleShowPassword = () => {
    setPasswordVisible((showPassword) => !showPassword);
  };

  let inputType = 'password';

  if (passwordVisible) {
    inputType = 'text';
  }

  return (
    <>
      {!id.includes('item') && (
        <>
          <label htmlFor={id}>{label}:</label>
          {isTextarea && (
            <textarea
              className="noteTextarea"
              id={id}
              name={id}
              {...props}
            ></textarea>
          )}
          {!isTextarea && id !== 'password' && (
            <input id={id} name={id} {...props} />
          )}
          {id === 'password' && (
            <div>
              <input
                // className={classes.form.input}
                id={id}
                name={id}
                type={inputType}
                required
              />
              <Button
                type="button"
                isIcon
                title="Show Password"
                onClick={handleTogleShowPassword}
              >
                {passwordVisible && <i className="fa-regular fa-eye"></i>}
                {!passwordVisible && (
                  <i className="fa-regular fa-eye-slash"></i>
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {id.includes('item') && (
        <div className={classes['item-container']}>
          <label htmlFor={id}>{label}.</label>
          <motion.input
            {...props}
            name={id}
            id={id}
            variants={{
              hidden: { y: -5, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            initial="hidden"
            animate="visible"
          />
        </div>
      )}
    </>
  );
};
