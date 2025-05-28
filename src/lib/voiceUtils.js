import { idiomaDiccionario, BACKEND_URL } from "./basic";
import Swal from "sweetalert2";

export async function fetchVoices(idioma, tono) {
	idioma = Object.keys(idiomaDiccionario).find(key => idiomaDiccionario[key] === idioma);
	const response = await fetch(`${BACKEND_URL}/api/tts/get_voices/${idioma}/${tono}/`);

	if (response.status != 200) {
		const data = await response.json();
		console.log(data);
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: data.message,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#FFB84D',
		});
	}

	const data = await response.json();
	return data.voices;
}

export async function playTextToSpeech(idiomaSelected, tonoSelected, voiceSelected, sampleText) {
	if (idiomaSelected === "" || tonoSelected === "" || voiceSelected === "") {
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: "Por favor, selecciona un idioma, tono y voz.",
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#FFB84D',
		});

		return;
	}

	console.log(voiceSelected);
	let idioma = Object.keys(idiomaDiccionario).find(key => idiomaDiccionario[key] === idiomaSelected);
	const url = `${BACKEND_URL}/api/tts/text_to_speech/${voiceSelected}/`;

	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({ text: sampleText }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.status != 200) {
		const data = await response.json();
		console.log(data);
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: data.message,
			confirmButtonText: 'Aceptar',
			confirmButtonColor: '#FFB84D',
		});
	}
}