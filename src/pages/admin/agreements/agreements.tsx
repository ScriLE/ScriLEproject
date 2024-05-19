import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cell, Row, Table, TableSection } from "common/components/ui/table";
import { Checkbox } from "common/components/ui/checkbox";
import { Button } from "common/components/ui/button";
import { Header } from "common/components/header";
import { Typography } from "common/components/ui/typography";
import { Grid } from "common/components/ui/grid";
import { Scrollbar } from "common/components/ui/scrollbar";
import { Footer } from "common/components/footer";
import { Pagination } from "common/components/ui/pagination";
import { Dialog } from "common/components/ui/dialog";
import { fetchAgreements, removeAgreement } from "services/app/actions/adminActions";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { Icon } from "common/components/ui/icon";
import { Export } from "common/icons";
import styles from "./agreements.module.scss";
import {useNotifications} from "../../../common/components/notifications";

const initialTableState = {
  page: 0,
  pageSize: 10,
  sortOrder: '~name'
}

export const Agreements = () => {
  const dispatch = useAppDispatch();
  const { items, pageNumber, totalPageCount } = useAppSelector(({ admin }) => admin.agreements);
  const navigate = useNavigate();
  const { info, error } = useNotifications();
  const [isOpenRemoveDialog, setIsOpenRemoveDialog] = useState(false);

  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const [currentPage, setCurrentPage] = useState(initialTableState.page);
  const [currentPageSize, setCurrentPageSize] = useState(initialTableState.pageSize);
  const [currentSortOrder, setCurrentSortOrder] = useState(initialTableState.sortOrder);

  useEffect(() => {
    dispatch(fetchAgreements({
      sorting: initialTableState.sortOrder,
      pageNumber: initialTableState.page,
      pageSize: initialTableState.pageSize
    }))
  }, [dispatch]);

  const handleSetCurrentRow = useCallback((id: number) => {
    setSelectedRows((selectedRows) => {
      if (selectedRows.has(id)) {
        selectedRows.delete(id)
      } else {
        selectedRows.add(id)
      }
      return new Set(selectedRows)
    });
  }, []);

  const handleCheckAll = useCallback(() => {
    setCheckAll(!checkAll);
    if (checkAll) {
      setSelectedRows(new Set());
    } else if (!checkAll) {
      setSelectedRows(new Set(items.map(({id}) => id)));
    }
  }, [items, checkAll]);

  const handleClickUpdateVersion = useCallback((id: number) => () => {
    navigate(`/admin/agreements/upload/${id}`);
  }, [navigate]);

  const handleCreateAgreementClick = useCallback(() => {
    navigate('/admin/agreements/upload');
  }, [navigate]);

  const handleRemoveSystemClick = useCallback(() => {
    setIsOpenRemoveDialog(true);
  }, []);

  const removeDialogContent = useMemo(() => {
    if(selectedRows.size === 1) {
      const { name } = items.find(({ id }) => selectedRows.has(id)) || {};
      return `Удалить “${name}”?`
    }
    return `Удалить выбранные согласия (${selectedRows.size})?`;
  }, [items, selectedRows])

  const handleRemove =  useCallback(async () => {
    try {

      await Promise.all(Array.from(selectedRows.values()).map(async (id) => {
        try {
          await dispatch(removeAgreement(id));
        }
        catch (err) {
          const name = items.find((item) => id === item.id)?.name;
          if(err.response?.status === 409) {
            error(`Ошибка удаления согласия "${name}": объект используется в связях с другими объектами (системы, пользователи).`);
            throw err;
          }

          error(`Ошибка удаления согласия "${name}": ${err}`);
          throw err;
        }
      }));

      info(selectedRows.size > 1
        ? `Согласия успешно удалены (${selectedRows.size})`
        : 'Согласие успешно удалено');
    }
    finally {
      setIsOpenRemoveDialog(false);
      setSelectedRows(new Set([]));
      dispatch(fetchAgreements({
        sorting: currentSortOrder,
        pageNumber: currentPage,
        pageSize: currentPageSize
      }));
    }
  }, [selectedRows, dispatch, currentSortOrder, currentPage, currentPageSize, items, error, info]);

  const handleChangePage = useCallback((page: number) => {
    setCurrentPage(page);
    dispatch(fetchAgreements({
      sorting: currentSortOrder,
      pageNumber: page,
      pageSize: currentPageSize
    }));
  }, [dispatch, currentPageSize, currentSortOrder]);

  const handleChangePageSize = useCallback((pageSize: number) => {
    setCurrentPageSize(pageSize);
    dispatch(fetchAgreements({
      sorting: currentSortOrder,
      pageNumber: currentPage,
      pageSize: pageSize
    }));
  }, [dispatch, currentPage, currentSortOrder]);

  const handleSortClick = useCallback((sortingOrder: string) => {
    setCurrentSortOrder(sortingOrder);
    dispatch(fetchAgreements({
      sorting: sortingOrder,
      pageNumber: currentPage,
      pageSize: currentPageSize
    }));
  }, [dispatch, currentPage, currentPageSize]);

  const tableAllRows = items.map(({ id, ...rest }: any, index: number) => (
    <TableRow
      id={id}
      key={`agreement-${id}`}
      index={index + 1}
      handleSetCurrentRow={handleSetCurrentRow}
      handleClickUpdateVersion={handleClickUpdateVersion(id)}
      check={selectedRows.has(id)}
      {...rest}
    />
  ));

  return (
    <>
      <Header>
        <Typography variant="body4" weight="500">
          Справочник согласий
        </Typography>
      </Header>
      <Grid container spacing={2}>
        <Grid item xs={12} className={styles.page}>
          <div className={styles.grid}>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={handleCreateAgreementClick}>Загрузить</Button>
              </Grid>
              <Grid item>
                <Button variant="alert-outlined" disabled={!selectedRows.size} onClick={handleRemoveSystemClick}>Удалить</Button>
              </Grid>
            </Grid>
          </div>
          <div className={styles.pageContent}>
            <Scrollbar>
              <Table>
                <TableSection component="thead">
                  <Row>
                    <Cell component="th">
                      <Checkbox
                        value={checkAll}
                        onChange={handleCheckAll}
                      />
                    </Cell>
                    <Cell name="name" component="th" isSortable handleClick={handleSortClick}>
                      Наименование
                    </Cell>
                    <Cell name="version" component="th" isSortable handleClick={handleSortClick}>
                      Версия
                    </Cell>
                    <Cell name="created" component="th" isSortable handleClick={handleSortClick}>
                      Дата загрузки
                    </Cell>
                    <Cell component="th" />
                    {/* <Cell component="th" /> */}
                  </Row>
                </TableSection>
                <TableSection>{tableAllRows}</TableSection>
              </Table>
            </Scrollbar>
          </div>
        </Grid>
      </Grid>
      <Footer>
        <Grid container spacing={2} justify="space-between">
          <Grid item xs={12}>
            <Pagination
              currentPage={pageNumber + 1}
              pageCount={totalPageCount}
              onChangePage={handleChangePage}
              onChangePageSize={handleChangePageSize}
            />
          </Grid>
        </Grid>
      </Footer>
      <Dialog
        visible={isOpenRemoveDialog}
        onSubmit={handleRemove}
        onClose={() => setIsOpenRemoveDialog(false)}
        submitButtonText={'Удалить'}
      >
        {removeDialogContent}
      </Dialog>
    </>
  );
};

const TableRow = ({
  id,
  check,
  name,
  version,
  created,
  handleSetCurrentRow,
  handleClickUpdateVersion,
}: any & { index: number }) => {
  return (
    <Row>
      <Cell widthCell={40} onMouseUp={() => handleSetCurrentRow(id)}>
        <Checkbox value={check} label={""} />
      </Cell>
      <Cell onClick={handleClickUpdateVersion}>{name}</Cell>
      <Cell onClick={handleClickUpdateVersion}>{version}</Cell>
      <Cell onClick={handleClickUpdateVersion}>{new Date(created).toLocaleDateString()}</Cell>
      {/*<Cell>*/}
      {/*  <Icon title={'Добавить версию'} component={AddVersion} className={styles.navIcon} width={24} onClick={handleClickUpdateVersion} />*/}
      {/*</Cell>*/}
      <Cell>
        <a href={`/backend/data/agreements/${id}`} target="_blank" rel="noreferrer" title={'Скачать'}>
          <Icon component={Export} className={styles.navIcon} width={24} />
        </a>
      </Cell>
    </Row>
  );
};