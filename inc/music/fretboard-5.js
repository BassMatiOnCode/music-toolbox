//
//  fretboard-5.js  2021-09-20  usp
//

import { createElement, line, circle, rect, text } from "/inc/svg-1.js" ;

const noteNameRegex = "^[0-9]" ;
export let romanNumerals = ",I,,III,,V,,VII,,IX,,,XII,,,XV,,XVII,,IXX,,XXI,,,XXIV";
let target, options, x, y, w, h, maxx, maxy, stringspacing, fretspacing, cellfontsize, headerfontsize, markerfontsize;


export function createFretboard ( t , o ) {
	///		Generates the fretboad diagram
	///		t : Target object reference or ID string
	///		o : Configuration options object. 
	target = t ;
	options = o ;
	// Configure default options.
	if ( ! options.orientation ) options.orientation = "tblr" ;
	if ( ! options.fretmarkers ) options.fretmarkers = "bottom" ;
	if ( typeof romanNumerals === "string" ) romanNumerals = romanNumerals.split( "," );
	if ( ! options.spacing ) options.spacing = [ 20, 20 ] ;
	stringspacing = options.spacing[ 1 ];
	fretspacing = options.spacing[ 0 ];
	if ( options.fontsizes ) {
		cellfontsize = options.fontsizes[ 0 ]; 
		headerfontsize = options.fontsizes[ 1 ]; 
		markerfontsize = options.fontsizes[ 2 ]; }
	else {
		cellfontsize = Math.max( Math.min( stringspacing, fretspacing ) * 0.5, 11 ) ;
		headerfontsize = Math.max( Math.min( stringspacing, fretspacing ) * 0.4, 9 ) ;
		markerfontsize = Math.max( Math.min( stringspacing, fretspacing ) * 0.5, 8 ) ; }
	if ( ! options.fretrange ) options.fretrange = [ 0, 5 ];
	if ( ! options.strings ) options.strings = [ "E4", "B3", "G3", "D3", "A2", "E2" ];
	if ( ! options.stringheaders ) options.stringheaders = [ ];
	if ( ! options.cellsets ) options.cellsets = [ ] ;
	if ( ! options.showcellset ) options.showcellset = 0 ;
	if ( options.cells ) { options.cellsets.push ( options.cells ) ; delete options.cells } ;
	if ( ! options.show ) options.show = "intervalName" ;
	target = document.getElementById( target ) || target ;
	// Create the diagram
	createStringLines( );
	createFretLines( );
	createStringHeaders( );
	createFretmarkers( );
	createCells( 0 );
	// Set viewbox and size
	maxx += 10;
	target.setAttribute( "viewbox", `0 0 ${maxx} ${maxy}` );
	target.setAttribute( "width" , maxx );
	target.setAttribute( "height" , maxy );
	}

export function show ( t, what ) {
	const cells = t.querySelectorAll( "g.cellset text" );
	for ( const cell of cells ) {
		cell.textContent = cell.getAttribute( what );
	}	}

function createStringLines ( ) {
	// Calculate diagram dimensions
	x = 0, y = stringspacing / 2 ;
	// Fretmarker row at the top requires additional space
	switch( options.fretmarkers ) { case "top": case "both" : y += markerfontsize }
	// Headers at the left side require additional space
	if ( options.stringheaders ) {
		x += 5 ;
		for ( let i = 0 ; i < options.stringheaders.length ; i ++ ) {
			switch ( options.stringheaders[ i ] ) {
			case "number" : x += 16 ; break
			case "note" : x += 16 ; break
			case "fullnote" : x += 24 ; break
		}	}	}
	w = ( options.fretrange[ 1 ] - options.fretrange[ 0 ] + 1) * fretspacing ;
	h = ( options.strings.length - 1 ) * stringspacing;
	// Set diagram size
	maxx = x + w ;
	maxy = y + h + stringspacing / 2;
	// Create string lines
	let g = createElement( "g", { class : "grid strings" } );
	target.appendChild( g );
	for ( let i = 0 ; i < options.strings.length ; i ++ ) {
		g.appendChild( line( x, y + i * stringspacing, x + w, y + i * stringspacing ));	
		}	
	}
function createFretLines ( ) {
	// Create fret lines
	const g = createElement( "g", { class: "grid frets" } );
	target.appendChild( g );
	for ( let i = options.fretrange[ 0 ] ; i < options.fretrange[ 1 ] + 2 ; i ++ ) {
		if ( i === 0 ) continue ;
		const a = x + ( i - options.fretrange[ 0 ] ) * fretspacing ;
		g.appendChild ( line ( a, y,  a, y + h, { class: i === 1 ? "nut" : undefined } ) ) ;	
		}	
	}
function createStringHeaders ( ) {
	///		String header can have multiple items (string number, short 
	///		and long note name), each requires a certain horizontal space.
	let x = 0, g ;
	for ( let i = 0 ; i < options.stringheaders.length ; i ++ ) {
		switch ( options.stringheaders[ i ] ) {
		case "number" :
			g = createElement( "g", { class: "stringnumbers", "font-size": headerfontsize } ) ;
			target.appendChild( g );
			x += 8;
			for ( let i = 0 ; i < options.strings.length ; i ++ ) {
				g.appendChild ( circle ( x, y + i * stringspacing, 7 ) ) ;
				g.appendChild ( text( x , y + 3.5 + i * stringspacing, i ) ) ; 
				}
			x += 8 ;
			break;
		case "note" :
			g = createElement( "g", { class: "stringnames", "font-size": headerfontsize } ) ;
			target.appendChild( g );
			x += 8 ;
			for ( let i = 0 ; i < options.strings.length ; i ++ ) {
				g.appendChild( circle ( x, y + i * stringspacing, 7 ));
				g.appendChild( text ( x , y + 3.5 + i * stringspacing, options.strings[ i ].match( noteNameRegex ))); 
				}
			x += 8 ;
			break;
		case "fullnote" :
			g = createElement( "g", { class: "stringnames", "font-size": headerfontsize } ) ;
			target.appendChild( g );
			x += 12 ;
			for ( let i = 0 ; i < options.strings.length ; i ++ ) {
				g.appendChild ( rect ( x - 10, y + i * stringspacing - 7, 20, 14, 7, 7 ) ) ;
				g.appendChild ( text ( x , y + 3.5 + i * stringspacing, options.strings[ i ] )); 
				}
			x += 12 ;
			break;
		}	}
	}
function createFretmarkers ( ) { 
	switch ( options.fretmarkers ) { case "top" : case "both" : createFretmarkerRow( x, y - stringspacing / 2.5 ) }
	switch ( options.fretmarkers ) { case "bottom" : case "both" : createFretmarkerRow( x, y + h + stringspacing / 2 + markerfontsize ) }
	}
function createFretmarkerRow( x, y ) {
	x += fretspacing / 2 ;
	maxy = Math.max( maxy, y + 5 );
	const g = createElement( "g", { class: "fretmarkers", "font-size": markerfontsize, "stroke-width": "0.9" } ) ;
	target.appendChild( g );
	for ( let i = options.fretrange[ 0 ] ; i <= options.fretrange[ 1 ] ; i ++ , x += fretspacing ) {
		g.appendChild( text( x, y, romanNumerals[ i ] ));
	}	}
function createCells( cellset = 0 ) { 
	/// cellset : identifies the cellset in the cellsets array.
	let g = createElement( "g", { class: "cellset", "font-size": cellfontsize, "stroke-width": "0.9", "cellset-num": cellset } ) ;
	target.appendChild( g );
	let cells = options.cellsets[ cellset ] ;
	const cw = Math.min(stringspacing, fretspacing) - 3, ch = cw, cr = ch / 2 ;
	for ( let i = 0 ; i < cells.length ; i ++ ) {
		const cell = cells[ i ];
		const cx = x + fretspacing / 2 + (cell.f - options.fretrange[ 0 ]) * fretspacing ;
		const cy = y + ( cell.s - 1 ) * stringspacing ;
		g.appendChild ( setFlags ( rect ( cx-cw/2, cy-cw/2, cw, cw, cr, cr ), cell ) ) ;
		if ( cell.opt === 1 ) g.setAttribute( "optional", "" );
		const o = text ( cx, cy + cellfontsize / 3, getCellText( cell, options.show ), { noteName: cell.nn, intervalName: cell.in, fingerNumber: cell.fn } ) ;
		setFlags( o, cell );
		g.appendChild( o );
	}	}

function getCellText ( celldata, what ) {
	let s = celldata[ { fingerNumber : "fn" , noteName: "nn", intervalName: "in" }[ what ] ] || "" ;
	return s === "O" ? "R" : s ;
	}
function setFlags ( e , cell ) {
	switch( cell.in ) {
		case "R" : e.setAttribute( "root" , "" ) ; break 
		case "O" : e.setAttribute( "octave" , "" ) ; break
		}
	if ( cell.opt === 1 ) e.setAttribute( "optional", "" ) ;
	return e ;
	}


