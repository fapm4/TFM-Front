<script>
	let { video_id, start, end, text, desc_id, onDelete, onUpdateTime, onUpdateDescription, option_selected } = $props();

	import { playTextToSpeech } from "$lib/voiceUtils";
	import { BACKEND_URL } from "$lib/basic";
	import Swal from "sweetalert2";

	console.log(option_selected);
	
	async function playDescription(text) {
		let voiceSelected = localStorage.getItem("voice_selected");
		await playTextToSpeech(null, null, voiceSelected, text, true);
	}

	function autoResize(event) {
		const textarea = event.target;
		textarea.style.height = "auto"; // Reset height
		textarea.style.height = textarea.scrollHeight + "px"; // Set new height
	}

	async function deleteDescription() {
		console.log(video_id, desc_id);

		const response = await fetch(`${BACKEND_URL}/api/videos/delete_description/${video_id}/${desc_id}/`, {
			method: "DELETE",
		});

		if (response.status !== 200) {
			const data = await response.json();
			console.log(data);
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: data.message,
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#FFB84D',
			});
		} else {
			Swal.fire({
				icon: 'success',
				title: 'Descripción eliminada',
				text: 'La descripción ha sido eliminada correctamente.',
				timer: 1000,
			});
		}

		onDelete(video_id, desc_id);
	}

	async function updateTime(type, value) {
		const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
		if (!timePattern.test(value)) {
			Swal.fire({
				icon: 'error',
				title: 'Formato incorrecto',
				text: 'El formato debe ser hh:mm:ss',
				confirmButtonText: 'Aceptar',
				confirmButtonColor: '#FFB84D',
			});
			return;
		}

		const response = await fetch(`${BACKEND_URL}/api/videos/update_time_description/${video_id}/${desc_id}/`, {
			method: "PUT",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				type: type,
				value: value
			})
		});
		
		console.log("Response status:", response.status);
		if (response.status !== 200) {
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

		onUpdateTime(video_id, desc_id, type, value);
	}

	async function updateDescription(text) {
		console.log("Updating description:", video_id, desc_id, text);

		const response = await fetch(`${BACKEND_URL}/api/videos/update_description/${video_id}/${desc_id}/`, {
			method: "PUT",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ description: text })
		});

		if (response.status !== 200) {
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

		onUpdateDescription(video_id, desc_id, text);
	}
</script>

<tr>
	<td>
		<button class="icon-button delete-button" title="Eliminar" on:click={deleteDescription}>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-x" viewBox="0 0 16 16">
				<path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293z"/>
				<path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
			</svg>
		</button>
	</td>
	<td>
		<input
			type="text"
			bind:value={start}
			on:change={() => updateTime("start_at", start)}
			placeholder="hh:mm:ss"
		/>
	</td>
	<td>
		<input
			type="text"
			bind:value={end}
			on:change={() => updateTime("end_at", end)}
			placeholder="hh:mm:ss"
		/>
	</td>
		<td>
		{#if option_selected === "option1_grabar"}
			<button class="icon-button" title="Grabar" id="record-button">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
					<path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
				</svg>
			</button>

			<button class="icon-button" title="Detener grabación" id="stop-button">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
				<path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
				</svg>
			</button>
			
		{:else}
			<textarea 
				bind:value={text} 
				placeholder="Añade una descripción..." 
				class="description-textarea"
				on:input={autoResize}
				on:change={() => updateDescription(text)}
			/>
		{/if}

	</td>
	<td>
		<button class="icon-button tts-button" title="Texto a voz" on:click={() => playDescription(text)}>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
				<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
			</svg>
		</button>
	</td>
</tr>

<style>
	td {
		padding: 14px 20px;
		text-align: center;
		border-bottom: 1px solid #FFE6CC;
		font-size: 1rem;
		color: #333;
	}

	input {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid #FFE6CC;
		border-radius: 6px;
		/* background-color: #FFF7ED; */
		font-size: 1rem;
		color: #333;
		box-sizing: border-box;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	input::placeholder {
		color: #aaa;
	}

	input:focus {
		outline: none;
		border-color: #FFB84D;
		box-shadow: 0 0 0 2px rgba(255, 184, 77, 0.3);
		background-color: #fff;
	}

	.icon-button {
		background-color: #FFF3E0; /* suave fondo crema */
		border: none;
		padding: 8px;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.3s ease, transform 0.2s ease;
	}

	.icon-button svg {
		fill: #FFB84D;
		transition: fill 0.3s ease;
	}

	.icon-button:hover {
		background-color: #FFB84D;
		transform: scale(1.1);
	}

	.icon-button:hover svg {
		fill: white;
	}

	.description-textarea {
		font-size: 1.1rem;
		padding: 12px 16px;
		min-width: 300px;
		width: 100%;
		border: 1px solid #FFE6CC;
		border-radius: 8px;
		box-sizing: border-box;
		resize: none;
		overflow: hidden;
		line-height: 1.4;
		min-height: 48px;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

</style>
