import React from 'react'
import BoxButton from 'front/components/forms/app-buttons/index.jsx'
import Input from 'front/components/forms/app-inputs/index.jsx'

export default class BoxInput extends React.Component {

    static get defaultProps() {
        return {
            id: "file-upload",
            color: "orange",
            content: "Upload",
            type: 'button'
        }
    }

    handleClick(id) {
        let _file = document.querySelector('#' + id);
        _file.click();
    }

    handleOnChange(e) {
        // Create reader
        let _reader = new FileReader();
        let _file = e.target.files[0];

        if (_file) {
            // Handle loader
            _reader.addEventListener('loadend', () => {
                //Handle on change reflect event
                if (this.props.onChange)
                    this.props.onChange(
                        _reader.result, _file
                    )
            });

            //Read file
            _reader.readAsDataURL(_file);

        }
    }


    render() {
        return (
            <div>
                <BoxButton
                    className={this.props.color}
                    onClick={(e)=>this.handleClick(this.props.id)}
                >
                    <span>
                        {this.props.content}
                    </span>
                </BoxButton>

                <div className="hidden">
                    <Input
                        type="file" onChange={(e)=>this.handleOnChange(e)}
                        placeholder="image file" id={this.props.id}
                        accept="image/*"
                    />
                </div>
            </div>
        )
    }
}
