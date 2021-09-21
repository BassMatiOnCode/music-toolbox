//
//	circular-scale-5.js    2021-09-16   usp
//

import { createElement, circle, spiral, line, text } from "/inc/svg-1.js" ;
import { replaceAccidentals } from "/inc/music/music-5.js" ;

const 
	moduleOptions = { d1: 14, d2 : 20} ,
	k = [ ] ;

let target ; 

( function ( ) {
	const a = Math.sin( Math.PI / 6 ) , b = Math.sin( Math.PI / 3 ) ;
	k.push( 0, a, b, 1, b, a, 0, -a, -b, -1, -b, -a );
	} ) ( ) ;

export function setModuleOptions ( o = { } ) {
	// Adds or overwrites module options
	for ( const [ key, value ] of Object.entries( o )) moduleOptions [ key ] = value ;
	}

export function deleteModuleOptions ( keys = [ ] ) {
	// Removes module options
	for ( const key in keys ) delete moduleOptions[ key ] ; 
	}

export function createCircularScale ( t, ...drawingCommands ) {
	/// t : target element reference or ID string
	/// drawingCommand : Comma separated list of drawing command objects
	// Find the target element
	target = typeof t === "string" ? document.getElementById( t ) : t ;
	target.setAttribute( "stroke-linecap" , "round" ); 
	for ( let i = 0 ; i < drawingCommands.length ; i ++ ) {
		const dcmd = drawingCommands[ i ];
		let s = "" ;
		switch ( dcmd.type ) {
		case "circle" :
			target.appendChild( circle ( 0, 0, dcmd.d / 2, dcmd.eas ));
			break;
		case "spiral" :
			target.appendChild( spiral ( 0, 0, dcmd.d/2, dcmd.ript, -90, dcmd.steps, 30, dcmd.eas ));
			break;
		case "ticklines" :
			createTickmarks ( dcmd.d1, dcmd.d2, dcmd.s, dcmd.n, dcmd.ript1, dcmd.ript2, dcmd.gas, dcmd.eas );
			break;
		case "ticknumbers" :
			if ( ! dcmd.steps ) dcmd.steps = 12 ;
			if ( ! dcmd.start ) dcmd.start = 0 ;
			for ( let i = dcmd.start ; i < dcmd.steps ; i ++ ) s += i + "," ;
			if ( ! dcmd.gas ) dcmd.gas = { class: "ticknums" };
			createTextCircle( moduleOptions.d2, dcmd.d, s, dcmd.poff, dcmd.ript, dcmd.gas, dcmd.eas ) ;
			break;
		case "text" :
			createTextCircle( moduleOptions.d2, dcmd.d, dcmd.values, dcmd.poff, dcmd.ript, dcmd.gas, dcmd.eas );
			break;
	}	}	}

function createTickmarks ( d1 , d2, s=0, n=12, ript1=0, ript2=0, groupAttributes={ class: "tickmarks" }, elementAttributes={ } ) {
	///		d1 = inner diameter
	///		d2 = outer diameter
	///		n = number of tickmarks
	///		ript1 = radius 1 increment per turn
	///		ript2 = radius 2 increment per turn
	const g = createElement( "g", groupAttributes );
	target.appendChild( g );
	let r1 = d1 / 2 ;
	let r2 = d2 / 2 ;
	ript1 /= 12 ;
	ript2 /= 12 ;
	for ( let i = s ; i < n ; i ++ , r1+=ript1, r2+=ript2  ) g.appendChild ( line ( 
		r1*k[ i %12 ] , r1*k[ (i+9)%12 ] , r2*k[ i %12 ] , r2*k[ (i+9)%12 ],
		elementAttributes
		) ) ;
	}

function createTextCircle ( d1, d2, strings, poff = 0, ript = 0, groupAttributes={ class: "notes" }, elementAttributes = {  } )  {
	///		d1 = text outline diameter
	///		d2 = text position circle diameter
	///		aoff = angular position offset
	///		ript = radius increment per turn
	const rips = ript / 12 ; // radius increment per step 
	strings = replaceAccidentals( strings ).split( "," );
	const g = createElement( "g", groupAttributes );
	target.appendChild( g );
	const fontsize = parseInt ( window.getComputedStyle( g ).getPropertyValue( "font-size" )) ;
	const vo = fontsize / 3 ;
	const r1 = d1 / 2 ;
	let r2 = d2 / 2 ;
	for ( let i = 0 ; i < strings.length ; i ++ , r2 ) {
		if ( strings[ i ] === "" ) continue ;
		const r0 = r2 + i * ript / 12 ,
			aoff = poff / 2 / Math.PI / r0 * 360 ,
			r = r2 + ( i * 30 + aoff ) * ript / 360 ,
			a = (i * 30 + aoff) / 180 * Math.PI ,
			x = r * Math.sin( a ) , 
			y = - r * Math.cos( a ) ;
		let e = circle ( x , y , r1, elementAttributes );
		if ( i === 0 ) e.classList.add( "root" );
		g.appendChild ( e );
		e = text ( x , y + vo, strings[ i ] );
		if ( i === 0 ) e.classList.add( "root" );
		g.appendChild ( e );
	}	}
