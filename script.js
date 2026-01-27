const CONFIG = {
    baseGearing: { front: 13, rear: 45 },
    baseSpeeds: {
        stock: 30,
        50: 40,
        60: 45,
        65: 50,
        70: 55
    },
    gearingMultiplier: { front: 5, rear: 2 },
    carbStepBonus: 3,
    exhaustStepBonus: 4,
    exhaustResoIndex: 3,
    maxCylinderForReso: 65
};

const elements = {
    zylinder: document.getElementById('zylinder'),
    vergaser: document.getElementById('vergaser'),
    vorne: document.getElementById('uebersetzung-vorne'),
    hinten: document.getElementById('uebersetzung-hinten'),
    auspuff: document.getElementById('auspuff'),
    speedResult: document.getElementById('speed-result'),
    warning: document.getElementById('warning'),
    warningText: document.querySelector('#warning .warning-text'),
    basisValue: document.getElementById('basis-value'),
    uebersetzungValue: document.getElementById('uebersetzung-value'),
    vergaserValue: document.getElementById('vergaser-value'),
    auspuffValue: document.getElementById('auspuff-value'),
    totalValue: document.getElementById('total-value')
};

function formatBonus(value) {
    if (value > 0) return '+' + value + ' km/h';
    if (value < 0) return value + ' km/h';
    return '±0 km/h';
}

function calculateSpeed() {
    const cylinderRaw = elements.zylinder.value;
    const cylinder = cylinderRaw === 'stock' ? 'stock' : parseInt(cylinderRaw);
    const cylinderNum = cylinderRaw === 'stock' ? 50 : cylinder;
    const carbIndex = parseInt(elements.vergaser.value);
    const front = parseInt(elements.vorne.value);
    const rear = parseInt(elements.hinten.value);
    const exhaustIndex = parseInt(elements.auspuff.value);

    const baseSpeed = CONFIG.baseSpeeds[cylinder];

    const gearingBonus =
        (front - CONFIG.baseGearing.front) * CONFIG.gearingMultiplier.front +
        (CONFIG.baseGearing.rear - rear) * CONFIG.gearingMultiplier.rear;

    const carbBonus = carbIndex * CONFIG.carbStepBonus;

    const exhaustBaseIndex = cylinderNum > 60 ? 2 : 1;
    const exhaustBonus = (exhaustIndex - exhaustBaseIndex) * CONFIG.exhaustStepBonus;

    const totalSpeed = baseSpeed + gearingBonus + carbBonus + exhaustBonus;

    elements.speedResult.textContent = totalSpeed;
    elements.basisValue.textContent = baseSpeed + ' km/h';
    elements.uebersetzungValue.textContent = formatBonus(gearingBonus);
    elements.vergaserValue.textContent = formatBonus(carbBonus);
    elements.auspuffValue.textContent = formatBonus(exhaustBonus);
    elements.totalValue.textContent = totalSpeed + ' km/h';

    let warningMsg = '';
    if (exhaustIndex === CONFIG.exhaustResoIndex && cylinderNum <= CONFIG.maxCylinderForReso) {
        warningMsg = '28er Reso Auspuff auf keinen Fall mit diesem Zylinder fahren!';
    } else if (exhaustIndex === 0 && cylinderNum >= 65) {
        warningMsg = '18er Auspuff auf keinen Fall mit diesem Zylinder fahren!';
    }

    if (warningMsg) {
        elements.warningText.textContent = warningMsg;
        elements.warning.classList.remove('hidden');
    } else {
        elements.warning.classList.add('hidden');
    }
}

function updateExhaustDefaults() {
    const cylinderRaw = elements.zylinder.value;
    const cylinderNum = cylinderRaw === 'stock' ? 50 : parseInt(cylinderRaw);
    const standardIndex = cylinderNum > 60 ? 2 : 1;
    const options = elements.auspuff.options;

    for (let i = 0; i < options.length; i++) {
        const base = options[i].textContent.replace(/ \(Standard\)/, '');
        options[i].textContent = i === standardIndex ? base + ' (Standard)' : base;
    }

    elements.auspuff.value = String(standardIndex);
}

elements.zylinder.addEventListener('change', () => {
    updateExhaustDefaults();
    calculateSpeed();
});

[elements.vergaser, elements.vorne, elements.hinten, elements.auspuff]
    .forEach(el => el.addEventListener('change', calculateSpeed));

updateExhaustDefaults();
calculateSpeed();
