import * as React from 'react'
import {IvyPinch} from './ivypinch';
import {Properties} from './interfaces'; 
import {defaultProperties} from './properties';

interface Props {
	imgPath: string,
	properties?: Properties,
	transitionDuration?: number,
	doubleTap?: boolean,
	doubleTapScale?: number,
	autoZoomOut?: boolean,
	limitZoom?: number | "original image size",
	disabled?: boolean,
	disablePan?: boolean,
	overflow?: "hidden" | "visible",
	disableZoomControl?: "disable" | "never" | "auto",
	backgroundColor?: string,
	limitPan?: boolean,
	minScale?: number,
	listeners?: 'auto' | 'mouse and touch',
	wheel?: boolean,
	autoHeight?: boolean,
	wheelZoomFactor?: number,
	draggableImage?: boolean
}

export class PinchZoom extends React.Component<Props, {isZoomedIn: boolean}> {
	contentRef: any;
	ivyPinch: any;
	isZoomedIn: any;
	_properties: Properties;
	styleObject: any;

	get isTouchScreen() {
	    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
	    var mq = function(query: any) {
	        return window.matchMedia(query).matches;
	    }

	    if (('ontouchstart' in window)) {
	        return true;
	    }

	    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
	    // https://git.io/vznFH
	    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
	    return mq(query);
	}

	constructor(props: any) {
	    super(props);

	    this.state = {
	        isZoomedIn: false
	    };

	    this.contentRef = React.createRef();
	    let changedOptions = this.getProperties(this.props);
	    this.applyOptionsDefault(defaultProperties, changedOptions);
	    this.setStyles();
	}

	componentDidMount() {
	    this.init();
	}

    componentWillUnmount() {
        this.ivyPinch.destroy();
    }

	isDragging() {
	    if (!this.ivyPinch) {
	        return undefined;
	    }
	    return this.ivyPinch.isDragging();
	}

	isControl() {
	    if (this._properties['disabled']) {
	        return false;
	    }

	    if (!this._properties) {
	        return undefined;
	    }

	    if (this._properties['disableZoomControl'] === "disable") {
	        return false;
	    }

	    if (this.isTouchScreen && this._properties['disableZoomControl'] === "auto") {
	        return false;
	    }

	    return true;
	}

	getScale() {
	    if (!this.ivyPinch) {
	        return undefined;
	    }
	    return this.ivyPinch.scale;
	}

	init() {
	    if (this._properties['disabled']) {
	        return;
	    }

	    this._properties['element'] = this.contentRef.current;
	    this._properties['eventHandler'] = this.myEventHandler;
	    this.ivyPinch = new IvyPinch(this._properties);

	    this.pollLimitZoom();
	}

	getProperties(changes: any) {
	    let properties: any = {};

	    for (var prop in changes) {
	        if (changes[prop] !== undefined) {
	            if (prop !== 'properties') {
	                properties[prop] = changes[prop];
	            }
	            if (prop === 'properties') {
	                properties = changes[prop];
	            }
	        }
	    }
	    return properties;
	}

	applyOptionsDefault(defaultOptions: any, options: any): void {
	    this._properties = Object.assign({}, defaultOptions, options);
	}

	myEventHandler(event: any) {
	    if (event.name === "wheel") {
	        this.isZoomedIn = event.detail.scale > 1;
	    }
	}

	toggleZoom() {
	    this.ivyPinch.toggleZoom();

	    if (this.getScale() > 1) {
	        this.setState({
	            isZoomedIn: true
	        });
	    } else {
	        this.setState({
	            isZoomedIn: false
	        });
	    }
	}

	pollLimitZoom() {
	    this.ivyPinch.pollLimitZoom();
	}

	setStyles() {
	    this.styleObject = {
	        'overflow': this._properties['overflow'],
	        'backgroundColor': this._properties['backgroundColor']
	    };
	}

	render() {
		return (
			<div className="pinch-zoom-wrapper" style={this.styleObject}>
				{this.state.isZoomedIn}
				<div className={"pinch-zoom-content " + (this.state.isZoomedIn ? 'pz-zoom-button-out' : null)} ref={this.contentRef}>
					<img src={this.props.imgPath} />
				</div>

				<div className={"pz-zoom-button pz-zoom-control-position-bottom " + (this.state.isZoomedIn ? 'pz-zoom-button-out' : null)}
				onClick={() => this.toggleZoom()}></div>
			</div>
		);
	}
}