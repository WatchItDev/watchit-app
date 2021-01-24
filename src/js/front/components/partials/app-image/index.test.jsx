import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {act} from "react-dom/test-utils";
import BoxImage from "./index";

let container = null;
beforeEach(() => {
    window.env = {ROOT_URI: '/test/'}
    container = document.createElement('div')
    document.body.appendChild(container)
})

afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    container = null
})

describe("Image component", () => {

    it('Render image box with valid uri', () => {
        act(() => {
            render(<BoxImage src={'large_cover_image.jpg'}/>, container)
        })

        expect(
            container.querySelector('img').src
        ).toBe('http://localhost/test/large_cover_image.jpg')

    })


})
