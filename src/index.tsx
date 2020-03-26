import * as React from "react";
import * as ReactDOM from "react-dom";
import {AppRouter, Dependencies} from "./view";

const deps:Dependencies = {

};

ReactDOM.render(
    <div>
        <AppRouter {...deps}/>
    </div>,
    document.querySelector('#app'),
);