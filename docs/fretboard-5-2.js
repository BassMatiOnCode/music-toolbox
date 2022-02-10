//
//  fretboard-5.js   2021-09-22   usp
//

import * as svg from "/inc/svg-1.js" ;
import * as music from "/inc/music/music-5.js" ;

let chords, scales;
const noteNameRegex = new RegExp("[^0-9]*") ;
const // chord and scale field names
	stringnumber = 0 ,
	fretnumber = 1 ,
	intervalname = 2 ,
	notename = 3 ,
	fingernumber = 4 ,
	flags = 5 ;

export class FretboardDiagram {
		target ; 
		stringHeaders = [ ] ;
		fretMarkers = { top : true , bottom : true } ;
		romanNumerals = ",I,,III,,V,,VII,,IX,,,XII,,,XV,,XVII,,IXX,,XXI,,,XXIV".split( "," ) ;
		grid = { stringSpacing : 20 , fretSpacing : 25 , firstFret : 0 , lastFret : 5 } ;
		strings = "E4,B3,G3,D3,A2,E2".split( "," );
		fonts = { 
			stringheader: { name: "Arial Narrow" } ,
			fretmarker: { name: "Times New Roman" } ,
			note: { name: "Arial Narrow" }
			} ;
		showAttributes = "in,nn,fn,none".split( "," ) ;
		activeAttribute = 0 ;
		chords ;
		scales;
		patterns = [ ] ;
		activePattern ;
	constructor ( target, firstfret, lastfret, options = { } ) {
		if ( typeof target === "string" ) this.target = document.getElementById( target );
		else this.target = target;
		this.target.setAttribute( "text-anchor", "middle" );
		this.grid.firstFret = firstfret ;
		this.grid.lastFret = lastfret ;
		if ( ! target ) throw( new Error( "Cannot find target element." ));
		if ( options.stringheaders ) this.addStringHeaders ( options.stringheaders );
		if ( options.fretmarkers ) this.setFretMarkers( fretmarkers ) ;
		if ( options.gridspacing ) this.setGridSpacing( options.gridspacing );
		if ( options.stringset ) this.setStrings( options.stringset );
		if ( ! options.delayPaint ) this.createBaseStructure( );
		}
	setFretRange( first, last ) {
		/// Defines the number of frets and their index.
		this.grid.firstFret = first ;
		this.grid.lastFret = last ;
		return this ;
		}
	addStringHeaders ( keywords ) {
		/// Sets the string header configuration.
		if ( keywords ) this.stringHeaders.push( ...keywords.split( "," )) ;
		return this ;
		}
	setFretMarkers ( keywords ) {
		/// Defines the fret marker appearance.
		this.fretMarkers.top = new RegExp( "(\\btop\\b|\\bboth\\b)", "ig" ).test( keywords ) ;
		this.fretMarkers.bottom = new RegExp( "(\\btbottom\\b|\\bboth\\b)", "ig" ).test( keywords ) ;
		return this ;
		}
	setGridSpacing ( stringSpacing, fretSpacing ) {
		/// Defines the vertical and horizontal space between grid lines.
		if ( stringSpacing ) this.grid.stringSpacing = stringSpacing ;
		if ( fretSpacing ) this.grid.fretSpacing = fretSpacing ;
		return this ;
		}
	setStrings ( stringset ) {
		/// Defines the number of strings and their tuning notes.
		/// If possible, supply the octave number with the tuning note.
		this.strings = music.repaceAccidentals( stringset ).split( "," );
		return this ;
		}
	createBaseStructure( ) {
		/// Paints the grid with string headers, trailers and fretboard markers.
		/// Adjusts the dimensions of the SVG container viewbox.
		this.calculateFontSizes( );
		this.drawGridLines( );
		this.drawStringHeaders( );
		this.drawFretMarkers( );
		this.chords = this.target.appendChild( svg.createElement( "g", { class: "chords" , "font-size": this.fonts.note.size } ));
		this.scales = this.target.appendChild( svg.createElement( "g", { class: "scales" , "font-size": this.fonts.note.size } ));
		this.setTargetViewbox( );
		return this;
		}
	calculateFontSizes ( ) {
		/// Derives default dimensions from string and fret spacings.
		const h = Math.min( this.grid.stringSpacing, this.grid.fretSpacing ) ;
		this.fonts.stringheader.size = Math.max( h * 0.4, 8 ) ;
		this.fonts.fretmarker.size = Math.max( h * 0.5, 8 ) ;
		this.fonts.note.size = Math.max( h * 0.5, 8 ) ;
		this.fonts.note.circleRadius = (h - 2) / 2 ;
		}
	drawGridLines ( ) {
		let x = 0 , y = 0 ;
		const x2 = ( this.grid.lastFret - this.grid.firstFret + 1 ) * this.grid.fretSpacing ,
			g = svg.createElement( "g" , { class : "strings" , "stroke-width" : 1 , stroke : "#666" } );
		this.target.appendChild( g );
		// String lines
		this.strings.forEach( ( ) => { 
			g.appendChild( svg.line( 0, y , x2, y ) ) ; 
			y += this.grid.stringSpacing ;
			} ) ;	
		// Fret lines
		const y1 = 0 , y2 = ( this.strings.length - 1 ) * this.grid.stringSpacing ;
		for ( let i = 0 ; i <= this.grid.lastFret - this.grid.firstFret + 1 ; i ++ ) {
			if ( i + this.grid.firstFret > 0 )  g.appendChild( svg.line( x, 0, x, y2, i + this.grid.firstFret === 1 ? { "stroke-width" : 3 } : undefined ) ) ;
			x += this.grid.fretSpacing ;
			}
		return this ;
		}
	drawStringHeaders ( ) {
		/// Puts string number, tuning note or full note name in 
		/// front of the grid. Coordinates are derived from the 
		/// header font size.
		let x = -5, g;
		for ( let i = 0 ; i < this.stringHeaders.length ; i ++ ) {
			let maxw = 0, y = 0 ;
			switch ( this.stringHeaders[ i ] ) {
			case "number" :
				y = this.fonts.stringheader.size / 3;
				g = svg.createElement ( "g" , { class: "string-number" , "font-size" : this.fonts.stringheader.size } ) ;
				this.target.appendChild( g );
				this.strings.forEach( (e, i) => { g.appendChild( svg.createElement( "text" )).textContent = i + 1; } ) ;
				break;
			case "name" :
				y = this.fonts.stringheader.size / 3;
				g = svg.createElement ( "g" , { class: "string-name" , "font-size" : this.fonts.stringheader.size } ) ;
				this.target.appendChild( g );
				this.strings.forEach( e => { g.appendChild( svg.createElement( "text" )).textContent = e.match( noteNameRegex );  } );
				break;
			case "fullname" :
				y = this.fonts.stringheader.size / 3;
				g = svg.createElement ( "g" , { class: "string-fullname" , "font-size" : this.fonts.stringheader.size } ) ;
				this.target.appendChild( g );
				this.strings.forEach( e => { g.appendChild( svg.createElement( "text" )).textContent = e; } );
				break;
			default:
				continue ;
				}
			if ( g ) {  
				// Group postprocessing.
				let w = 0, fontsize  = parseInt( g.getAttribute( "font-size" )), h = (fontsize + 4) / 2;
				// Calculate the required column width.
				g.childNodes.forEach( e => w = Math.max( w, e.getBBox( ).width ));
				w += 6 ;
				for ( let i = g.childNodes.length - 1 ; i >= 0 ; i -- ) {
					// Finish text element attributes.
					let y = i * this.grid.stringSpacing ;
					let e = g.childNodes[ i ];
					e.setAttribute( "x", x - w/2 ) ;
					e.setAttribute( "y", y + fontsize / 3 + 0.4 );
					// Create the outline element.
					g.insertBefore( svg.rect ( x - w, y - h, w, 2*h, h, h, { stroke:"#888", fill:"white" } ), e);
					}
				g = undefined ;
				y += this.grid.stringSpacing;
				x -= w + 3 ;
		}	}	}
	drawFretMarkers ( ) {
		const fontsize = this.fonts.fretmarker.size;
		if ( this.fretMarkers.top ) this.drawFretmarkerRow( - this.fonts.note.circleRadius - 3 );
		if ( this.fretMarkers.bottom ) this.drawFretmarkerRow( (this.strings.length - 1) * this.grid.stringSpacing + this.fonts.note.circleRadius + this.fonts.fretmarker.size + 1 );
		}
	drawFretmarkerRow ( y ) {
		let x = this.grid.fretSpacing / 2 ;
		const g = svg.createElement( "g", { class: "fretmarkers", "font-size": this.fonts.fretmarker.size, fill:"brown", stroke:"none" ,"font-family":"Times New Roman" } ) ;
		this.target.appendChild( g );
		for ( let i = this.grid.firstFret ; i <= this.grid.lastFret ; i ++ , x += this.grid.fretSpacing ) {
			g.appendChild( svg.text( x, y, this.romanNumerals[ i ] ));
		}	}
	setTargetViewbox ( ) {
		/// Sets the size attributes of the SVG container 
		/// according to the current drawing extent.
		const r = this.target.getBBox( { stroke:true , markers:true } ) ;
		this.target.setAttribute( "viewBox", `${r.x-5} ${r.y-5} ${r.width+10} ${r.height+10}` );
		this.target.setAttribute( "width" , r.width+10 );
		this.target.setAttribute( "height", r.height+10 );
		}
	addChord ( name, notes, activate ) {
		/// Creates a chord pattern and optionally activates it.
		const g = this.chords.appendChild( svg.createElement( "g" , { class: "chord" , display: activate ? "block" : "none" , title : name } )) ;
		this.addNotes ( g, notes );
		this.patterns.push( g );
		if ( activate ) this.activePattern = this.patterns.length - 1;
		return this ;
		}
	addScale( name, notes, activate ) {
		/// Creates a scale pattern and optionally activates it.
		const g = this.scales.appendChild( svg.createElement( "g" , { class: "scale" , display: activate ? "block" : "none" , title : name } )) ;
		this.addNotes ( g, notes );
		this.patterns.push( g );
		if ( activate ) this.activePattern = this.patterns.length - 1;
		return this ;
		}
	addNotes ( g, notes ) {
		/// Creates a chord pattern and optionally activates it.
		const fontoffset = this.fonts.note.size / 3 ,
			r = this.fonts.note.circleRadius ,
			type = g.getAttribute( "class" );
		// Loop over the note definitions.
		notes.forEach( e => {
			// Split definition string and process fields.
			const fields = e.split( "," ) ,
				y = ( parseInt( fields[ stringnumber ] ) - 1 ) * this.grid.stringSpacing ,
				x = ( parseInt( fields[ fretnumber ] ) - this.grid.firstFret + 0.5 ) * this.grid.fretSpacing ;
			// Create enclosing circle.
			let options = { stroke:"black" , fill:type==="chord" ? "#EEE" : "white" , "stroke-width" : 0.8} ;
			const c = g.appendChild( type === "chord" ? 
				svg.circle( x, y, r, options ) :
				svg.rect( x-r, y-r, 2*r, 2*r, 0.7*r, 0.7*r, options ));
			// Create options for the text element.
			options = { in : fields[intervalname] || "" , 
				nn : music.replaceAccidentals( fields[notename] ) || "" , 
				fn : fields[fingernumber] || "" } ;
			if ( fields[ flags ] && fields[ flags ].length ) 
				fields[ flags ].split( "-" ).forEach( e => options[ e ] = "" ) ;
			switch ( options.in ){
			case "R" :
				options.fill = "white" ;
				c.setAttribute( "fill", "darkorange" );
				break;
			case "O" : 
				c.setAttribute( "fill", "#ffcc66" );
				break;
				}
			// Create the text element.
			g.appendChild( svg.text( x, y+fontoffset , "" , options )); 
			} ) ;
		}
	activateAttribute( i = this.activeAttribute ) {
		/// Set the text content. 
		const attributeName = this.showAttributes[ i ];
		[ "chords", "scales" ].forEach( m => this[ m ].querySelectorAll( "text" )
			.forEach ( e => e.textContent = e.getAttribute( "in" ) === "O" && attributeName === "in" ? "R" : e.getAttribute( attributeName ) ) ) ;
		this.activeAttribute = i ;
		return this;
		}
	previousAttribute ( ) {
		let i = this.activeAttribute - 1;
		if ( i < 0 ) i += this.showAttributes.length ;
		this.activateAttribute( i );
		}
	nextAttribute ( ) {
		this.activateAttribute( (this.activeAttribute + 1) % this.showAttributes.length );
		}
	activatePattern( i ) {
		this.patterns[ this.activePattern ].setAttribute( "display", "none" );
		this.activePattern = i ;
		this.patterns[ this.activePattern ].setAttribute( "display", "block" );
		}
	previousPattern( ) {
		let i = this.activePattern - 1;
		if ( i < 0 ) i += this.patterns.length ;
		this.activatePattern( i );
		}
	nextPattern( ) {
		this.activatePattern( (this.activePattern + 1) % this.patterns.length );
		}
	}
