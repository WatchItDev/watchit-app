import React from 'react';
import PropTypes from 'prop-types';
import uid from 'shortid';
import { Box, Button, Typography, Menu, MenuItem } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

export default class NavBarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: false,
      anchorEl: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Object.is(nextState.label, this.state.label) || nextState.anchorEl !== this.state.anchorEl;
  }

  static get propTypes() {
    return {
      list: PropTypes.array.isRequired,
      btnText: PropTypes.string.isRequired,
      onChange: PropTypes.func,
      onGetInitialItem: PropTypes.func,
      icon: PropTypes.string,
    };
  }

  componentDidMount() {
    // If need for initial item
    if (this.props.onGetInitialItem) {
      this.props.list.forEach((i, k) => {
        if (!i.default) return true;
        // Call method
        this.props.onGetInitialItem(this.props.list[k]);
        // Stop loop
        return false;
      });
    }
  }

  handlePreventDefault = (e) => {
    e.preventDefault();
  };

  handleClick = (e) => {
    /***
     * On click event over menu
     * @dataset {label: string, action: string, type: string}
     */

    // On change
    this.handlePreventDefault(e);
    const obj = e.currentTarget;
    const dataset = obj.dataset;
    const { label } = dataset;

    // Assign new label
    this.setState({ label, anchorEl: null });
    // Select action
    if (this.props.onChange) {
      this.props.onChange(dataset);
    }
  };

  handleMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { list, btnText } = this.props;
    const { label, anchorEl } = this.state;

    return (
        <Box sx={{ position: 'relative' }}>
          {list.length > 0 && (
              <Box>
                <Button
                    onClick={this.handleMenuOpen}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'white',
                      textDecoration: 'none',
                      textTransform: 'none',
                      backgroundColor: 'transparent !important',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                >
                  <ArrowDropDown sx={{ marginRight: '0.5rem', fontSize: '2rem' }} />
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    {btnText}
                  </Typography>
                  {label ? (
                      <Typography variant="body1" sx={{ color: '#2196f3', marginLeft: '0.5rem' }}>
                        {label}
                      </Typography>
                  ) : (
                      list.map(
                          (i) =>
                              i.default && (
                                  <Typography
                                      key={uid.generate()}
                                      variant="body1"
                                      sx={{ color: '#2196f3', marginLeft: '0.5rem' }}
                                  >
                                    {i.label}
                                  </Typography>
                              )
                      )
                  )}
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleMenuClose}
                    sx={{
                      '& .MuiPaper-root': {
                        boxShadow: 'none !important',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        transform: 'translateY(20px)',
                      }
                    }}
                    MenuListProps={{
                      sx: {
                        color: 'white',
                        position: 'relative',
                        padding: '1rem',
                        maxHeight: '21rem',
                        display: 'inline-grid',
                        gridAutoFlow: 'column',
                        gridTemplateRows: 'repeat(7, auto)',
                        '& .MuiMenuItem-root': {
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        },
                      },
                    }}
                >
                  {list.map((i) => (
                      <MenuItem
                          key={uid.generate()}
                          onClick={this.handleClick}
                          data-action={i.action}
                          data-label={i.label}
                          data-type={i.type}
                          sx={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                          }}
                      >
                        <Typography variant="body1">{i.label}</Typography> {i.icon}
                      </MenuItem>
                  ))}
                </Menu>
              </Box>
          )}
        </Box>
    );
  }
}
