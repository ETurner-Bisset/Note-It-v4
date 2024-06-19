import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

import { MainNav } from '../components/Nav/MainNav';
import { Footer } from '../components/Footer';
import customFetch from '../utils/customFetch';
import LoadingSpinner from '../components/LoadingSpinner';

export const RootLayout = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <MainNav />
      <main>
        <ToastContainer />
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export const loader = async () => {
  try {
    const response = await customFetch('/me');
    return response;
  } catch (error) {
    // console.log(error);
  }
};
