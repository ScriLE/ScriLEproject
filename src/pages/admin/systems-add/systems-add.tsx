import React, { useCallback } from "react";
import { Header } from "common/components/header";
import { Grid } from "common/components/ui/grid";
import { Typography } from "common/components/ui/typography";
import { adminAPI } from "api";
import { useNavigate } from "react-router-dom";
import { SystemForm, SystemFormInstance } from "common/forms/system/system";
import { Icon } from "common/components/ui/icon";
import { Backward } from "common/icons";
import { useNotifications } from "common/components/notifications";
import styles from "./systems-add.module.scss";

export const SystemsAdd = () => {
  const navigate = useNavigate();
  const { info, error } = useNotifications();
  
  const onSubmit = useCallback((data: SystemFormInstance) => {
    adminAPI.createSystem({ ...data })    
    .then(() => {
      info('Система успешно создана');
        
      navigate('/admin');
    })
    .catch((err: any) => {
      error(`Ошибка создания системы: ${err}`);
    });
  }, [navigate, info, error]);

  const onCancel = useCallback(() => {
    navigate('/admin');
  }, [navigate])

  return (
    <>
      <Header>
        <div className={styles.header}>
          <Icon component={Backward} onClick={() => navigate(-1)} />
          <Typography variant="body4" weight="500">
            Добавление системы
          </Typography>
        </div>
      </Header>
      <Grid container spacing={2}>
        <Grid item xs={12} className={styles.page}>
          <SystemForm onSubmit={onSubmit} onCancel={onCancel} />
        </Grid>
      </Grid>
    </>
  );
};
