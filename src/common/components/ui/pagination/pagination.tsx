import { useCallback } from "react";
import ReactPaginate, { ReactPaginateProps } from "react-paginate";
import cs from "classnames";
import styles from "./pagination.module.scss";
import { Icon } from "../icon";
import { Typography } from "../typography";
import { ArrowLeft } from "common/icons";
import { ItemSelect } from "../item-select";

type Props = ReactPaginateProps & {
  currentPage: number;
  onChangePage: (page: number) => void;
  onChangePageSize: (pageSize: number) => void;
};

const PLUG = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "30", label: "30" },
];

export const Pagination = ({
  currentPage,
  pageCount,
  pageRangeDisplayed,
  className,
  onChangePage,
  onChangePageSize,
  ...rest
}: Props) => {
  const handleChange = useCallback(
    ({ selected }: { selected: number }) => {
      onChangePage(selected);
    },
    [onChangePage]
  );

  return (
    <div className={styles.paginationWrapper}>
      <ReactPaginate
        {...rest}
        className={cs(styles.pagination, className)}
        breakLabel="..."
        nextLabel={<Icon width={12} component={ArrowLeft} />}
        previousLabel={<></>}
        forcePage={currentPage - 1}
        pageCount={pageCount}
        onPageChange={handleChange}
        activeClassName={styles.active}
        disabledClassName={styles.disabled}
        pageRangeDisplayed={pageRangeDisplayed}
      />
      <div className={styles.lineCounter}>
        <Typography variant="body2" className={styles.textCounterLeft}>
          Показывать
        </Typography>
        <ItemSelect options={PLUG} defaultValue={PLUG[0]} onGetValue={onChangePageSize} isSmall={true} />
        <Typography variant="body2" className={styles.textCounterRight}>
          записей
        </Typography>
      </div>
    </div>
  );
};
