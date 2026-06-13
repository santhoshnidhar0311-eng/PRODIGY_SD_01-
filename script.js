document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputCelsius = document.getElementById('input-celsius');
    const inputFahrenheit = document.getElementById('input-fahrenheit');
    const inputKelvin = document.getElementById('input-kelvin');

    const cardCelsius = document.getElementById('card-celsius');
    const cardFahrenheit = document.getElementById('card-fahrenheit');
    const cardKelvin = document.getElementById('card-kelvin');

    const thermometerFluid = document.getElementById('thermometer-fluid');
    const thermometerBulb = document.getElementById('thermometer-bulb');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    const presetButtons = document.querySelectorAll('.preset-btn');
    const formulasToggle = document.getElementById('formulas-toggle');
    const formulasContent = document.getElementById('formulas-content');

    // Utility function to format numbers cleanly (max 4 decimals, no trailing zeros)
    function formatNumber(value) {
        if (value === null || value === undefined || isNaN(value)) return '';
        // Using parseFloat on toFixed removes unnecessary trailing zeros (e.g. 25.0000 -> 25)
        return parseFloat(value.toFixed(4)).toString();
    }

    // Mathematical conversions
    const convert = {
        cToF: (c) => (c * 9/5) + 32,
        cToK: (c) => c + 273.15,
        fToC: (f) => (f - 32) * 5/9,
        fToK: (f) => ((f - 32) * 5/9) + 273.15,
        kToC: (k) => k - 273.15,
        kToF: (k) => ((k - 273.15) * 9/5) + 32
    };

    // Update thermometer height and colors based on Celsius value
    function updateVisuals(celsius) {
        if (celsius === null || isNaN(celsius)) {
            // Set to default state (e.g. 0% height, neutral gray color)
            document.documentElement.style.setProperty('--temp-height', '0%');
            document.documentElement.style.setProperty('--temp-color', '#4b5563');
            statusText.textContent = 'Enter a value';
            return;
        }

        // Map Celsius range [-40°C to 100°C] to [0% to 100%] height
        const minTemp = -40;
        const maxTemp = 100;
        let percentage = ((celsius - minTemp) / (maxTemp - minTemp)) * 100;
        
        // Bound the percentage between 3% (so the bulb connection looks full) and 100%
        percentage = Math.max(3, Math.min(100, percentage));
        document.documentElement.style.setProperty('--temp-height', `${percentage}%`);

        // Determine color & status text based on temperature
        let color = '#06b6d4'; // default cyan
        let status = 'Moderate';

        if (celsius <= -273) {
            color = '#3b82f6';
            status = 'Absolute Zero 🧊';
        } else if (celsius < 0) {
            color = '#3b82f6'; // Ice blue
            status = 'Freezing Cold ❄️';
        } else if (celsius >= 0 && celsius < 15) {
            color = '#06b6d4'; // Cyan
            status = 'Cold Temperature 🌡️';
        } else if (celsius >= 15 && celsius <= 28) {
            color = '#10b981'; // Emerald Green
            status = 'Comfortable / Room Temp 🍀';
        } else if (celsius > 28 && celsius <= 45) {
            color = '#f97316'; // Orange
            status = 'Warm / Hot ☀️';
        } else if (celsius > 45 && celsius < 100) {
            color = '#ef4444'; // Red
            status = 'Extremely Hot 🔥';
        } else {
            color = '#ec4899'; // Hot pink / boiling red
            status = 'Boiling Point / Vaporizing 💨';
        }

        document.documentElement.style.setProperty('--temp-color', color);
        statusText.textContent = status;
    }

    // Master conversion function driven by source scale
    function handleInput(source) {
        let val;
        
        if (source === 'celsius') {
            val = parseFloat(inputCelsius.value);
            if (isNaN(val)) {
                inputFahrenheit.value = '';
                inputKelvin.value = '';
                updateVisuals(null);
                return;
            }
            inputFahrenheit.value = formatNumber(convert.cToF(val));
            inputKelvin.value = formatNumber(convert.cToK(val));
            updateVisuals(val);
        } else if (source === 'fahrenheit') {
            val = parseFloat(inputFahrenheit.value);
            if (isNaN(val)) {
                inputCelsius.value = '';
                inputKelvin.value = '';
                updateVisuals(null);
                return;
            }
            const cVal = convert.fToC(val);
            inputCelsius.value = formatNumber(cVal);
            inputKelvin.value = formatNumber(convert.fToK(val));
            updateVisuals(cVal);
        } else if (source === 'kelvin') {
            val = parseFloat(inputKelvin.value);
            if (isNaN(val)) {
                inputCelsius.value = '';
                inputFahrenheit.value = '';
                updateVisuals(null);
                return;
            }
            const cVal = convert.kToC(val);
            inputCelsius.value = formatNumber(cVal);
            inputFahrenheit.value = formatNumber(convert.kToF(val));
            updateVisuals(cVal);
        }
    }

    // Input Event Listeners
    inputCelsius.addEventListener('input', () => handleInput('celsius'));
    inputFahrenheit.addEventListener('input', () => handleInput('fahrenheit'));
    inputKelvin.addEventListener('input', () => handleInput('kelvin'));

    // Focus style classes handlers
    const setupFocusHandlers = (inputEl, cardEl) => {
        inputEl.addEventListener('focus', () => cardEl.classList.add('focused'));
        inputEl.addEventListener('blur', () => cardEl.classList.remove('focused'));
    };
    setupFocusHandlers(inputCelsius, cardCelsius);
    setupFocusHandlers(inputFahrenheit, cardFahrenheit);
    setupFocusHandlers(inputKelvin, cardKelvin);

    // Preset button handlers
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cVal = parseFloat(btn.getAttribute('data-celsius'));
            inputCelsius.value = cVal;
            
            // Add a subtle click feedback animation to the preset button
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = '', 150);

            handleInput('celsius');
        });
    });

    // Formula section toggle
    formulasToggle.addEventListener('click', () => {
        formulasToggle.classList.toggle('active');
        formulasContent.classList.toggle('active');
    });

    // Initialize with Room Temperature (25°C)
    inputCelsius.value = '25';
    handleInput('celsius');
});
