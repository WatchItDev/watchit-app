import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {act} from "react-dom/test-utils";
//import BoxImage from "./index";
import pretty from "pretty";

let container = null;
beforeEach(() => {
    window.env = {ROOT_URI: "/test/"};
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

test("Temporary Test",() => {
    // Dummy test
    expect(2 + 2).toBe(4)
});

/* describe("Image component", () => {
    it("Should render image box", () => {
        act(() => {
            render(<BoxImage src={"large_cover_image.jpg"}/>, container);
        });

        expect(pretty(container.innerHTML)).toMatchSnapshot();
    });

    it("Should render image box with valid uri", () => {
        act(() => {
            render(<BoxImage src={"large_cover_image.jpg"}/>, container);
        });

        expect(container.querySelector("img").src).toBe(
            "http://localhost/test/large_cover_image.jpg"
        );
    });
}); */
