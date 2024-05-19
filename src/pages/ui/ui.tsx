import { Button } from "common/components/ui/button";
import { Grid } from "common/components/ui/grid";
import { Icon } from "common/components/ui/icon";
import { Input } from "common/components/ui/input";
import { Pagination } from "common/components/ui/pagination";
import { Cell, Row, Table, TableSection } from "common/components/ui/table";
import { Typography } from "common/components/ui/typography";
import {
  ArrowDown,
  ArrowUp,
  CheckOfMedium,
  CheckOnMedium,
  Exit,
  Export,
  Eye,
  EyeCrossed,
  Person,
} from "common/icons";

export const Ui = () => {
  return (
    <>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Typography variant="body2">Кнопки</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button variant="outlined">Добавить единицу контента</Button>
          <Button>Добавить единицу контента</Button>
          <Button variant="alert">Добавить единицу контента</Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button variant="outlined" disabled>
            Добавить единицу контента
          </Button>
          <Button disabled>Добавить единицу контента</Button>
          <Button variant="alert" disabled>
            Добавить единицу контента
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button variant="outlined" size="small">
            Добавить единицу контента
          </Button>
          <Button size="small">Добавить единицу контента</Button>
          <Button variant="alert" size="small">
            Добавить единицу контента
          </Button>
        </Grid>
      </Grid>
      <br />
      <div
        style={{
          display: "flex",
          fill: "#84BD00",
        }}
      >
        <Icon width={40} component={EyeCrossed} />
        <Icon width={40} component={Eye} />
        <Icon width={40} component={CheckOfMedium} />
        <Icon width={40} component={CheckOnMedium} />
        <Icon width={40} component={Person} />
        <Icon width={40} component={ArrowDown} />
        <Icon width={40} component={ArrowUp} />
        <Icon width={40} component={Exit} />
        <Icon width={40} component={Export} />
      </div>

      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Typography variant="body4">Таблица</Typography>
        </Grid>
      </Grid>
      <Table>
        <TableSection component="thead">
          <Row>
            <Cell component="th">№</Cell>
            <Cell component="th" isSortable>
              Cell
            </Cell>
            <Cell component="th" isSortable>
              Cell
            </Cell>
            <Cell component="th" isSortable>
              Cell
            </Cell>
            <Cell component="th" isSortable>
              Cell
            </Cell>
          </Row>
        </TableSection>
        <TableSection>
          <Row>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
          </Row>
          <Row>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
          </Row>
          <Row>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
            <Cell>Cell</Cell>
          </Row>
        </TableSection>
      </Table>

      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Typography variant="body4">Инпут</Typography>
        </Grid>
      </Grid>
      <Input
        name={"input"}
        label="Лейбл"
        placeholder="Плейссходер"
        icon={<Icon component={Eye} />}
      />
      <Pagination
        currentPage={1}
        pageCount={10}
        onChangePage={() => console.log("handleChange")}
      />
    </>
  );
};
