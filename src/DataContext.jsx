import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [D, setD] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/festival-react/api/data.php')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(raw => {
        setD({
          stages: raw.stages,
          sat: raw.sat,
          sun: raw.sun,
          acts: raw.acts,
          i18n: {
            nl: { ...translations.nl, info: raw.info.nl },
            en: { ...translations.en, info: raw.info.en },
          },
        });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <DataContext.Provider value={{ D, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export const useAppData = () => useContext(DataContext);
