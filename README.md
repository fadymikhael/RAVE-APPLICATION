# RAVE Timbre Transfer

A React Native Expo app for audio timbre transfer using RAVE models, connected to a Python Flask server.

## 📲 Test the app on your mobile

Open [this Expo link](https://expo.dev/preview/update?message=Add+README&updateRuntimeVersion=1.0.0&createdAt=2025-07-12T15%3A00%3A53.487Z&slug=exp&projectId=2c76bed0-26ed-4f86-8449-fc5846eb5393&group=e82ae2ad-dea4-46a8-bd39-04306ea52982) in your browser and scan the QR code with the Expo Go app.


## Features

- Connect to a Flask server (set IP/port in app).
- Select RAVE models (Jazz, Darbouka, Parole, Cats, Dogs).
- Record audio or use default `sample.mp3`.stat
- Transform audio via server.
- Play original/transformed audio on loudspeaker.
- Stop playback with dedicated button.
- Clean, modern UI with cards and icons.


## Setup

1. **Prerequisites**:
   - Node.js (18+)
   - Expo CLI (`npm install -g expo-cli`)
   - Python (3.8+)
   - ffmpeg (for Flask server)

2. **Clone Repositories**:
   ```bash
   git clone https://github.com/fadymikhael/RAVE-APPLICATION.git
   git clone https://github.com/gnvIRCAM/RAVE-ONNX-Server.git
   ```

3. **Start Flask Server**:
   ```bash
   cd RAVE-ONNX-Server
   pip install -r requirements.txt
   python server.py
   ```
   - Add `.onnx` models to `/models` folder.
   - Note server IP/port (e.g., `192.168.1.100:5000`).

4. **Run Mobile App**:
   ```bash
   cd RAVE-APPLICATION
   npm install
   expo start
   ```
   - Scan QR code with Expo Go app.
   - Enter server IP/port in app’s Home page.

## Usage

1. Open app on a physical device.
2. Set server IP/port.
3. Choose a model (e.g., Jazz).
4. Select or record audio (`sample.mp3` default).
5. Tap “Transformer le son” to process.
6. Play original/transformed audio; stop with “Arrêter”.

## Dependencies

- `react-native`
- `react-redux`
- `expo-av`
- `expo-file-system`
- `expo-asset`
- `@expo/vector-icons`

Install with:
```bash
npm install
```

## Tips

- Test audio on a physical device for loudspeaker output.
- Ensure phone and server are on same Wi-Fi.
- Update `app.json` for assets:
  ```json
  {
    "expo": {
      "assets": ["./assets/sample.mp3"]
    }
  }
  ```

## License

MIT License. See [LICENSE](LICENSE) file.
