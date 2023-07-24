import { useEffect, useRef } from 'react';

export const useOutsideClick = (handler, listenCapturing) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    };

    //By passing the third argument as true, the event will happend on the way down
    //
    document.addEventListener('click', handleClick, listenCapturing);
    return () =>
      document.removeEventListener('click', handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
};
