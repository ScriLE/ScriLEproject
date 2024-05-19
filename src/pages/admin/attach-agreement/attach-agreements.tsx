import React, { useCallback, useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { Cell, Row, Table, TableSection } from "common/components/ui/table";
import { Checkbox } from "common/components/ui/checkbox";
import { Button } from "common/components/ui/button";
import { Header } from "common/components/header";
import { Typography } from "common/components/ui/typography";
import { Grid } from "common/components/ui/grid";
import { Scrollbar } from "common/components/ui/scrollbar";
import { Footer } from "common/components/footer";
import { Pagination } from "common/components/ui/pagination";
import {fetchAgreements, fetchSystem, modifySystemAgreements} from "services/app/actions/adminActions";
import { useAppDispatch, useAppSelector } from "hooks/hooks";
import { Icon } from "common/components/ui/icon";
import {Backward, Export} from "common/icons";
import styles from "./attach-agreements.module.scss";
import { SystemDto } from "api/dto";
import { useNotifications } from "common/components/notifications";

const initialTableState = {
  page: 0,
  pageSize: 10,
  sortOrder: '~name'
}

export const AttachAgreements = () => {
  const dispatch = useAppDispatch();
  const { id: systemId } = useParams<{ id: string }>();

  const { info, error } = useNotifications();
  useEffect(() => {
    (async () => {
      await dispatch(fetchSystem(Number(systemId)))
    })();
  }, [dispatch, systemId])

  const { items, pageNumber, totalPageCount } = useAppSelector(({ admin }) => admin.agreements);
  const system = useAppSelector(({ admin }) => admin.system);
  const loading = useAppSelector(({ admin }) => admin.loading)

  const navigate = useNavigate();

  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const [currentPage, setCurrentPage] = useState(initialTableState.page);
  const [currentPageSize, setCurrentPageSize] = useState(initialTableState.pageSize);
  const [currentSortOrder, setCurrentSortOrder] = useState(initialTableState.sortOrder);
  // const [searchString, setSearchString] = useState('');

  // const handleChangeSearchString = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  //   setSearchString(e.target.value);
  // }, []);

  useEffect(() => {
    dispatch(fetchAgreements({
      sorting: initialTableState.sortOrder,
      pageNumber: initialTableState.page,
      pageSize: initialTableState.pageSize
    }))
  }, [dispatch]);

  useEffect(() => {
    setSelectedRows(new Set(system.requiredAgreements));
  }, [system])

  const handleSetCurrentRow = useCallback((id: number) => {
    if (system.requiredAgreements?.includes(id)) return;
    setSelectedRows((selectedRows) => {
      if(selectedRows.has(id)) {
        selectedRows.delete(id)
      } else {
        selectedRows.add(id)
      }
      return new Set(selectedRows)
    });
  }, [system.requiredAgreements]);

  const handleCheckAll = useCallback(() => {
    setCheckAll(!checkAll);
    if (checkAll) {
      setSelectedRows(new Set());
    } else if (!checkAll) {
      setSelectedRows(new Set(items.map(({id}) => id)));
    }
  }, [items, checkAll]);

  const handleAttachAgreementClick = useCallback(() => {
    if(!systemId || !system || Number(systemId) !== (system as SystemDto).id) return;

    const requiredAgreements = new Set([
      ...system.requiredAgreements || [],
      ...Array.from(selectedRows.values()),
    ]);

    dispatch(modifySystemAgreements({
      id: Number(systemId),
      payload: Array.from(requiredAgreements.values())
    }))
    .then(() => {
      info(requiredAgreements.size > 1 
        ? `Согласия успешно привязаны (${requiredAgreements.size})` 
        : 'Согласие успешно привязано');
        
      navigate(`/admin/systems/detail/${systemId}`, { state: { isAgreementsTabActive: true } });
    })
    .catch((err: any) => {
      error(`Ошибка привязки согласий: ${err}`);
    });

  }, [dispatch, navigate, systemId, system, selectedRows, info, error]);

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
      check={selectedRows.has(id)}
      {...rest}
    />
  ));

  if(loading) return <h3>Загрузка...</h3>;

  return (
    <>
      <Header>
        <div className={styles.header}>
          <Icon component={Backward} onClick={() => navigate(`/admin/systems/detail/${system.id}`, { state: { isAgreementsTabActive: true } })} />
          <Typography variant="body4" weight="500">
            Привязка требуемых согласий
          </Typography>
        </div>
      </Header>
      <Grid container spacing={2}>
        <Grid item xs={12} className={styles.page}>
          <div className={styles.grid}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Button disabled={!selectedRows.size} onClick={handleAttachAgreementClick}>Добавить выбранное</Button>
              </Grid>
              <Grid item xs={3}/>
              {/*<Grid item xs={6}>*/}
              {/*  <Input*/}
              {/*    placeholder="Введите наименование согласия..."*/}
              {/*    value={searchString}*/}
              {/*    onChange={handleChangeSearchString}*/}
              {/*    iconLeft={<Search />}*/}
              {/*  />*/}
              {/*</Grid>*/}
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
    </>
  );
};

const TableRow = ({
  id,
  check,
  name,
  version,
  created,
  link,
  handleSetCurrentRow,
}: any & { index: number }) => {
  return (
    <Row>
      <Cell widthCell={40} onMouseUp={() => handleSetCurrentRow(id)}>
        <Checkbox value={check} label={""} />
      </Cell>
      <Cell>{name}</Cell>
      <Cell>{version}</Cell>
      <Cell>{new Date(created).toLocaleDateString()}</Cell>
      <Cell>
        <a href={link} target="_blank" rel="noreferrer">
          <Icon component={Export} className={styles.navIcon} width={24} />
        </a>
      </Cell>
    </Row>
  );
};