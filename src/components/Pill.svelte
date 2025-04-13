<script>
    export let optionSelected = null;
    export let thresholdSelected = null;
    export let option;
    export let value;

    let isThreshold = optionSelected === null;
    let selectedValue = isThreshold ? thresholdSelected : optionSelected;

    function handleChange(event) {
        selectedValue = event.target.value;
        if (isThreshold) {
            thresholdSelected = selectedValue;
        } else {
            optionSelected = selectedValue;
        }
    }

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
</script>

<div class="form-check">
    <input
        class="form-check-input"
        type="radio"
        name="options"
        id={value}
        value={value}
        checked={selectedValue === value}
        on:change={handleChange}
    />
    <label class="form-check-label" for={value}>
        {option}
    </label>
</div>

<style>
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