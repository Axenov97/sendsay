import React from 'react'
import Mode from "./components/Mode";
import Panel from "./components/Panel";

function App() {

    return <div className='calculator'>
        <Panel panelName='palette' />
        <div className="right-section">
            <Mode />
            <Panel panelName='canvas' />
        </div>
    </div>
}

export default App
