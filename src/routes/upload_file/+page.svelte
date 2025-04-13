<script>
	import Navbar from "../../components/Navbar.svelte";
    import Pill from "../../components/Pill.svelte";

    import { BACKEND_URL, getLocalStorage, setLocalStorage, clearLocalStorage, idiomaDiccionario} from "$lib/basic.js";
    import Swal from "sweetalert2";
	import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Código para manejar las voces
    let idiomasUnicos = [];
    let totalIdiomas = 0;
    let idiomaSelected = "";
    
    let tonos = ['Neutro', 'Femenino'];
    let tonoSelected = "";

    $: if (idiomaSelected !== "" && tonoSelected !== "") {
        fetchVoices();
    }

    let voices = [];
    let voiceSelected = "";

    let sampleText = "Hola, soy una voz de prueba. ¿Cómo estás?";
    let voice_id = "";

    async function fetchVoices() {
        let idioma = Object.keys(idiomaDiccionario).find(key => idiomaDiccionario[key] === idiomaSelected);

        const response = await fetch(`${BACKEND_URL}/get_voices/${idioma}/${tonoSelected}/`);

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
        voices = data.voices;
        console.log(voices);
    }

    onMount(async () => {
        clearLocalStorage();

        const idiomas = Object.values(idiomaDiccionario);
        idiomasUnicos = [...new Set(idiomas)];
        totalIdiomas = idiomasUnicos.length;
    })

    async function playTextToSpeech() {
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
        
        let idioma = Object.keys(idiomaDiccionario).find(key => idiomaDiccionario[key] === idiomaSelected);
        const url = `${BACKEND_URL}/text_to_speech/${idioma}/${tonoSelected}/${voiceSelected}/`;

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
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Código para manejar la subida de archivos

	let draggedOver = false;
	let fileInput;

    let fileUploaded = false;
    let optionSelected = "";
    let fileDetails = "";

    let thresholdSelected = "";
    let thresholdValue = "";

	function handleDragOver(event) {
		event.preventDefault();
		draggedOver = true;
	}

	function handleDragLeave() {
		draggedOver = false;
	}

	function handleDrop(event) {
		event.preventDefault();
		draggedOver = false;

		const files = event.dataTransfer.files;
		if (files.length > 0) {
            fileUploaded = true;
            const file = files[0];
            fileDetails = `Nombre: ${file.name}, Tamaño: ${(file.size / 1024).toFixed(2)} KB, Tipo: ${file.type}`;
			console.log('Archivos soltados:', files);
		}
	}

	function handleUploadClick() {
		fileInput.click();
	}

	function handleFileChange(event) {
		const files = event.target.files;

		if (files.length > 0) {
            fileUploaded = true;
            const file = files[0];
            fileDetails = `Nombre: ${file.name}, Tamaño: ${(file.size / 1024).toFixed(2)} KB, Tipo: ${file.type}`;
			console.log('Archivos seleccionados:', files);
		}
	}

    async function subirArchivos(){
        let message = "";

        if (!fileUploaded) {
            message = "Por favor, selecciona un archivo.";
        }

        else if (optionSelected === "") {
            message = "Por favor, selecciona una opción.";
        }

        else if (thresholdSelected === "") {
            message = "Por favor, selecciona un umbral de silencio.";
        }

        else if (thresholdSelected === "option5_thresh_manual" && thresholdValue === "") {
            message = "Por favor, especifica un umbral de silencio.";
        }

        else if (idiomaSelected === "" && (optionSelected === "option2_texto" || optionSelected === "option3_ia")) {
            message = "Por favor, selecciona un idioma.";
        }

        else if (tonoSelected === "" && (optionSelected === "option2_texto" || optionSelected === "option3_ia")) {
            message = "Por favor, selecciona un tono.";
        }

        else if (voiceSelected === "" && (optionSelected === "option2_texto" || optionSelected === "option3_ia")) {
            message = "Por favor, selecciona una voz.";
        }

        if (message !== "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#FFB84D',
            });

            return;
        }

        const formData = new FormData();
        const file = fileInput.files[0];
        formData.append("file", file);
        formData.append("optionSelected", optionSelected);
        formData.append("thresholdSelected", thresholdSelected);

        
        if (optionSelected === "option2_texto" || optionSelected === "option3_ia") {
            let idioma = Object.keys(idiomaDiccionario).find(key => idiomaDiccionario[key] === idiomaSelected);
            formData.append("idiomaSelected", idioma);
            formData.append("tonoSelected", tonoSelected);
            formData.append("voiceSelected", voiceSelected);
            formData.append("voice_id", voice_id);
        }

        if (thresholdSelected === "option5_thresh_manual") {
            formData.append("thresholdValue", thresholdValue);
        }
        
        const url = `${BACKEND_URL}/upload_file/`;

        var response = await fetch(url, {
            method: "POST",
            body: formData,
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

        var data = await response.json();
        const video_id = data.video_id;

        setLocalStorage("video_id", video_id);
        setLocalStorage("optionSelected", optionSelected);
        setLocalStorage("thresholdSelected", thresholdSelected);

        if (optionSelected === "option2_texto" || optionSelected === "option3_ia") {
            setLocalStorage("idiomaSelected", idiomaSelected);
            setLocalStorage("tonoSelected", tonoSelected);
            setLocalStorage("voiceSelected", voiceSelected);
        }
        if (thresholdSelected === "option5_thresh_manual") {
            setLocalStorage("thresholdValue", thresholdValue);
        }
        setLocalStorage("fileDetails", fileDetails);
        setLocalStorage("fileUploaded", fileUploaded);
        

        Swal.fire({
            icon: 'success',
            title: 'Guardando archivo',
            timerProgressBar: true,
            showConfirmButton: false,
            html: `<l-line-spinner
                size="40"
                stroke="3"
                speed="1"
                color="black" 
                ></l-line-spinner>`
        });

        response = await fetch(`${BACKEND_URL}/process_video/${video_id}/`, {
            method: "POST",
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
        
        data = await response.json();
        console.log(data);
    }
</script>

<Navbar>
    <h3>Subida de archivos</h3>
</Navbar>

<main>
    <div class="file-upload-container">
        <div
            class="dashed-container {draggedOver ? 'drag-over' : ''}"
            on:dragover={handleDragOver}
            on:dragleave={handleDragLeave}
            on:drop={handleDrop}
        >
            <p>{draggedOver ? "¡Suelta el archivo aquí!" : "Arrastra tus archivos aquí"}</p>
        </div>
    
        <input
            type="file"
            bind:this={fileInput}
            on:change={handleFileChange}
            style="display: none"
        />
    
        <button on:click={handleUploadClick}>
            Subir archivo
        </button>
        
        <!-- Muestra los detalles del archivo si se ha subido -->
        {#if fileUploaded}
            <div class="file-details">
                <p>Detalles del archivo:</p>
                <p>{fileDetails}</p>
            </div>
        {/if}
    </div>
    
    <hr>    
    {#if fileUploaded}
        <div class="handle-options-selector">
            <h4>Modo de funcionamiento</h4>
            <fieldset>
                <Pill bind:optionSelected option="Grabar audio" value="option1_grabar" />
                <Pill bind:optionSelected option="Síntexis de texto" value="option2_texto" />
                <Pill bind:optionSelected option="Generación automática de texto" value="option3_ia" />
            </fieldset>

            <div class="function-description" class:hidden={optionSelected === ""}>
                {#if optionSelected === "option1_grabar"}
                    <p>Graba un audio para añadir una descripción a tu video.</p>
                {:else if optionSelected === "option2_texto"}
                    <p>Escribe la descripción que será sintetizada.</p>
                {:else if optionSelected === "option3_ia"}
                    <p>Genera automáticamente un texto descriptivo utilizando IA.</p>
                {/if}
            </div>

            {#if optionSelected !== "option1_grabar" && optionSelected !== ""}
                <div class="voice-selection">
                    <p>Selecciona el idioma y la voz:</p>
                    <select bind:value={idiomaSelected}>
                        <option disabled selected value="">Selecciona un idioma</option>
                        {#each Object.values(idiomaDiccionario) as idioma}
                            <option value={idioma}>{idioma}</option>
                        {/each}
                    </select>
                    
                    <p>Selecciona un tono:</p>
                    <select bind:value={tonoSelected}>
                        <option disabled selected value="">Selecciona un tono</option>
                        {#each tonos as tono}
                            <option value={tono}>{tono}</option>
                        {/each}
                    </select>
<!-- 
                    <input type="text" list="tonos" placeholder="Selecciona un tono" bind:value={tonoSelected} />
                    <datalist id="tonos">
                        {#each tonos as tono}
                            <option value={tono} />
                        {/each}
                    </datalist> -->

                    {#if idiomaSelected !== "" && tonoSelected !== ""}
                        <p>Selecciona una voz:</p>
                        <input type="text" list="voices" placeholder="Selecciona una voz" bind:value={voiceSelected} />
                        <datalist id="voices">
                            {#each voices as voice}
                                <option value={voice.name} />
                            {/each}
                        </datalist>

                        <div class="sample-text-sound">
                            <textarea
                                rows="3"
                                placeholder="Escribe un texto para escuchar la voz seleccionada"
                                bind:value={sampleText}
                                class="datalist-input"
                            ></textarea>
                            <button on:click={playTextToSpeech}>
                                Escuchar voz de prueba
                            </button>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>

        <hr>

        <div class="handle-options-selector">
            <h4>Umbral de silencio</h4>
            <fieldset>
                <Pill bind:thresholdSelected option="Automático" value="option4_thresh_automatico" />
                <Pill bind:thresholdSelected option="Manual" value="option5_thresh_manual" />
            </fieldset>

            <div class="function-description" class:hidden={thresholdSelected === ""}>
                {#if thresholdSelected === "option4_thresh_automatico"}
                    <p>El sistema detectará automáticamente el umbral de silencio.</p>
                {:else if thresholdSelected === "option5_thresh_manual"}
                    <p>
                        Especifica manualmente el umbral de silencio. Ten en cuenta que el umbral de silencio se encuentra típicamente entre 
                        <strong>-60 dB y -40 dB</strong>. Un valor más bajo (por ejemplo, -60 dB) detecta silencios más suaves, mientras que 
                        un valor más alto (por ejemplo, -40 dB) es más tolerante al ruido de fondo.
                    </p>

                    <p>Ejemplo: Si seleccionas -50 dB, el sistema considerará como silencio cualquier sonido por debajo de -50 dB.</p>

                    <input
                        type="number"
                        min="-100"
                        max="-20"
                        step="1"
                        placeholder="-50 dB"
                        bind:value={thresholdValue}
                        class="threshold-input"
                    />
                {/if}
            </div>
            
        </div>
        
        <hr>
    
        <div class="button-container">
            <button id="start-button" on:click={subirArchivos}>
                Comenzar
            </button>
        </div>
    {/if}
</main>

<style>
    .hidden {
        display: none;
    }

    .file-upload-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }

    .dashed-container {
        border: 2px dashed #FFE6CC;
        border-radius: 15px;
        padding: 30px;
        width: 80%;
        max-width: 1000px;
        min-height: 250px;
        margin-top: 30px;
        text-align: center;
        transition: background-color 0.3s, border-color 0.3s;
        background-color: #fffdf8;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }

    .dashed-container p {
        font-size: 1.2rem;
        color: #444;
    }

    .dashed-container.drag-over {
        background-color: #fff5e6;
        border-color: #FFA726;
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

    .file-details {
        margin-top: 15px;
        padding: 12px 20px;
        background-color: #fff9f3;
        border: 1px solid #FFA726;
        border-radius: 8px;
        width: 80%;
        max-width: 800px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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

    #start-button {
        margin-bottom: 40px;
    }

    h4 {
        margin-top: 20px;
        text-align: center;
        font-size: 1.6rem;
        margin-bottom: 15px;
        font-weight: 600;
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

    .threshold-input {
        margin-top: 10px;
        padding: 10px 15px;
        width: 100%;
        max-width: 300px;
        border: 2px solid #FFE6CC;
        border-radius: 8px;
        font-size: 1rem;
        outline: none;
        box-shadow: none;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    .threshold-input:focus {
        border-color: #FFB84D;
        box-shadow: 0 0 5px rgba(255, 184, 77, 0.5);
    }

    .threshold-input::placeholder {
        color: #999;
        font-style: italic;
    }

    .threshold-input:hover {
        border-color: #FFA726;
        box-shadow: 0 0 5px rgba(255, 184, 77, 0.3);
    }

    .threshold-input:disabled {
        background-color: #f0f0f0;
        color: #999;
        cursor: not-allowed;
    }

    .threshold-input:disabled:hover {
        border-color: #f0f0f0;
        box-shadow: none;
    }

    .threshold-input:disabled::placeholder {
        color: #ccc;
    }

    .threshold-input:disabled:hover::placeholder {
        color: #999;
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


</style>
