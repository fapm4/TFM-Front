<script>
	import Navbar from "../../components/Navbar.svelte";

	import FileUploader from "../../components/upload/FileUploader.svelte";
	import OptionsHandler from "../../components/upload/OptionsHandler.svelte";
	import ThresholdHandler from "../../components/upload/ThresholdHandler.svelte";
	
	import { 
		fileUploaded,
		fileDetails,
		optionSelected,
		fileObject, 
		thresholdSelected, 
		thresholdValue, 
		voiceSelected, 
		idiomaSelected, 
		tonoSelected,
	} from "$lib/writables";

	import {
		videoId,
		descriptions,
		fileUrl,
		fileName,
	} from "$lib/writables";

	import { BACKEND_URL, setLocalStorage, clearLocalStorage, idiomaDiccionario, swalSpinner} from "$lib/basic.js";
	import Swal from "sweetalert2";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	onMount(async () => {
		clearLocalStorage();
	})
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Código para manejar la subida de archivos

	function checkFields() {
		const requiereDetalles = ["option2_texto", "option3_ia"];
		const errores = [
			{ cond: !$fileUploaded, msg: "Por favor, selecciona un archivo." },
			{ cond: !$optionSelected, msg: "Por favor, selecciona una opción." },
			{ cond: !$thresholdSelected, msg: "Por favor, selecciona un umbral de silencio." },
			{
				cond: $thresholdSelected === "option5_thresh_manual" && !$thresholdValue,
				msg: "Por favor, especifica un umbral de silencio.",
			},
			{
				cond: requiereDetalles.includes($optionSelected) && !$idiomaSelected,
				msg: "Por favor, selecciona un idioma.",
			},
			{
				cond: requiereDetalles.includes($optionSelected) && !$tonoSelected,
				msg: "Por favor, selecciona un tono.",
			},
			{
				cond: requiereDetalles.includes($optionSelected) && !$voiceSelected,
				msg: "Por favor, selecciona una voz.",
			},
		];

		const error = errores.find(e => e.cond);
		if (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: error.msg,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#FFB84D',
			});
			return false;
		}
		return true;
	}

	function saveLocalStorage(video_id) {
		setLocalStorage("video_id", video_id);
		setLocalStorage("optionSelected", $optionSelected);
		setLocalStorage("thresholdSelected", $thresholdSelected);

		if ($optionSelected === "option2_texto" || $optionSelected === "option3_ia") {
		    setLocalStorage("idiomaSelected", $idiomaSelected);
		    setLocalStorage("tonoSelected", $tonoSelected);
		    setLocalStorage("voiceSelected", $voiceSelected);
		}
		if ($thresholdSelected === "option5_thresh_manual") {
		    setLocalStorage("thresholdValue", $thresholdValue);
		}
		setLocalStorage("fileDetails", $fileDetails);
		setLocalStorage("fileUploaded", $fileUploaded);
	}

	async function subirArchivos(){
		// console.log($fileUploaded);
		// console.log($fileObject);
		// console.log("OptionSelected: " + $optionSelected);
		// console.log("ThresholdSelected: " + $thresholdSelected);
		// console.log("ThresholdValue: " + $thresholdValue);
		// console.log("VoiceSelected: " + $voiceSelected);
		// console.log("IdiomaSelected: " + $idiomaSelected);
		// console.log("TonoSelected: " + $tonoSelected);

		if (!checkFields()) return;

		const formData = new FormData();
		const file = $fileObject;
		formData.append("file", file);
		formData.append("optionSelected", $optionSelected);
		formData.append("thresholdSelected", $thresholdSelected);

	
		const requiereDetalles = ["option2_texto", "option3_ia"];
		if (requiereDetalles.includes($optionSelected)) {
			const idiomaKey = Object.keys(idiomaDiccionario).find(key => idiomaDiccionario[key] === $idiomaSelected);
			formData.append("idiomaSelected", idiomaKey);
			formData.append("tonoSelected", $tonoSelected);
			formData.append("voice_id", $voiceSelected);
		}

		if ($thresholdSelected === "option5_thresh_manual") {
			console.log("ThresholdValue: " + $thresholdValue);
			formData.append("thresholdValue", $thresholdValue);
		}
		
		const url = `${BACKEND_URL}/api/videos/upload_file/`;
		const response = await fetch(url, {
			method: "POST",
			body: formData,
		});

		const data = await response.json();

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

		const video_id = data.video_id;

		saveLocalStorage(video_id)
		
		swalSpinner('Guardando archivo');

		handleFileProcessing(video_id);
	}

	async function handleFileProcessing(video_id){
		swalSpinner('Extrayendo silencios');
		const response = await fetch(`${BACKEND_URL}/api/videos/get_silences/${video_id}/`, {
			method: "GET",
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
		
		let data = await response.json();
		console.log(data);

		Swal.fire({
			icon: 'success',
			title: 'Éxito',
			text: "El archivo se ha procesado correctamente correctamente.",
			confirmButtonColor: '#FFB84D',
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {
			descriptions.set(data.descriptions);
			videoId.set(video_id);
			fileUrl.set(data.file_url);
			fileName.set(data.file_name);

			setLocalStorage("descriptions", data.descriptions);
			setLocalStorage("file_url", data.file_url);
			setLocalStorage("file_name", data.name);

			goto("/show_descriptions");
		});

	}
</script>

<Navbar>
	<h3>Subida de archivos</h3>
</Navbar>

<main>
	<FileUploader/>
	<hr>  

	{#if $fileUploaded}
		<OptionsHandler/>

		<hr>
			
		<ThresholdHandler/>
		
		<hr>
	
		<div class="button-container">
			<button id="start-button" on:click={subirArchivos}>
				Comenzar
			</button>
		</div>

	{/if}
</main>

<style>
	button {
		background-color: #FFB84D;
		color: white;
		border: none;
		padding: 12px 25px;
		font-size: 1.1rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	button:hover {
		background-color: white;
		border: 2px solid #FFE6CC;
		color: #FFB84D;
	}

	#start-button {
		margin-bottom: 40px;
	}

	hr {
		border: 0;
		height: 2px;
		background-color: #FFB84D;
		margin: 50px auto;
	}

	.button-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
