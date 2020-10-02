import React from 'react';
import './X3DViewer.css';

class X3DViewer extends React.Component {
    

    constructor(props) {
        super(props);
    
        // Este enlace es necesario para hacer que `this` funcione en el callback
        this.handleClick = this.handleClick.bind(this);
        this.transparencyClick = this.transparencyClick.bind(this);
        this.inputEl = React.createRef();
        this.addButton = false;
    }    

    componentDidMount() {
        // glob.handleClick = this.handleClick;
        // this.inputEl.current.querySelector('#Deer__MA_Nose').setAttribute('onclick', 'handleClick()');
        // console.log(X3dom);
        // X3dom.inline(this.props.url);
    }

    handleClick() {

        console.log('CLICK');
        
        if(!this.addButton) {
            console.log('PRIMER IF');
            this.addButton = true;
            this.inputEl.current.querySelector('#Deer__MA_Nose').setAttribute('onclick', 'handleClick();');
            console.log(this.inputEl.current.querySelector('#Deer__MA_Nose'));
        }

        if(this.inputEl.current.querySelector('#Deer__MA_Nose').getAttribute('diffuseColor')!== '1 0 0') {
                this.inputEl.current.querySelector('#Deer__MA_Nose').setAttribute('diffuseColor', '1 0 0');
        } else { 
                this.inputEl.current.querySelector('#Deer__MA_Nose').setAttribute('diffuseColor', '0 0 0');
        }
    }    

    transparencyClick() {
        if(this.inputEl.current.querySelector('#Deer__MA_Nose').getAttribute('transparency')!== '1') {
            this.inputEl.current.querySelector('#Deer__MA_Nose').setAttribute('transparency', '1');
        } else { 
            this.inputEl.current.querySelector('#Deer__MA_Nose').setAttribute('transparency', '0');
        }
    }
    


    render() {
        return (
            <div>
            <button onClick={this.handleClick}>Pintar Nariz</button>            
            <button onClick={this.transparencyClick}>Transparency On / Off</button>            
                {/* <x3d >
                    <scene ref={this.inputEl} onClick={this.handleClick}>
                            <viewpoint position="-1.94639 1.79771 -2.89271" orientation="0.03886 0.99185 0.12133 3.75685"></viewpoint>
                            <inline nameSpaceName="Deer" mapDEFToID="true"
                                    url={this.props.url}  />
                    </scene>
                </x3d> */}

                <x3d showStat="true" width='600px' height='400px'> 
					<scene ref={this.inputEl} onClick={this.handleClick}> 
						<shape onClick={this.handleClick}> 
							<appearance> 
								<material id="Deer__MA_Nose" diffuseColor='1 1 0'></material> 
							</appearance> 
							<box></box> 
						</shape> 
					</scene> 
                </x3d>                 
            </div>
        );
    }
}

export default X3DViewer;