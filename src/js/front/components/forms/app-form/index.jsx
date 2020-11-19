import React from 'react'
import PropTypes from 'prop-types'
import uid from "shortid";
import BoxAlert from 'js/front/components/forms/app-alerts/index.jsx'
import BoxInput, {BoxTextArea} from 'js/front/components/forms/app-inputs/index.jsx'
import BoxButton from 'js/front/components/forms/app-buttons/index.jsx'

export default class FormBox extends React.Component {

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
            textarea: PropTypes.array.isRequired,
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
                    {
                        this.props.textarea.map((i, k) => {
                            return (
                                <div key={k} className={"input-field-black col " + i.size}>
                                    <BoxTextArea {...i} onChange={this.setValue}/>
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
                                <BoxButton key={uid.generate()} clicked={this.props.submitted}
                                           className={i.color} type={i.type}>
                                    <span>{i.text}</span>
                                </BoxButton>
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
                                    <BoxAlert key={uid.generate()}>
                                        {i}
                                    </BoxAlert>
                                )
                            })
                        }
                    </div>
                }

                {/* Success message */}
                {this.props.success && <BoxAlert label="success-label">
                    {this.props.success}
                </BoxAlert>}
            </form>
        )
    }
}
