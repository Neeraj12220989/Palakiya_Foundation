import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client.js';

const ContentContext = createContext({});

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const refresh = () =>
    api
      .get('/content')
      .then((res) => setContent(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => {
    refresh();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, refresh }}>
      {children}
    </ContentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContent = () => useContext(ContentContext);
