//Basic
import React from 'react'
import Oy from 'oy-vey';

const {Table, TBody, TR, TD} = Oy;

//Login view class
export default (props)=> {
    return (
        <Table width="100%">
            <TBody>
                <TR>
                    <TD align="center">
                        {props.children}
                    </TD>
                </TR>
            </TBody>
        </Table>
    )

}
