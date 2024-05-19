import { Grid } from "common/components/ui/grid";
import { Button } from "common/components/ui/button";
import { Cell, Row, Table, TableSection } from "common/components/ui/table";
import { Checkbox } from "common/components/ui/checkbox";
import { SystemDto } from "api/dto/SystemDto";
import styles from "./system.module.scss";
import { Dialog } from "common/components/ui/dialog";
import { useCallback, useEffect, useMemo, useState} from "react";
import { useNavigate } from "react-router-dom";
import { fetchAgreement, fetchSystem, modifySystemAgreements } from "services/app/actions/adminActions";
import { useAppDispatch } from "hooks/hooks";
import { AgreementDto } from "api/dto";

type SystemAgreementsProps = {
  system?: Partial<SystemDto>
};

export const SystemAgreements = ({ system }: SystemAgreementsProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [agreements, setAgreements] = useState<AgreementDto[]>([]);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isOpenDetachDialog, setIsOpenDetachDialog] = useState(false);

  useEffect(() => {
    (async () => {
      if(!system?.requiredAgreements) return;
      const agreements = (await Promise.all(system.requiredAgreements.map((id) =>
        dispatch(fetchAgreement(id))
      )));
      setAgreements(agreements);
    })();
  }, [system, dispatch]);

  const handleSetCurrentRow = useCallback((id: number) => {
    setSelectedRows((selectedRows) => {
      if(selectedRows.has(id)) {
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
      setSelectedRows(new Set(agreements?.map(({id}) => id)) || []);
    }
  }, [agreements, checkAll]);

  const handleDetachClick = useCallback(() => {
    setIsOpenDetachDialog(true);
  }, []);

  const detachDialogContent = useMemo(() => {
    if(selectedRows.size === 1) {
      const item = agreements?.find(({id, name}) => selectedRows.has(id));
      return `Отвязать “${item?.name}”?`
    }
    return `Отвязать выбранные согласия (${selectedRows.size})?`;
  }, [agreements, selectedRows])

  const handleDetach =  useCallback(async () => {
    if(!system?.id) return;
    await dispatch(modifySystemAgreements({
      id: system.id,
      payload: agreements?.filter(({id}) => !selectedRows.has(id)).map(({id}) => id)
    }));
    await dispatch(fetchSystem(system.id))
    setSelectedRows(new Set([]));
    setIsOpenDetachDialog(false);
  }, [dispatch, system, agreements, selectedRows]);

  const handleAttach =  useCallback(async () => {
    if(!system) return;
    navigate(`/admin/systems/attach-agreement/${system.id}`)
  }, [navigate, system]);

  const tableAllRows = agreements?.map(( { id, ...rest }: any, index: number) => (
    <TableRow
      id={id}
      key={`agreement-${id}-${index}`}
      index={index + 1}
      handleSetCurrentRow={handleSetCurrentRow}
      handleClickRow={() => {}}
      check={selectedRows.has(id)}
      {...rest}
    />
  ));

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} className={styles.page}>
          <div className={styles.grid}>
            <Grid container spacing={2}>
              <Grid item>
                <Button onClick={handleAttach}>Добавить согласие</Button>
              </Grid>
              <Grid item>
                <Button variant="alert-outlined" disabled={!selectedRows.size} onClick={handleDetachClick}>Отвязать от системы</Button>
              </Grid>
            </Grid>
          </div>
          <div className={styles.pageContent}>
            <Table>
              <TableSection component="thead">
                <Row>
                  <Cell component="th">
                    <Checkbox
                      value={checkAll}
                      onChange={handleCheckAll}
                    />
                  </Cell>
                  <Cell component="th" isSortable>
                    Согласие
                  </Cell>
                  <Cell component="th" isSortable>
                    Версия
                  </Cell>
                  <Cell component="th" isSortable>
                    Дата загрузки
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
      <Dialog
        visible={isOpenDetachDialog}
        onSubmit={handleDetach}
        onClose={() => setIsOpenDetachDialog(false)}
        submitButtonText={'Отвязать'}
      >
        {detachDialogContent}
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
  handleClickRow
}: any & { index: number }) => {
  return (
    <Row onClick={handleClickRow}>
      <Cell widthCell={40} onMouseUp={() => handleSetCurrentRow(id)}>
        <Checkbox value={check} label={""} />
      </Cell>
      <Cell>
        {name}
      </Cell>
      <Cell>
        {version}
      </Cell>
      <Cell>
        {new Date(created).toLocaleDateString()}
      </Cell>
    </Row>
  );
};