import $ from 'jquery';
import tippy from 'tippy.js/dist/tippy.all';
import 'tippy.js/dist/themes/light.css';

let currentSentences = [];

const compareArrays = (arr1, arr2) => {
	if (arr1.length !== arr2.length) {
		return false;
	}
	for (let i = 0; i < arr1.length; i++) {
		if (arr1.sentence !== arr2.sentence) {
			return false;
		}
	}
	return true;
}

document.addEventListener('keyup', function (e) {
	const text = document.getElementById('content-input').textContent;
	const newText = text.match( /[^\.!\?]+[\.!\?]+/g ).map((sentence) => { return { sentence } });
	const lastMessage = text.split( /[\.!\?]+/g ).splice(-1)[0];
	if (newText.length > 0 && !compareArrays(currentSentences, newText)) {
		currentSentences = newText;
		const promises = [];
		newText.forEach((sentence) => {
			promises.push(fetchFaultyThinking(sentence.sentence));
		});
		Promise.all(promises).then(function (results) {
			// Both promises resolved
			const finalDataElem = document.createElement('p');
			for (let i = 0; i < results.length; i++) {
				if (results[i].length > 0) {
					const hoverElement = document.createElement('u');
					hoverElement.className = 'curly-underline';
					hoverElement.textContent = `${newText[i].sentence}`;
					addTooltip(hoverElement, results[i][0]);

					finalDataElem.appendChild(hoverElement);
				} else {
					const textNode = document.createTextNode(`${newText[i].sentence}`);
					finalDataElem.appendChild(textNode);
				}
			}
			const textNode = document.createTextNode(`${lastMessage} `);
			finalDataElem.appendChild(textNode);
			document.getElementById('content-input').innerHTML = '';
			document.getElementById('content-input').appendChild(finalDataElem);
			setEndOfContenteditable(document.getElementById('content-input'));
		})
	}
});

const addTooltip = (hoverElement, faultyThinking) => {
	const hoverTemplate = document.createElement('div');

	hoverTemplate.innerHTML = `
			<img style="padding: 10px; height: 100px; width: 100px;" src="${faultyThinking.image}" />
			<h3>${faultyThinking.name}</h3>
			<p style="width: 400px">${faultyThinking.description}</p>`;

	
	tippy(hoverElement, {
		html: hoverTemplate,
		theme: 'light',
		arrow: true, 
		placement: 'bottom',
		size: 'large'
	});

}

const fetchFaultyThinking = (sentence) => {
	let url = "./check-phrase?"

	url += convertObjToParams({
		phrase: sentence
	});

	return fetch(url, { mode: 'cors' })
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

function setEndOfContenteditable(contentEditableElement) {
	var range, selection;
	if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
	{
		range = document.createRange();//Create a range (a range is a like the selection but invisible)
		range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
		range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
		selection = window.getSelection();//get the selection object (allows you to change selection)
		selection.removeAllRanges();//remove any selections already made
		selection.addRange(range);//make the range you have just created the visible selection
	}
	else if (document.selection)//IE 8 and lower
	{
		range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
		range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
		range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
		range.select();//Select the range (make it the visible selection
	}
}