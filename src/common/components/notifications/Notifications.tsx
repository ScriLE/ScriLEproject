import React, { createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cs from "classnames";
import styles from './notification.module.scss';

export type NotificationSeverity = 'warning' | 'error' | 'info';

export type NotificationPlacement = 'right' | 'left' | 'middle';

export interface AlertProps {
  key?: string;
  severity: NotificationSeverity;
  content: ReactNode;
  state?: 'closed' | 'open';
}

export interface NotificationsContextValueType {
  push(props: AlertProps): void;
  close(index: number): void;
  clearAll(): void;
}

export interface NotificationsProps {
  children: ReactNode;
  placement?: NotificationPlacement;
  closable?: boolean;
  closingDelay?: number;
  maxAlerts?: number;
}

const noop = () => {};

export const NotificationsContext =
  createContext<NotificationsContextValueType>({
    push: noop,
    close: noop,
    clearAll: noop
  });

export const Notifications = ({
                                children,
                                placement = 'right',
                                closable = true,
                                closingDelay = 5000,
                                maxAlerts = 5
                              }: NotificationsProps) => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);
  const alertKey = useRef(0);
  const timerId = useRef<NodeJS.Timer>();

  const clearingLoop = () => {
    timerId.current && clearInterval(timerId.current);
    timerId.current = setInterval(() => {
      setAlerts((alerts) => {
        if (!alerts.length) return alerts;
        return alerts
        .filter((alert) => alert.state !== 'closed')
        .map((alert, index) => ({
          ...alert,
          state: index === 0 ? 'closed' : alert.state
        }));
      });
    }, closingDelay);
  };

  const push = useCallback(
    (props: AlertProps) => {
      setAlerts((alerts) => [
        ...alerts
        .filter((item) => item.state !== 'closed')
        .slice(1 - maxAlerts),
        {
          key: `notification-alert-${(alertKey.current += 1)}`,
          ...props
        }
      ]);
      clearingLoop();
    },
    // eslint-disable-next-line
    [setAlerts, maxAlerts]
  );

  const close = useCallback(
    (index: number) =>
      setAlerts((alerts) =>
        alerts.map((item, itemIndex) => ({
          ...item,
          state: itemIndex === index ? 'closed' : item.state
        }))
      ),
    [setAlerts]
  );

  const clearAll = useCallback(
    () =>
      setAlerts((alerts) =>
        alerts
        .filter((item) => item.state !== 'closed')
        .map((item) => ({ ...item, state: 'closed' }))
      ),
    [setAlerts]
  );


  useEffect(() => {
    return () => timerId.current && clearInterval(timerId.current);
  }, [closingDelay]);

  const value = useMemo(
    () => ({
      push,
      close,
      clearAll
    }),
    [push, close, clearAll]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <div className={cs(styles.notifications, {
        [styles.left]: placement === 'left',
        [styles.middle]: placement === 'middle',
      })}>
        {alerts.map(
          ({ content, state, severity, key }, index) => (
            <div
              key={key}
              className={cs(styles.alert, {
                [styles.info]: severity === 'info',
                [styles.warning]: severity === 'warning',
                [styles.error]: severity === 'error',
              })}
              onClick={() => closable && close(index)}
            >
              <div>
                {content}
              </div>
            </div>
          )
        )}
      </div>
    </NotificationsContext.Provider>
  );
};
