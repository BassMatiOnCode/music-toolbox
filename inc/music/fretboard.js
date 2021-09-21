// fretboard.js
// 2021-07-03 usp

// Document Init Code

const spaceMatcher = new RegExp( "\\s", "g" );
const stringNumbers = "0➀➁➂➃➄➅➆➇➈" ;  // Dingbat Circled Sans-Serif Digits
const romanNumerals = [ "0", "I", "", "III", "", "V", "", "VII", "", "IX", "", "", "XII", "", "", "XV", "", "XVII", "", "IXX", "", "XXI", "", "", "XXIV"  ]; 
let fretboards = document.getElementsByClassName( "fretboard generate" );
for ( let i = 0 ; i < fretboards.length ; i ++ ) createFretboard( fretboards[ i ] );

function createFretboard( fretboard ) {
	function createString ( number, fretrange, notes, intervals, options ) {
		notes = notes && notes.split( "," ) || [ ] ;
		intervals = intervals && intervals.split( "," ) || [ ] ;
		options = options && options.split( "," ) || [ ] ;
		let row = body.insertRow( );
		row.setAttribute( "string", number + 1 );
		for ( let j = fretrange[ 0 ] ; j <= fretrange[ 1 ] ; j ++ ) {
			let cell = row.insertCell( );
			let className = [ ];
			if ( notes[ j ] ) cell.innerHTML += `<div class="note">${notes[ j ]}</div>` ;
			if ( intervals[ j ] ) cell.innerHTML += `<div class="interval">${intervals[ j ]}</div>` ;
			if ( intervals[ j ] === "R" ) cell.className += "root" ;
			if ( options ) setOptions( cell, options[ j ] );
			if ( cell.innerHTML.length === 0 ) cell.className += " empty" ;
			} }
	function setOptions ( cell, options ) {
		for ( let i = 0 ; i < options.length ; i ++ ) { 
			switch ( options[ i ].toUpperCase( )) {
			case "R" :
				if ( ! new RegExp( "\\wroot\\w" ).test( cell.className )) cell.className += " root" ;
				break;
			case "O" :
				cell.className += " opt" ;
				} } }
	function createMarkers( container ) {
		const row = container.insertRow( );
		row.className = "fretnumbers" ;
		for ( let i = fretrange[ 0 ] ; i <= fretrange[ 1 ] ; i ++ ) {
			let cell = row.insertCell( );
			cell.innerHTML = romanNumerals[ i ];
			} }
	function createStringNumbers ( ) {
		const rows = fretboard.querySelectorAll( "TR" );
		for ( let i = 0 ; i < rows.length ; i ++ ) {
			const row = rows[ i ];
			const cell = document.createElement( "TH" );
			row.insertBefore( cell, row.firstChild );
			const n = row.getAttribute( "string" ) || "" ;
			if ( n ) cell.innerHTML = stringNumbers[ n ];
			} }
	let strings = parseInt( fretboard.getAttribute( "strings" ) || "6" ); 
	let fretrange =	( fretboard.getAttribute( "fretrange" ) || "0,12").replace( spaceMatcher, "" ).split( "," );
	let notes = ( fretboard.getAttribute( "notes" ) || "" ).replace( spaceMatcher, "" ).split( ";" );
	let intervals = ( fretboard.getAttribute( "intervals" ) || "" ).replace( spaceMatcher, "" ).split( ";" );
	let options = ( fretboard.getAttribute( "options" ) || "" ).replace( spaceMatcher, "" ).split( ";" );
	if ( fretrange[ 0 ] === "0" ) fretboard.className += " nut" ;
	const markers = fretboard.getAttribute( "markers" );
	if ( markers === "top" || markers === "both" ) createMarkers( fretboard.createTHead( ));
	let body = fretboard.createTBody( );
	if ( markers === "bottom" || markers === "both" ) createMarkers( fretboard.createTFoot( ));
	for ( let j = 0 ; j < strings ; j ++ ) createString( j, fretrange, notes[ j ], intervals[ j ], options[ j ] );
	if ( fretboard.hasAttribute( "stringnums" )) createStringNumbers( ) ;
	}

			