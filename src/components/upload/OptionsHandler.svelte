<script>
	import { fetchVoices, playTextToSpeech } from "$lib/voiceUtils";
	import { idiomaSelected, optionSelected, tonoSelected, voiceSelected, sampleText, voices } from "$lib/writables";
	import { idiomaDiccionario } from "$lib/basic";
	import { get } from "svelte/store";

	let tonos = ['Neutro', 'Femenino'];

	// Variables locales
	let localOption = get(optionSelected);
	let localIdioma = get(idiomaSelected);
	let localTono = get(tonoSelected);
	let localVoice = get(voiceSelected);
	let localSampleText = get(sampleText);

	// Sync con los stores reactivos
	$: optionSelected.set(localOption);
	$: idiomaSelected.set(localIdioma);
	$: tonoSelected.set(localTono);
	$: voiceSelected.set(localVoice);
	$: sampleText.set(localSampleText);

	$: if (localIdioma && localTono) {
		loadVoices(localIdioma, localTono);
	}

	async function loadVoices(idioma, tono) {
		try {
			const result = await fetchVoices(idioma, tono);
			voices.set(result);
		} catch (err) {
			console.error("Error al cargar voces:", err);
		}
	}
</script>

<main>
	<div class="handle-options-selector">
		<h4>Modo de funcionamiento</h4>
		<fieldset>
			<div class="form-check">
				<input
					class="form-check-input"
					type="radio"
					name="modo"
					value="option1_grabar"
					id="option1_grabar"
					bind:group={localOption}
				/>
				<label class="form-check-label" for="option1_grabar">Grabar audio</label>
			</div>

			<div class="form-check">
				<input
					class="form-check-input"
					type="radio"
					name="modo"
					value="option2_texto"
					id="option2_texto"
					bind:group={localOption}
				/>
				<label class="form-check-label" for="option2_texto">Síntesis de texto</label>
			</div>

			<div class="form-check">
				<input
					class="form-check-input"
					type="radio"
					name="modo"
					value="option3_ia"
					id="option3_ia"
					bind:group={localOption}
				/>
				<label class="form-check-label" for="option3_ia">Generación automática de texto</label>
			</div>
		</fieldset>

		<div class="function-description" class:hidden={localOption === ""}>
			{#if localOption === "option1_grabar"}
				<p>Graba un audio para añadir una descripción a tu video.</p>
			{:else if localOption === "option2_texto"}
				<p>Escribe la descripción que será sintetizada.</p>
			{:else if localOption === "option3_ia"}
				<p>Genera automáticamente un texto descriptivo utilizando IA.</p>
			{/if}
		</div>

		{#if localOption !== "option1_grabar" && localOption !== ""}
			<div class="voice-selection">
				<p>Selecciona el idioma y la voz:</p>
				<select bind:value={localIdioma}>
					<option disabled selected value="">Selecciona un idioma</option>
					{#each Object.values(idiomaDiccionario) as idioma}
						<option value={idioma}>{idioma}</option>
					{/each}
				</select>

				<p>Selecciona un tono:</p>
				<select bind:value={localTono}>
					<option disabled selected value="">Selecciona un tono</option>
					{#each tonos as tono}
						<option value={tono}>{tono}</option>
					{/each}
				</select>

				{#if localIdioma && localTono}
					{#if $voices.length === 0}
						<p>Cargando voces o no hay voces disponibles.</p>
					{:else}
						<p>Selecciona una voz</p>
						<select bind:value={$voiceSelected}>
							<option disabled value="">Selecciona una voz</option>
							{#each $voices as voice}
								<option value={voice.voice_id}>{voice.name}</option>
							{/each}
						</select>

						<div class="sample-text-sound">
							<textarea
								rows="3"
								placeholder="Escribe un texto para escuchar la voz seleccionada"
								bind:value={localSampleText}
								class="datalist-input"
							></textarea>
							<button
								on:click={() =>
									playTextToSpeech(localIdioma, localTono, localVoice, localSampleText)
								}
								disabled={!localSampleText || !localVoice}
							>
								Escuchar voz de prueba
							</button>
						</div>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
</main>

<style>
	.hidden {
		display: none;
	}

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

	fieldset {
		border: none;
		display: flex;
		flex-wrap: wrap;
		gap: 15px;
		justify-content: center;
		padding: 10px 0;
	}

	.handle-options-selector {
		margin: 30px auto;
		width: 90%;
		max-width: 900px;
	}

	h4 {
		margin-top: 20px;
		text-align: center;
		font-size: 1.6rem;
		margin-bottom: 15px;
		font-weight: 600;
	}

	.function-description {
		margin-top: 20px;
		padding: 15px 20px;
		background-color: #fff9f3;
		border-left: 6px solid #FFB84D;
		border-radius: 8px;
		font-size: 1rem;
		color: #333;
		max-width: auto;
		margin-left: auto;
		margin-right: auto;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
	}

	.function-description p {
		margin: 0;
		text-align: center;
		font-style: italic;
		line-height: 1.5;
	}

	.function-description:hover {
		background-color: #fff5e6;
		border-left: 6px solid #FFA726;
	}

	.function-description:hover p {
		color: #FFA726;
	}

	.voice-selection {
		display: flex;
		flex-direction: column;
		gap: 15px;
		align-items: center;
		margin-top: 20px;
		padding: 15px 20px;
		background-color: #fff9f3;
		border-left: 6px solid #FFB84D;
		border-radius: 8px;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
	}

	.voice-selection p {
		margin: 0;
		text-align: center;
		font-style: italic;
		color: #333;
	}

	.datalist-input {
		margin-top: 5px;
		padding: 10px 15px;
		width: 100%;
		max-width: 300px;
		border: 2px solid #FFE6CC;
		border-radius: 8px;
		font-size: 1rem;
		outline: none;
		box-shadow: none;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	.datalist-input:focus {
		border-color: #FFB84D;
		box-shadow: 0 0 5px rgba(255, 184, 77, 0.5);
	}

	.datalist-input::placeholder {
		color: #999;
		font-style: italic;
	}

	.datalist-input:hover {
		border-color: #FFA726;
		box-shadow: 0 0 5px rgba(255, 184, 77, 0.3);
	}

	.sample-text-sound {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		margin-top: 15px;
	}

	.sample-text-sound textarea {
		width: 100%;
		max-width: 400px;
		padding: 10px 15px;
		border: 2px solid #FFE6CC;
		border-radius: 8px;
		font-size: 1rem;
		outline: none;
		resize: vertical;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	.sample-text-sound textarea:focus {
		border-color: #FFB84D;
		box-shadow: 0 0 5px rgba(255, 184, 77, 0.5);
	}

	.sample-text-sound textarea::placeholder {
		color: #999;
		font-style: italic;
	}

	.form-check {
		position: relative;
	}

	.form-check-input {
		display: none;
	}

	.form-check-label {
		display: inline-block;
		padding: 10px 25px;
		border-radius: 50px;
		background-color: #f0f0f0;
		color: #333;
		cursor: pointer;
		transition: all 0.3s ease;
		border: 2px solid transparent;
		font-size: 1rem;
		user-select: none;
		text-align: center;
		min-width: 200px;
	}

	.form-check-label:hover {
		background-color: #ffe6cc;
	}

	.form-check-input:checked + .form-check-label {
		background-color: #FFB84D;
		color: white;
		border-color: #FFA726;
	}
</style>
