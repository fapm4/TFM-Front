import { writable } from 'svelte/store';

export const fileUploaded = writable(false);
export const fileDetails = writable('');
export const fileObject = writable(null);

export const optionSelected = writable('');
export const thresholdSelected = writable('');
export const thresholdValue = writable('-50');

// TTS
export const idiomaSelected = writable('Español (España)');
export const tonoSelected = writable('Neutro');
export const voiceSelected = writable('');
export const sampleText = writable('Hola, soy una voz de prueba. ¿Cómo estás?');

export const voices = writable([]);

export const descriptions = writable([]);
export const videoId = writable('');
export const fileUrl = writable('');
export const fileName = writable('');