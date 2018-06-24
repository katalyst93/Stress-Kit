import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import ModelRange from '@ckeditor/ckeditor5-engine/src/model/range';

import $ from 'jquery';


function getText( element ) {
	return Array.from( element.getChildren() ).reduce( ( a, b ) => a + b.data, '' );
}


ClassicEditor
	.create( document.querySelector( '#snippet-custom-build' ), {
		plugins: [
			Essentials,
			Paragraph,
			Bold,
			Italic,
			Underline,
			Strikethrough
		],
		toolbar: {
			items: [ 'bold', 'italic', 'strikethrough', 'undo', 'redo' ],
			viewportTopOffset: 60
		}
	} )
	.then( editor => {
		window.editor = editor;
		editor.model.document.on( 'change', ( evt, batch ) => {
			if ( batch.type == 'transparent' ) {
				return;
			}

			const selection = editor.model.document.selection;

			// Do nothing if selection is not collapsed.
			if ( !selection.isCollapsed ) {
				return;
			}

			const changes = Array.from( editor.model.document.differ.getChanges() );
			const entry = changes[ 0 ];

			// Typing is represented by only a single change.
			if ( changes.length != 1 || entry.type !== 'insert' || entry.name != '$text' || entry.length != 1 ) {
				return;
			}

			const block = selection.focus.parent;
			const text = getText( block ).slice( 0, selection.focus.offset );
			const newText = text.split('.').map((sentence) => { return { sentence } });
			// Promise.all
			const promises = [];
			if (newText.length > 1) {
				newText.slice(0, -1).forEach((sentence) => {
					promises.push(fetchFaultyThinking(sentence.sentence));
				});
				Promise.all(promises).then(function(results) {
					// Both promises resolved
					let finalText = "<p>";
					for (let i = 0; i < results.length; i++) {
						if (results[i].length > 0) {
							finalText += `<u class="curly-underline">${newText[i].sentence}.</u>`;
						} else {
							finalText += `${newText[i].sentence}.`;
						}
					}
					finalText += `${newText[newText.length - 1].sentence}</p>`;
					editor.model.enqueueChange( writer => {
						editor.setData(finalText);
					});
				})
			}
			
			// const testOutput = testCallback( text );
			// const rangesToFormat = testOutputToRanges( block, testOutput.format );
			// const rangesToRemove = testOutputToRanges( block, testOutput.remove );

			// if ( !( rangesToFormat.length && rangesToRemove.length ) ) {
			// 	return;
			// }

			// // Use enqueueChange to create new batch to separate typing batch from the auto-format changes.
			// editor.model.enqueueChange( writer => {
			// 	const validRanges = editor.model.schema.getValidRanges( rangesToFormat, attributeKey );

			// 	// Apply format.
			// 	formatCallback( writer, validRanges );

			// 	// Remove delimiters - use reversed order to not mix the offsets while removing.
			// 	for ( const range of rangesToRemove.reverse() ) {
			// 		writer.remove( range );
			// 	}
			// } );
		} );
		// editor.model.document.on( 'change', () => {

			
		// 	if ( editor.model.document.differ.getChanges().length > 0 ) {
		
				
		// 	}
		// } );
	} )
	.catch( err => {
		console.error( err );
	} );


	const fetchFaultyThinking = (sentence) => {
		let url = "https://1ac38aa1.ngrok.io/check-phrase?"
	
		url += convertObjToParams({
			phrase: sentence
		});

		return fetch(url, {mode: 'cors'})
		.then((response) => {
			return response.json()
		});
	}

const convertObjToParams = (obj) => {
    let str = "";
    for (let key in obj) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str;
}