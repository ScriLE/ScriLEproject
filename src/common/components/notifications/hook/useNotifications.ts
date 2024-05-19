import { NotificationsContext } from '../Notifications';
import { ReactNode, useContext, useMemo } from 'react';

export const useNotifications = () => {
  const { push, clearAll } = useContext(NotificationsContext);

  return useMemo(
    () => ({
      info: (content: ReactNode) =>
        push({ content, severity: 'info' }),
      warning: (content: ReactNode) =>
        push({ content, severity: 'warning' }),
      error: (content: ReactNode) =>
        push({ content, severity: 'error' }),
      clearAll
    }),
    [push, clearAll]
  );
};
