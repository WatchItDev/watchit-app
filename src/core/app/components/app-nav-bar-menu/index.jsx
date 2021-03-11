import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import uid from "shortid";

export default class NavBarMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            label: false
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !Object.is(nextState.label, this.state.label)
    }

    static get propTypes() {
        return {
            list: PropTypes.array.isRequired,
            btnText: PropTypes.string.isRequired
        }
    }


    componentDidMount() {
        //If need for initial item
        if (this.props.getInitialItem) {
            this.props.list.map((i, k) => {
                if (!i.default) return true;
                //Call method
                this.props.getInitialItem(
                    this.props.list[k]
                );
                //Stop loop
                return false;
            });
        }
    }

    preventDefault(e) {
        e.preventDefault()
    }

    onClick = (e) => {
        /***
         * On click event over menu
         * @dataset {label: string, action: string, type: string}
         */


        //On change
        e.preventDefault();
        let obj = e.target;
        let dataset = obj.dataset
        let {label} = dataset;

        //Assign new label
        this.setState({label: label});
        //Select action
        if (this.props.onChange)
            this.props.onChange(dataset);


    }


    render() {
        return (
            <Container>
                {/*Check for valid list of subs*/}
                {
                    this.props.list.length > 0 && <Item>
                        <ItemButton onClick={this.preventDefault} href={'/'}>
                            <ItemIcon className={`${this.props.icon || "icon-triangle-down"}`}/>
                            <ItemTitle>{this.props.btnText}</ItemTitle>
                            {
                                /*The main button*/
                                //Set personalized label
                                (this.state.label &&
                                    <ItemSecondTitle>
										{this.state.label}
									</ItemSecondTitle>
                                ) || this.props.list.map((i) => {
                                    return (
                                        i.default &&
                                        <ItemSecondTitle key={uid.generate()}>
                                            {i.label}
                                        </ItemSecondTitle>
                                    )
                                })
                            }
                        </ItemButton>

                        {/*Menu List*/}
                        <ItemContent>
                            <ContentList>
                                {
                                    /*The sub menu items*/
                                    this.props.list.map((i) => {
                                        return (
                                            <ContentListItem key={uid.generate()}>
                                                <ContentListItemLink onClick={this.onClick} href={'/'}
                                                                     data-action={i.action} data-label={i.label} data-type={i.type}>
                                                    {i.label} {i.icon}
                                                </ContentListItemLink>
                                            </ContentListItem>
                                        )
                                    })
                                }
                            </ContentList>
                        </ItemContent>
                    </Item>
                }
            </Container>
        )
    }
}

const Container = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

const Item = styled.li`
  transition: background-color 0.3s;
  float: left;
  padding: 0;
  background-color: transparent;
  list-style-type: none;

  &:hover {
    & > a {
      background-color: rgba(0, 0, 0, 0.1);
    }

    & > div {
      display: inline-flex;
      top: 3.5rem;
      position: absolute;
      opacity: 1;
    }
  }
`;

const ItemButton = styled.a`
  color: #fff;
  display: flex;
  padding: 0 15px;
  font-size: 1.2rem;
  width: fit-content;
  cursor: pointer;
  height: 3rem;
  align-items: center;
`;

const ItemIcon = styled.div`
  top: 0.1rem;
  position: relative;
  margin-right: 4px;
  line-height: 1.2rem;
  display: block;
  font-size: 1.2rem
`;

const ItemTitle = styled.div`
  font-size: 1.2rem;
  line-height: 1.2rem;
  color: #fff;
`;

const ItemSecondTitle = styled.div`
  font-size: 1.2rem;
  line-height: 1.2rem;
  margin-left: 5px;
  color: #2196F3;
`;

const ItemContent = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  overflow-x: hidden;
  z-index: 1000;
  border-radius: 0.5rem;
  max-width: 100% !important;
  width: -moz-fit-content;
  width: fit-content;
  position: relative;
  margin: 0;
  display: none;
  min-width: 80px;
  max-height: 650px;
  overflow-y: auto;
  opacity: 0;
  will-change: width, height;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
`;

const ContentList = styled.ul`
  position: relative;
  padding: 1rem;
  max-height: 21rem;
  display: inline-grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, auto);
  margin: 0;
  list-style-type: none;
`;

const ContentListItem = styled.li`
  line-height: normal;
  min-height: auto;
  width: auto;
  background-color: transparent;
  clear: both;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;
  text-align: left;
  text-transform: none;
  transition: background-color 0.3s;
  float: left;
  padding: 0;
  list-style-type: none;
`;

const ContentListItemLink = styled.a`
  padding: 5px 8px !important;
  color: #fff;
  font-size: 15px !important;
  display: flex;
  align-items: flex-end;
  line-height: 22px;
  text-decoration: none;
  background-color: transparent;
  transition: all 0.3s ease-in-out;
  border-radius: 5px;
  
  &:hover {
    background-color: #eee;
    color: #222;
  }
`;