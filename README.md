# Puch Maxi Speed Calculator

A web-based calculator that estimates the top speed of a Puch Maxi moped based on various configuration options including cylinder size, carburetor, gearing ratios, and exhaust system.

## Features

- Calculate estimated top speed based on moped configuration
- Real-time speed breakdown showing contribution of each component
- Dynamic default settings that adjust based on cylinder size
- Safety warnings for incompatible component combinations
- Mobile-responsive interface
- Pure JavaScript implementation with no dependencies

## Development

### Setup
```bash
# Clone repository
git clone https://github.com/yourusername/moped-speed-calculator.git

# Open in browser
open index.html
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

