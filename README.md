# Google Calendar Quick Add

Google Calendar Quick Add is an Electron-based desktop application that allows users to quickly add events to their Google Calendar. The app provides a modern and user-friendly interface for scheduling events, with features like date and time pickers, input validation, and integration with the Google Calendar API.

## Features

- Add events to your Google Calendar with a simple and intuitive interface.
- Modern design with a black/gray gradient theme and white text.
- Date and time pickers powered by Flatpickr for a sleek user experience.
- Input validation and sanitization to ensure data integrity.
- OAuth2 authentication with Google for secure access to your calendar.
- Global shortcut (`Ctrl+Shift+G`) to open the app quickly.
- Tray menu for easy access to the app.

## Technologies Used

- **Electron**: For building the desktop application.
- **Google Calendar API**: For interacting with the user's Google Calendar.
- **Flatpickr**: For modern date and time pickers.
- **Express**: For handling OAuth2 redirection.
- **dotenv**: For managing environment variables.
- **Node.js**: For backend logic and API integration.

## Setup Instructions

Follow these steps to set up and run the project:

### 1. Clone the Repository
```bash
git clone https://github.com/bskmrkvc/google-calendar-quick-add.git
cd google-calendar-quick-add
```

### 2. Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```

### 3. Set Up Google API Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the **Google Calendar API** for your project.
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services > Credentials**.
   - Click **Create Credentials > OAuth 2.0 Client IDs**.
   - Set the redirect URI to `http://localhost:3000/oauth2callback`.
5. Download the `credentials.json` file.
6. Place the `credentials.json` file in the `config` folder in the root directory of the project.

### 4. Create a `.env` File

Create a `.env` file in the root directory and add the following environment variables:

```
TOKEN_PATH=./config/token.json
CREDENTIALS_PATH=./config/credentials.json
OAUTH_URL=http://localhost:3000/oauth
SUCCESS_URL=http://localhost:3000/success
TIME_ZONE=Europe/Belgrade
```

### 5. Run the Application

Start the application using the following command:

```bash
npm start
```

### 6. Use the Application

- Press `Ctrl+Shift+G` to open the app.
- Use the form to add events to your Google Calendar.

## Project Structure

```
google-calendar-quick-add/
├── config/                 # Configuration files (e.g., credentials.json, token.json)
├── src/
│   ├── app/                # Core application logic (window, tray, shortcuts)
│   ├── auth/               # OAuth2 authentication logic
│   ├── calendar/           # Google Calendar API integration
│   ├── ipc/                # IPC handlers for communication between main and renderer processes
│   ├── views/              # HTML, CSS, and JS for the app's UI
│       ├── event-scheduler/
│       ├── error/
├── .env                    # Environment variables
├── .gitignore              # Files and folders to ignore in version control
├── main.js                 # Main process entry point
├── preload.js              # Preload script for secure context
├── package.json            # Project metadata and dependencies
```

## Dependencies

- [Electron](https://www.electronjs.org/)
- [Google APIs Node.js Client](https://github.com/googleapis/google-api-nodejs-client)
- [Flatpickr](https://flatpickr.js.org/)
- [Express](https://expressjs.com/)
- [dotenv](https://github.com/motdotla/dotenv)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

### Author

Developed by **Bosko Markovic**. If you have any questions or feedback, feel free to reach out!

