import { Header } from "common/components/header";
import { Checkbox } from "common/components/ui/checkbox";
import { Grid } from "common/components/ui/grid";
import { Cell, Row, Table, TableSection } from "common/components/ui/table";
import { Typography } from "common/components/ui/typography";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Footer } from "common/components/footer";
import { Pagination } from "common/components/ui/pagination";
import { Button } from "common/components/ui/button";
import { Scrollbar } from "common/components/ui/scrollbar";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import {fetchSystems, removeSystem, syncSystemUsers} from "services/app/actions/adminActions";
import { useNavigate } from "react-router-dom";
import { Dialog } from "common/components/ui/dialog";
import { useNotifications } from "common/components/notifications";
import styles from "./systems.module.scss";

const TableRow = ({
  id,
  check,
  name,
  url,
  logoUrl,
  handleSetCurrentRow,
  handleClickRow
}: any & { index: number }) => {
  return (
    <Row onClick={handleClickRow}>
      <Cell widthCell={40} onMouseUp={() => handleSetCurrentRow(id)}>
        <Checkbox value={check} label={""} />
      </Cell>
      <Cell>
        <div className={styles.logo} style={{ backgroundImage: logoUrl ? `url(${logoUrl})` : undefined  }}/>
        {name}
      </Cell>
      <Cell>
        <a target="_blank" href={url} rel="noreferrer" onClick={(e) => e.stopPropagation()}>
          <Button variant="text">{url}</Button>
        </a>
      </Cell>
    </Row>
  );
};

const initialTableState = {
  page: 0,
  pageSize: 10,
  sortOrder: '~name'
}

export const Systems = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, pageNumber, totalPageCount } = useAppSelector(({ admin }) => admin.systems);
  const [isOpenRemoveDialog, setIsOpenRemoveDialog] = useState(false);
  const { info, error } = useNotifications();

  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const [currentPage, setCurrentPage] = useState(initialTableState.page);
  const [currentPageSize, setCurrentPageSize] = useState(initialTableState.pageSize);
  const [currentSortOrder, setCurrentSortOrder] = useState(initialTableState.sortOrder);

  useEffect(() => {
    dispatch(fetchSystems({
      sorting: initialTableState.sortOrder,
      pageNumber: initialTableState.page,
      pageSize: initialTableState.pageSize
    }));
  }, [dispatch]);

  const handleSetCurrentRow = useCallback((id: number) => {
      setSelectedRows((selectedRows) => {
        if(selectedRows.has(id)) {
          selectedRows.delete(id);
        } else {
          selectedRows.add(id);
        }
        return new Set(selectedRows);
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

  const handleClickRow = useCallback((id: number) => () => {
    navigate(`/admin/systems/detail/${id}`);
  }, [navigate]);

  const handleCreateSystemClick = useCallback(() => {
    navigate('/admin/systems/add');
  }, [navigate]);

  const handleRemoveSystemClick = useCallback(() => {
    setIsOpenRemoveDialog(true);
  }, []);

  const tableAllRows = items.map(({ id, ...rest }: any, index: number) => (
    <TableRow
      id={id}
      key={`system-${id}`}
      index={index + 1}
      handleSetCurrentRow={handleSetCurrentRow}
      handleClickRow={handleClickRow(id)}
      check={selectedRows.has(id)}
      {...rest}
    />
  ));

  const removeDialogContent = useMemo(() => {
    if(selectedRows.size === 1) {
      const { name } = items.find(({ id }) => selectedRows.has(id)) || {};
      return `Удалить систему “${name}”?`
    }
    return `Удалить выбранные системы (${selectedRows.size})?`;
  }, [items, selectedRows])

  const handleRemove =  useCallback(async () => {
    try {
      await Promise.all(Array.from(selectedRows.values()).map(async (id) => {
        try {
          await dispatch(removeSystem(id));
        } catch (e) {
          const name = items.find((item) => id === item.id)?.name;
          if(e.response?.status === 409) {
            error(`Ошибка удаления системы "${name}": необходимо отвязать согласие от системы.`);
            throw e;
          }
          error(`Ошибка удаления системы "${name}": ${e}`);
          throw e;
        }
      }));
      info(selectedRows.size > 1 ? 'Системы успешно удалены' : 'Система успешно удалена');
    }
    finally {
      setIsOpenRemoveDialog(false);
      dispatch(fetchSystems({
        sorting: currentSortOrder,
        pageNumber: currentPage,
        pageSize: currentPageSize
      }));
      setSelectedRows(new Set([]));
    }
  }, [selectedRows, dispatch, currentSortOrder, currentPage, currentPageSize, items, info, error]);

  const handleChangePage = useCallback((page: number) => {
    setCurrentPage(page);
    dispatch(fetchSystems({
      sorting: currentSortOrder,
      pageNumber: page,
      pageSize: currentPageSize
    }));
  }, [dispatch, currentPageSize, currentSortOrder]);

  const handleChangePageSize = useCallback((pageSize: number) => {
    setCurrentPageSize(pageSize);
    dispatch(fetchSystems({
      sorting: currentSortOrder,
      pageNumber: currentPage,
      pageSize: pageSize
    }));
  }, [dispatch, currentPage, currentSortOrder]);

  const handleSortClick = useCallback((sortingOrder: string) => {
    setCurrentSortOrder(sortingOrder);
    dispatch(fetchSystems({
      sorting: sortingOrder,
      pageNumber: currentPage,
      pageSize: currentPageSize
    }));
  }, [dispatch, currentPage, currentPageSize]);

  const handleUpdateUsersClick = useCallback(async () => {
    await Promise.all(Array.from(selectedRows.values()).map(async (id) => {
      const name = items.find((item) => id === item.id)?.name;
      try {
        await dispatch(syncSystemUsers({id}));
        info(`Пользователи системы "${name || ''}" успешно обновлены`);
      }
      catch (e) {
        if(e.response?.status === 501) {
          error(`Ошибка обновления пользователей системы "${name}": синхронизация пользователей для данной системы не предусмотрена.`);
          return;
        }
        error(`Ошибка обновления пользователей системы "${name}": ${e.message}`);
      }
    }));

    setSelectedRows(new Set([]));
  }, [selectedRows, error, info, dispatch, items]);

  return (
    <>
      <Header>
        <Typography variant="body4" weight="500">
          Справочник систем
        </Typography>
      </Header>
      <Grid container spacing={2}>
        <Grid item xs={12} className={styles.page}>
          <div className={styles.grid}>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={handleCreateSystemClick}>Добавить систему</Button>
              </Grid>
              <Grid item >
                <Button variant="alert-outlined" disabled={!selectedRows.size} onClick={handleRemoveSystemClick}>Удалить</Button>
              </Grid>
              <Grid item className={styles.rightSideButton}>
                <Button variant="outlined" disabled={!selectedRows.size} onClick={handleUpdateUsersClick}>Обновить пользователей</Button>
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
                      Наименование системы
                    </Cell>
                    <Cell name={"url"} component="th" isSortable handleClick={handleSortClick}>
                      URL
                    </Cell>
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
