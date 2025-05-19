import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const result = await getUser();

      if (!result.error && result.success) {
        setUser(result.user);
      } else {
        console.error("Error al cargar el usuario:", result.e);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  return { user, loading };
};
