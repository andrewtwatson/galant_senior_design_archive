import './AlgorithmControls.scss'

import { useEffect } from "react"
import { asset } from 'util/assets';

export default function AlgorithmControls(props) {

    function frontButtonPress() {
        if (!document.getElementById("forwardbutton").disabled) {
            props.onForward();
        }
    } 

    function backButtonPress() {
        if (!document.getElementById("backbutton").disabled) {
            props.onBack();
        }
    }   

    function handleKeyPress(event) {
        if (event.key === 'ArrowLeft') {
            backButtonPress();
        }
        else if (event.key === 'ArrowRight') {
            frontButtonPress();
        }
    }

    //the windowlistener for back for forward and backward button presses
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress, true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="AlgorithmControls">

            <div className='arrow'>
                <button id='backbutton' disabled={!props.status.canStepBack} onClick={backButtonPress}>
                    <img src={asset('/img/left_arrow.svg')} alt="backward arrow"/>
                </button>
            </div>
            <div className='stepcounter'>
                <p>Step {props.status.displayState}/{props.status.algorithmState}</p>
            </div>
            <div className='arrow'>
                <button id='forwardbutton' disabled={!props.status.canStepForward} onClick={frontButtonPress}>
                    <img src={asset('/img/right_arrow.svg')} alt="forward arrow"/>
                </button>
            </div>

        </div>
    );
}
