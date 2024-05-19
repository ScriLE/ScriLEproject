import { Header } from "common/components/header";
import { Grid } from "common/components/ui/grid";
import { Typography } from "common/components/ui/typography";
import styles from "./system.module.scss";
import { TabContent, Tabs } from "common/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { Page404 } from "pages/public-pages";
import { SystemForm, SystemFormInstance } from "common/forms/system/system";
import React, { useCallback, useEffect } from "react";
import {fetchSystem, modifySystem} from "services/app/actions/adminActions";
import { SystemAgreements } from "./systems-agreements";
import { Icon } from "common/components/ui/icon";
import { Backward } from "common/icons";
import { useNotifications } from "common/components/notifications";

const TABS = ["Информация о системе", "Требуемые согласия"];

export const System = () => {
  const { id: systemId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useAppDispatch();
  const { info, error } = useNotifications();

  const system = useAppSelector(({ admin: { system } }) => system );
  const loading = useAppSelector(({ common: { loading } }) => loading );

  useEffect(() => {
    void dispatch(fetchSystem(Number(systemId)));
  }, [dispatch, systemId]);

  const onUpdateSystem = useCallback((formInstance: SystemFormInstance) => {
    dispatch(modifySystem({ ...formInstance, id: Number(systemId) }))
    .then(() => {
      info('Система успешно изменена');
        
      navigate('/admin');
    })
    .catch((err: any) => {
      error(`Ошибка изменения системы: ${err}`);
    });
  }, [dispatch, systemId, navigate, info, error]);

  const onCancel = useCallback(() => {
    navigate('/admin');
  }, [navigate]);

  if(!loading && (!systemId || !system.id)) return <Page404 />;

  return (
    <>
      <Header>
        <div className={styles.header}>
          <Icon component={Backward} onClick={() => navigate('/admin')} />
          <Typography variant="body4" weight="500">
            {system.name || ''}
          </Typography>
        </div>
      </Header>
      <Grid container spacing={2}>
        <Grid item xs={12} className={styles.page}>
          <Tabs tabs={TABS} activeTab={state?.isAgreementsTabActive && 1}>
            {(activeTab) => (
              <>
                <TabContent activeTab={activeTab} tabIndex={0}>
                  <div className={styles.pageContent}>
                    <SystemForm defaultValues={system} onSubmit={onUpdateSystem} submitButtonText="Сохранить изменения" onCancel={onCancel} />
                  </div>
                </TabContent>
                <TabContent activeTab={activeTab} tabIndex={1}>
                  <div className={styles.pageContent}>
                    <SystemAgreements system={system.id !== Number(systemId) ? undefined : system} />
                  </div>
                </TabContent>
              </>
            )}
          </Tabs>
        </Grid>
      </Grid>
    </>
  );
};