import React, {useCallback, useEffect} from "react";
import { Header } from "common/components/header";
import { Grid } from "common/components/ui/grid";
import { Typography } from "common/components/ui/typography";
import {useNavigate, useParams} from "react-router-dom";
import { AgreementForm, AgreementFormInstance } from "common/forms/agreement/agreement";
import styles from "./upload.module.scss";
import {useAppDispatch, useAppSelector} from "hooks/hooks";
import {Page404} from "../../public-pages";
import {Icon} from "common/components/ui/icon";
import {Backward} from "common/icons";
import {
  createAgreement,
  fetchAgreement,
  modifyAgreement,
  uploadAgreementContent
} from "services/app/actions/adminActions";
import { useNotifications } from "common/components/notifications";

export const Upload = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id: agreementId } = useParams<{ id: string }>();
  
  const { info, error } = useNotifications();

  useEffect(() => {
    (async () => {
      if(!agreementId) return;
      await dispatch(fetchAgreement(Number(agreementId)));
    })();
  }, [agreementId, dispatch]);

  const agreement = useAppSelector(({ admin }) => agreementId ? admin.agreement : undefined);

  const onSubmit = useCallback(async (data: AgreementFormInstance) => {
    let id = Number(agreementId);
    try {
      if(!agreementId) {
        const createdAgreement = await dispatch(createAgreement({...data}));
        id = createdAgreement.id;
      } else {
        await dispatch(modifyAgreement({id, ...data}));
      }
      id && await dispatch(uploadAgreementContent({
        id,
        file: data.file,
      }));
      info(agreementId ? 'Согласие успешно изменено' : 'Согласие успешно создано');
      navigate('/admin/agreements');
    } 
    catch(e){
      error(agreementId ? `Ошибка изменения согласия: ${e}` : `Ошибка создания согласия: ${e}`);
    } 
  }, [navigate, agreementId, dispatch, info, error]);

  const onCancel = useCallback(() => {
    navigate('/admin/agreements');
  }, [navigate]);

  if(agreementId && !agreement) return <Page404 />;

  return (
    <>
      <Header>
        <div className={styles.header}>
          <Icon component={Backward} onClick={() => navigate(-1)} />
          <Typography variant="body4" weight="500">
            {agreement ? 'Изменения согласия' : 'Загрузка нового согласия'}
          </Typography>
        </div>
      </Header>
      <Grid container spacing={2}>
        <Grid item xs={12} className={styles.page}>
          <AgreementForm defaultValues={agreement} onSubmit={onSubmit} onCancel={onCancel} submitButtonText={agreement ? 'Сохранить' : 'Загрузить'} />
        </Grid>
      </Grid>
    </>
  );
};
