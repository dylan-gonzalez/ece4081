# ESP32 Serial Web App

A simple web application that connects to your ESP32 via serial port using the Web Serial API.

## Features

- Connect to ESP32 via USB serial port
- Real-time display of serial output
- Send commands to ESP32
- Clean, responsive interface
- Timestamped messages

## Requirements

- Modern Chrome-based browser (Chrome, Edge, Opera)
- ESP32 connected via USB
- HTTPS connection (required for Web Serial API)

## How to Use

1. Open `index.html` in a Chrome-based browser
2. Click "Connect to Serial Port"
3. Select your ESP32's COM port from the dialog
4. View real-time output from your ESP32
5. Send commands using the input field

## ESP32 Setup

Make sure your ESP32 code includes:
```cpp
Serial.begin(115200);  // Match the baud rate in the web app
```

## Local Development

For local testing, you can serve the files using a simple HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using Live Server extension in VS Code
```

Then navigate to `http://localhost:8000`

## Browser Compatibility

- ✅ Chrome 89+
- ✅ Edge 89+
- ✅ Opera 75+
- ❌ Firefox (Web Serial API not supported)
- ❌ Safari (Web Serial API not supported)

## Troubleshooting

1. **"Web Serial API is not supported"**: Use a Chrome-based browser
2. **Can't see COM port**: Make sure ESP32 is connected and drivers are installed
3. **Connection fails**: Check that no other application (Arduino IDE, PuTTY) is using the serial port
4. **No data received**: Verify ESP32 is sending data via `Serial.print()` or `Serial.println()`