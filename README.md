# Patient Listing App

This is a frontend-facing application built with Vite and React. It uses Tailwind CSS and Shadcn UI for styling. The app communicates with a HAPI FHIR server and allows users to store, delete, and manage patient records.

## Setup

To run this app locally, follow these steps:

1. Clone the repository.
2. Install the dependencies by running `npm install` in the root directory.
3. Copy the contents of `.env.example` to a new file named `.env` and update the environment variables with your own values.
4. Start the development server by running `npm run dev`.
5. Open your browser and navigate to `http://localhost:5173` to view the app.

## Environment Variables

The following environment variables are required to run the app:

-   `VITE_FHIR_BASE_URL`: The base URL of the HAPI FHIR server.

## System Requirements

To run this app, you will need the following:

-   Node.js (version 14 or higher)
-   npm or Yarn package manager
-   A HAPI FHIR server running on the specified base URL

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
