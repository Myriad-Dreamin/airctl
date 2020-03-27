import * as React from 'react';
import { Link } from 'react-router-dom';

export function Welcome() {
    // noinspection HtmlUnknownAnchorTarget
    return (
        <div>
            Welcome To&nbsp;
            <Link to="/app">AirControlSys</Link>
        </div>
    );
}
