import React from 'react'
import PropTypes from 'prop-types'
import uid from "shortid";
import Alert from 'components/app-alerts'
import BoxInput from 'components/app-inputs'
import Button from 'components/app-buttons'

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.fields = new FormData();
    }


    static get defaultProps() {
        return {
            input: [],
            buttons: [],
            error: false
        }
    }

    static get propTypes() {
        return {
            input: PropTypes.array.isRequired,
            buttons: PropTypes.array.isRequired,
            action: PropTypes.func.isRequired,
            submitted: PropTypes.bool.isRequired
        }
    }

    setValue = (event) => {
        //If the input fields were directly within this
        //Set input in formData
        this.fields.set(
            event.target.name,
            event.target.value
        );
    }

    handleSubmit = (e) => {
        //Avoid trigger default event
        e.preventDefault();

        //Get default values and return it
        //Merge default values with input values
        this.props.input.reduce((old, v) => {
            //If has value declared on inputs list
            if ('defaultValue' in v && !(old.get(v['name'])))
                old.set(v['name'], v['defaultValue']);
            return old
        }, this.fields);

        //Reflect events
        this.props.action(
            this.fields, e
        );
    }


    render() {
        //Render
        return (
            <form onSubmit={this.handleSubmit} autoComplete="new-password">
                {/*Inputs*/}
                <div className="row">
                    {
                        /* Generate inputs */
                        this.props.input.map((i, k) => {
                            return (
                                <div key={k} className={"input-field-black col " + i.size}>
                                    <BoxInput {...i} onChange={this.setValue}/>
                                </div>
                            )
                        })

                    }
                </div>

                {/*Buttons*/}
                <div className="row">
                    {
                        /* Generate buttons */
                        this.props.buttons.map((i) => {
                            return (
                                <Button key={uid.generate()} clicked={this.props.submitted}
                                           className={i.color} type={i.type}>
                                    <span>{i.text}</span>
                                </Button>
                            )
                        })
                    }
                </div>

                {/* Alert */}
                {
                    this.props.error && this.props.error.length > 0 &&
                    <div className="row">
                        {
                            this.props.error.map((i) => {
                                return (
                                    <Alert key={uid.generate()} color={'danger'}>
                                        {i}
                                    </Alert>
                                )
                            })
                        }
                    </div>
                }

                {/* Success message */}
                {this.props.success && <Alert color="success">
                    {this.props.success}
                </Alert>}
            </form>
        )
    }
}
