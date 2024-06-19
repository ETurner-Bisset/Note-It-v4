const date = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer>
      <p>
        ETB &copy; Copyright <span>{date}</span>
      </p>
    </footer>
  );
};
