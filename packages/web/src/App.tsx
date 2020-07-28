import {
  AppBar,
  Box,
  Button,
  Container,
  createStyles,
  makeStyles,
  Slide,
  Theme,
  Toolbar,
  Typography,
  useScrollTrigger
} from '@material-ui/core';
import React from 'react';
import FacilitiesPage from './components/FacilitiesPage';

interface Props {
  window?: () => Window;
  children: JSX.Element;
}

const HideOnScroll = (props: Props) => {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

export default function App(props) {
  const classes = useStyles();

  return (
    <Box width={1}>
      <HideOnScroll {...props} className={classes.root}>
        <AppBar position="sticky">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.title}>
              Facilities
            </Typography>
            <Button
              color="inherit"
              className={classes.menuButton}
              href="http://localhost:8080/graphiql"
              target="_blank"
            >
              DEBUG
            </Button>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Container maxWidth="lg">
        <FacilitiesPage />
      </Container>
    </Box>
  );
}


