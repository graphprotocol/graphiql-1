import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  Select as Selector,
  MenuItem as MuiMenuItem,
  Input,
} from '@material-ui/core';
import MenuItem from './MenuItem';

/**
 * Dropdown menu that's in the Toolbar
 * and contains Saved queries
 *
 */
export class SimpleMenu extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedValue: this.props.options[0].name,
    };
  }

  handleChange = e => {
    e.preventDefault();
    this.setState({ selectedValue: e.target.value });
  };

  render() {
    const MenuProps = {
      PaperProps: {
        style: {
          borderRadius: '4px',
          backgroundColor: 'rgba(30,26,48,0.94)',
          boxShadow: '0 -20px 24px 0 rgba(0,0,0,0.4)',
          width: '350px',
          marginLeft: '-17px',
          marginTop: '-17px',
          border: '1px solid rgba(255,255,255,0.08)',
        },
      },
    };
    const { options } = this.props;

    return (
      <form className="simple-menu" autoComplete="off">
        <FormControl className="form-control">
          <Selector
            value={this.state.selectedValue}
            onChange={this.handleChange}
            input={
              <Input
                name={options.name}
                id={options.id}
                value={this.state.selectedValue}
                className="menu-input"
              />
            }
            renderValue={value => value}
            IconComponent={() => (
              <img
                className="menu-icon"
                src={`${process.env.PUBLIC_URL}/images/selector-icon.svg`}
              />
            )}
            MenuProps={MenuProps}>
            {options &&
              options.map(option => (
                <MuiMenuItem
                  value={option.name}
                  key={option.id}
                  className="menu">
                  <MenuItem
                    header={option.name}
                    className="item"
                    selected={this.state.selectedValue === option.name}
                    isDefault={option.default}
                  />
                </MuiMenuItem>
              ))}
          </Selector>
        </FormControl>
      </form>
    );
  }
}
