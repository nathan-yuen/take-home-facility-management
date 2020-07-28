import { Card, CardContent, CardHeader, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MoreVert } from '@material-ui/icons';
import React, { useCallback, useMemo } from 'react';
import Facility from '../../typings/Facility';
import SizeChip from './SizeChip';

interface Props {
  facility: Facility;
  filterTextRegex: RegExp;
  onEdit: (facility: Facility) => void;
  onRemove: (facility: Facility) => void;
}

const useStyles = makeStyles({
  root: {
    minHeight: '180px',
    '& b': {
      background: '#009688'
    }
  }
});

const renderHighlightSpan = (text: string, range: number[]) => {
  if (range.length) {
    return (
      <>
        {text.substring(0, range[0])}
        <b>{text.substring(range[0], range[1])}</b>
        {text.substring(range[1], text.length)}
      </>
    );
  } else {
    return text;
  }
};

export default function(props: Props) {
  const classes = useStyles();

  const { facility, filterTextRegex, onEdit, onRemove } = props;
  const { name, address, size } = props.facility;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const onEditClick = () => {
    setAnchorEl(null);
    onEdit(facility);
  };

  const onRemoveClick = () => {
    setAnchorEl(null);
    onRemove(facility);
  };

  const onActionsClose = useCallback(() => setAnchorEl(null), [setAnchorEl]);

  const highlightRange = useMemo(() => {
    const ranges = ['name', 'address'].reduce((merged, key) => {
      const text = facility[key];
      const matched = filterTextRegex && filterTextRegex.exec(text);
      return {
        ...merged,
        [key]: matched ? [matched.index, matched.index + matched[0].length] : []
      };
    }, {});

    return ranges;
  }, [filterTextRegex, facility]);

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <>
            <IconButton aria-label="Actions" onClick={event => setAnchorEl(event.currentTarget)}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={onActionsClose}
              disableScrollLock={true}
            >
              <MenuItem onClick={onEditClick}>Edit</MenuItem>
              <MenuItem onClick={onRemoveClick}>Remove</MenuItem>
            </Menu>
          </>
        }
        title={
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {renderHighlightSpan(name, highlightRange['name'])}
          </Typography>
        }
        subheader={<SizeChip size={size} />}
      />
      <CardContent>
        <Typography variant="body1">{renderHighlightSpan(address, highlightRange['address'])}</Typography>
      </CardContent>
    </Card>
  );
}
