import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class InfoModal extends React.Component {

    constructor(props) {
        super(props);
    }


    static get defaultProps() {
        return {}
    }

    static get propTypes() {
        return {}
    }

    setValue = (event) => {
        //If the input fields were directly within this
        //Set input in formData
        // this.fields.set(
        //     event.target.name,
        //     event.target.value
        // );
    };


    render() {
        return ReactDOM.createPortal(
            <>
                <div className="modal show fade modal-watchit" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Modal title</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Modal body text goes here.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary">Save changes</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>,
            document.getElementById('background-modal')
        );
    }
}
