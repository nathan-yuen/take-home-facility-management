import { createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import { Autocomplete, AutocompleteGetTagProps, Pagination } from '@material-ui/lab';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Query } from 'react-apollo';
import Facility from '../../typings/Facility';
import constants from '../constants';
import useDebounce from '../hooks/useDebounce';
import usePrevious from '../hooks/usePrevious';
import { LIST_FACILITIES } from '../queries';
import FacilityCard from './FacilityCard';
import LoadingGrid from './LoadingGrid';
import SizeChip from './SizeChip';

interface Props {
  onEditFacility: (facility: Facility) => void;
  onRemoveFacility: (facility: Facility) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchSection: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2)
    },
    searchBox: {
      flexGrow: 1
    },
    footer: {
      padding: theme.spacing(2)
    }
  })
);

const renderSizeFilterInput = (params: unknown) => <TextField {...params} label="Filter by size" />;

const renderSizeFilterValue = (selected: string[], getTagProps: AutocompleteGetTagProps) => {
  return selected.map((size: string, index: number) => <SizeChip {...getTagProps({ index })} size={size} />);
};

export default function(props: Props) {
  const classes = useStyles();

  const { onEditFacility, onRemoveFacility } = props;

  const [page, setPage] = useState(1);
  const [limit] = useState(15);

  const [searchFilter, setSearchFilter] = useState('');
  const dSearchFilter = useDebounce(searchFilter, 300);
  const prevSearchFilter = usePrevious(dSearchFilter);

  const [sizeFilter, setSizeFilter] = useState<string[]>([]);
  const prevSizeFilter = usePrevious(sizeFilter);

  const onPageChange = (event: object, pageNum: number) => {
    setPage(pageNum);
  };

  const onSearchChange = useCallback(event => setSearchFilter(event.target.value), [setSearchFilter]);

  const onSizeFilterChange = (_, value: string[]) => {
    setSizeFilter(value);
  };

  const filterTextRegex = useMemo(() => (dSearchFilter ? new RegExp(dSearchFilter, 'i') : null), [dSearchFilter]);

  useEffect(() => {
    if (dSearchFilter !== prevSearchFilter || sizeFilter !== prevSizeFilter) {
      setPage(1);
    }
  }, [dSearchFilter, sizeFilter]);

  return (
    <>
      <Grid className={classes.searchSection} spacing={3} container justify="space-between" alignItems="flex-end">
        <Grid item className={classes.searchBox}>
          <TextField fullWidth label="Search" value={searchFilter} onChange={onSearchChange} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Autocomplete
            multiple
            value={sizeFilter}
            options={Object.keys(constants.SIZES)}
            filterSelectedOptions
            renderTags={renderSizeFilterValue}
            renderInput={renderSizeFilterInput}
            onChange={onSizeFilterChange}
          />
        </Grid>
      </Grid>
      <Query
        query={LIST_FACILITIES}
        fetchPolicy="network-only"
        variables={{ filter: dSearchFilter, sizeFilter, limit, offset: (page - 1) * limit }}
      >
        {({ loading, data }) => {
          let content: JSX.Element;
          let footer: JSX.Element;

          window.scrollTo(0, 0);

          if (loading) {
            content = <LoadingGrid count={limit} />;
          } else if (data && data.facilities) {
            const { items, total } = data.facilities;
            const pageCount = Math.round(total / limit);

            content = items.map((facility: Facility) => (
              <Grid item lg={4} sm={6} xs={12} key={facility.id}>
                <FacilityCard
                  filterTextRegex={filterTextRegex}
                  facility={facility}
                  onEdit={onEditFacility}
                  onRemove={onRemoveFacility}
                />
              </Grid>
            ));

            footer = (
              <Grid container className={classes.footer} justify="center">
                <Pagination count={pageCount} page={page} onChange={onPageChange} />
              </Grid>
            );
          }

          return (
            <>
              <Grid container spacing={3}>
                {content}
              </Grid>
              {footer}
            </>
          );
        }}
      </Query>
    </>
  );
}
