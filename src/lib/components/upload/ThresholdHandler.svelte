<script>
    import { thresholdSelected, thresholdValue } from "$lib/writables";
</script>

<main>
    <div class="handle-options-selector">
        <h4>Umbral de silencio</h4>
        <fieldset>
            <div class="form-check">
                <input
                    class="form-check-input"
                    type="radio"
                    name="umbral"
                    value="option4_thresh_automatico"
                    id="option4_thresh_automatico"
                    bind:group={$thresholdSelected}
                />
                <label class="form-check-label" for="option4_thresh_automatico">
                    Automático
                </label>
            </div>
            <div class="form-check">
                <input
                    class="form-check-input"
                    type="radio"
                    name="umbral"
                    value="option5_thresh_manual"
                    id="option5_thresh_manual"
                    bind:group={$thresholdSelected}
                />
                <label class="form-check-label" for="option5_thresh_manual">
                    Manual
                </label>
            </div>
        </fieldset>

        <div class="function-description" class:hidden={$thresholdSelected === ""}>
            {#if $thresholdSelected === "option4_thresh_automatico"}
                <p>El sistema detectará automáticamente el umbral de silencio.</p>
            {:else if $thresholdSelected === "option5_thresh_manual"}
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
                    bind:value={$thresholdValue}
                    class="threshold-input"
                />
            {/if}
        </div>
    </div>
</main>


<style>
    .hidden {
        display: none;
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
