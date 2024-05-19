import { Grid } from "common/components/ui/grid";
import { Cell, Row, Table, TableSection } from "common/components/ui/table";
import styles from "./system.module.scss";
import { Input } from "common/components/ui/input";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Search } from "common/icons";
import { Header } from "common/components/header";
import { Typography } from "common/components/ui/typography";
import { Button } from "../../../common/components/ui/button";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { searchUserAgreements, setAdminUserAgreements } from "../../../services/app/actions/adminActions";
import { useNotifications } from "../../../common/components/notifications";
import {UserAgreementDto} from "../../../api/dto/UserAgreementDto";

const sortUsers = ({ accepted: acceptedA }: UserAgreementDto, { accepted: acceptedB }: UserAgreementDto ) => {
  return new Date(acceptedA) < new Date(acceptedB) ? 1 : -1;
};

export const SystemUsers = () => {
  const [searchString, setSearchString] = useState('');
  const dispatch = useAppDispatch();
  const { error, info, warning } = useNotifications();
  const users = useAppSelector(({ admin }) => admin.userAgreements);

  const handleChangeSearchString = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  }, []);

  const tableAllRows = users.sort(sortUsers).map(({ userId, agreementId, ...rest }: any, index: number) => (
    <TableRow
      id={userId}
      key={`user-${userId}-${agreementId}`}
      index={index + 1}
      handleSetCurrentRow={() => {}}
      handleClickRow={() => {}}
      check={false}
      className={styles.row}
      {...rest}
    />
  ));

  const onSearchClick = useCallback(() => {
    if (!searchString) return;
    dispatch(searchUserAgreements(searchString)).then((result: UserAgreementDto[]) => {
      if(result.length > 0) {
        info(`Найдено ${result.length}`);
      } else {
        warning('Ничего не найдено');
      }
    }).catch((err: any) => {
      error(`Ошибка поиска: ${err}`);
    })
  }, [dispatch, searchString, error, warning, info]);

  const handleSearchInputKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') onSearchClick();
  }, [onSearchClick]);

  useEffect(() => () => {
    dispatch(setAdminUserAgreements([]));
  }, [dispatch])

  return (
    <>
      <Header>
        <Typography variant="body4" weight="500">
          Пользователи
        </Typography>
      </Header>
      <Grid container spacing={2}>
        <Grid item xs={12} className={styles.page}>
          <div className={styles.grid}>
            <Grid container spacing={2}>
              <Grid item xs={8} className={styles.search}>
                <Input
                  placeholder="Введите ID или e-mail пользователя"
                  value={searchString}
                  onChange={handleChangeSearchString}
                  iconLeft={<Search />}
                  onKeyDown={handleSearchInputKeyDown}
                />
                <Button disabled={!searchString} onClick={onSearchClick} >Поиск</Button>
              </Grid>
            </Grid>
          </div>
          <div>
            <Table>
              <TableSection component="thead">
                <Row>
                  <Cell component="th">
                    ФИО
                  </Cell>
                  <Cell component="th">
                    E-mail
                  </Cell>
                  <Cell component="th">
                    Наименование согласия
                  </Cell>
                  <Cell component="th">
                    Версия
                  </Cell>
                  <Cell component="th">
                    Дата принятия
                  </Cell>
                </Row>
              </TableSection>
              <TableSection>
                {tableAllRows}
              </TableSection>
            </Table>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

const TableRow = ({
                    firstName,
                    lastName,
                    patrName,
                    email,
                    name,
                    version,
                    accepted,
                    handleClickRow,
                    className
                  }: any & { index: number }) => {
  return (
    <Row onClick={handleClickRow} className={className}>
      <Cell>
        {`${lastName || ''} ${firstName || ''} ${patrName || ''}`}
      </Cell>
      <Cell>
        {email}
      </Cell>
      <Cell>
        {name}
      </Cell>
      <Cell>
        {version}
      </Cell>
      <Cell>
        {new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(accepted)).replace(',', '')}
      </Cell>
    </Row>
  );
};