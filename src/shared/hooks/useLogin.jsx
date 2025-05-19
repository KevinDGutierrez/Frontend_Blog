import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../../services';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await loginRequest({ email, password });
      setLoading(false);

      if (response.error || response.status >= 400) {
        const msg = response.e?.response?.data?.msg || 'Ocurrió un error al iniciar sesión';
        return toast.error(msg);
      }

      const userDetails = response.data?.userDetails || response.data;
      const { token, status, ...restUser } = userDetails || {};

      if (status === false) {
        return toast.error('El usuario está desactivado. Contacta al administrador.');
      }

      if (!token) {
        return toast.error('No se recibió el token');
      }

      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify({ token, status, ...restUser }));

      toast.success('Sesión iniciada exitosamente');
      navigate('/');
    } catch (err) {
      setLoading(false);
      toast.error('Error inesperado al iniciar sesión');
      console.error('Login error:', err);
    }
  };

  return {
    login,
    loading,
  };
};
