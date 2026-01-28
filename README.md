# Puch Maxi Speed Calculator

A web-based calculator that estimates the top speed of a Puch Maxi moped based on various configuration options including cylinder size, carburetor, gearing ratios, and exhaust system.

## Features

- Calculate estimated top speed based on moped configuration
- Real-time speed breakdown showing contribution of each component
- Dynamic default settings that adjust based on cylinder size
- Safety warnings for incompatible component combinations
- Mobile-responsive interface
- Pure JavaScript implementation with no dependencies

## Live Demo

Open `index.html` in any modern web browser.

## How It Works

### Speed Calculation Formula

The calculator uses an additive model to estimate top speed:

```
Total Speed = Base Speed + Gearing Bonus + Carburetor Bonus + Exhaust Bonus
```

#### Base Speed (by Cylinder)
- Original 50cc: 30 km/h
- 50cc: 40 km/h
- 60cc: 45 km/h
- 65cc: 50 km/h
- 70cc: 55 km/h
- 72cc: 60 km/h
- 74cc: 70 km/h

#### Gearing Calculation
```
Gearing Bonus = (Front Sprocket - 13) × 5 + (45 - Rear Sprocket) × 2
```
- Base configuration: 13 teeth front / 45 teeth rear
- Each front tooth change: ±5 km/h
- Each rear tooth change: ±2 km/h (inverse)

#### Carburetor Bonuses
Progressive speed increases by carburetor size:
- 12mm: Baseline (0 km/h for ≤70cc, +9 km/h baseline for >70cc)
- 14mm: +3 km/h
- 15mm: +6 km/h
- 17mm: +9 km/h
- 17.5mm: +10 km/h
- 19mm: +13 km/h (maximum effective for ≤70cc cylinders)
- 19.5mm: +14 km/h
- 21mm: +17 km/h
- 24mm: +20 km/h

**Note:** Carburetors larger than 19mm provide no additional benefit on cylinders ≤70cc.

#### Exhaust System
```
Exhaust Bonus = (Selected Index - Base Index) × 4 km/h
```
- 18er: -4 or -8 km/h (depending on cylinder)
- 22er: Baseline for ≤60cc cylinders
- 28er: Baseline for >60cc cylinders
- 28er Reso: +4 km/h

### Safety Warnings

The calculator displays warnings for dangerous or inefficient configurations:

1. **28er Reso + ≤65cc cylinder**: Not recommended (can damage engine)
2. **18er exhaust + ≥65cc cylinder**: Insufficient flow for large cylinders
3. **Oversized carburetor on small cylinders**: No speed benefit on ≤70cc with >19mm carburetor

## Technical Documentation

### File Structure
```
moped-speed-calculator/
├── index.html          # Main HTML structure and UI
├── script.js           # Core calculation logic
├── style.css           # Styling and layout
└── README.md           # This file
```

### Configuration Object

All calculation constants are defined in `CONFIG`:

```javascript
const CONFIG = {
    baseGearing: { front: 13, rear: 45 },
    baseSpeeds: { stock: 30, 50: 40, 60: 45, 65: 50, 70: 55, 72: 60, 74: 70 },
    gearingMultiplier: { front: 5, rear: 2 },
    carbBonuses: [0, 3, 6, 9, 10, 13, 14, 17, 20],
    carbMaxIndex70cc: 5,  // 19mm maximum
    exhaustStepBonus: 4,
    exhaustResoIndex: 3,
    maxCylinderForReso: 65
};
```

### Core Functions

#### `calculateSpeed()`
Main calculation function that:
1. Reads all input values
2. Gets base speed from cylinder configuration
3. Calculates gearing bonus from sprocket differences
4. Calculates carburetor bonus (with 70cc+ limit)
5. Calculates exhaust bonus based on cylinder baseline
6. Updates display with total speed and breakdown
7. Shows warnings for incompatible configurations

#### `updateExhaustDefaults()`
Updates the exhaust dropdown to show which option is "Standard" for the selected cylinder:
- ≤60cc: 22er is standard
- >60cc: 28er is standard

#### `updateCarbDefault()`
Updates the carburetor dropdown to show which option is "Standard" for the selected cylinder:
- ≤70cc: 12mm is standard
- >70cc: 17mm is standard

#### `formatBonus(value)`
Formats bonus values for display with appropriate signs.

**Parameters:**
- `value` (number): Bonus value in km/h

**Returns:**
- String: Formatted bonus (e.g., "+5 km/h", "-3 km/h", "±0 km/h")

### Event Handling

```javascript
// Cylinder change triggers default updates and recalculation
elements.zylinder.addEventListener('change', () => {
    updateExhaustDefaults();
    updateCarbDefault();
    calculateSpeed();
});

// Other inputs only trigger recalculation
[elements.vergaser, elements.vorne, elements.hinten, elements.auspuff]
    .forEach(el => el.addEventListener('change', calculateSpeed));
```

## Usage Examples

### Example 1: Stock Configuration
**Setup:**
- Original 50cc cylinder
- 12mm carburetor
- 13/45 gearing (original)
- 22er exhaust

**Result:** 30 km/h (base speed only, no bonuses)

### Example 2: Mid-Range Tuning
**Setup:**
- 65cc cylinder
- 17mm carburetor
- 14/43 gearing
- 28er exhaust

**Calculation:**
- Base: 50 km/h
- Gearing: (14-13)×5 + (45-43)×2 = +9 km/h
- Carburetor: +9 km/h (17mm)
- Exhaust: 0 km/h (28er is baseline for 65cc)
- **Total: 68 km/h**

### Example 3: High-Performance Setup
**Setup:**
- 70cc cylinder
- 19mm carburetor
- 16/40 gearing
- 28er Reso exhaust

**Calculation:**
- Base: 55 km/h
- Gearing: (16-13)×5 + (45-40)×2 = +25 km/h
- Carburetor: +4 km/h (capped at 19mm for 70cc)
- Exhaust: +4 km/h (Reso is +1 step from baseline)
- **Total: 88 km/h**

## Browser Compatibility

Requires modern browser with support for:
- ES6 syntax (const, let, arrow functions)
- DOM querySelector/getElementById
- classList API
- Template literals

**Compatible with:**
- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+

## Extending the Calculator

### Adding a New Cylinder Size

1. Add to `CONFIG.baseSpeeds`:
```javascript
baseSpeeds: {
    // existing sizes...
    80: 75  // 80cc with 75 km/h base speed
}
```

2. Add option in HTML:
```html
<option value="80">80 ccm</option>
```

3. Update baseline logic in `updateExhaustDefaults()` if needed

### Adding a New Carburetor Size

1. Add bonus to `CONFIG.carbBonuses` array:
```javascript
carbBonuses: [0, 3, 6, 9, 10, 13, 14, 17, 20, 23]  // Added 23 for 26mm
```

2. Add option in HTML:
```html
<option value="9">26 mm</option>
```

### Adding a New Exhaust Type

1. Add option in HTML:
```html
<option value="4">32er</option>
```

2. Bonus is calculated automatically using `exhaustStepBonus`

3. Add warnings in `calculateSpeed()` if needed

## Limitations

This calculator provides estimates only. Real-world speed depends on many factors not modeled:

- Rider weight
- Wind resistance and aerodynamics
- Tire pressure and size
- Engine tuning quality
- Road conditions and grade
- Altitude and air temperature
- Fuel quality and mixture
- Component wear and condition

Use this tool as a general guide for planning your setup, not as a guarantee of actual performance.

## Known Issues

- No input validation for impossible configurations
- Settings are not saved (cleared on page refresh)
- German language only
- Linear bonus model (real-world gains may vary)

## Future Enhancements

- [ ] localStorage for persisting settings
- [ ] Metric/imperial unit toggle
- [ ] Multi-language support (English, German)
- [ ] Acceleration estimation
- [ ] Weight factor in calculations
- [ ] Preset configurations (racing, touring, etc.)
- [ ] Fuel consumption estimates
- [ ] Print/export results

## Development

### Setup
```bash
# Clone repository
git clone https://github.com/yourusername/moped-speed-calculator.git

# Open in browser
open index.html
```

### Testing
Open `index.html` in multiple browsers and test:
- All cylinder configurations
- Extreme gearing combinations
- Warning triggers
- Mobile responsiveness
- Calculation accuracy

### Deployment
This is a static site and can be hosted on:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Simply upload all files to your hosting provider.

## Note

Data is not saved - if you refresh the page, your configuration will be reset to defaults.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across browsers
5. Submit a pull request with clear description

## License

MIT License - feel free to use and modify for your own projects.

## Acknowledgments

Based on Puch Maxi tuning knowledge from the moped community. Speed calculations are approximate and based on common tuning results.

## Support

For questions or issues:
- Open an issue on GitHub
- Check existing issues for solutions
- Contribute improvements via pull request
