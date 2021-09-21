//
//  music-1.js   2021-09-17   usp
//

export function replaceAccidentals ( s, options = "g" ) {
	const re1 = new RegExp( "#", options );
	return s.replace( new RegExp( "#", options ), "♯" ).replace( new RegExp( "b", options ), "♭" );
	}