# EditEz

![File container](./assets/my_files.png)

EditEz is a comprehensive editor application that allows users to create, edit, delete, and download markdown files. It offers powerful features like file summarization using LLMs (Large Language Models) and vector search to efficiently search through files. The application now includes JWT authentication, protected routes, user login and registration, and improved responsiveness. Future updates will include support for additional file formats such as PDF, DOCX, and TXT.


## Features

- **Create and Save Markdown Files**: Effortlessly create and save your notes in markdown format.
- **Edit, Delete, and Download Files**: Manage your saved notes with ease by editing, deleting, or downloading them.
- **Summarize Files**: Get concise summaries of your markdown files using advanced LLMs.
- **Vector Search**: Perform powerful vector-based searches through your files for efficient information retrieval.
- **User Authentication**: Secure JWT-based authentication system with user registration and login.
- **Protected Routes**: Ensure that certain parts of the application are only accessible to authenticated users.
- **Responsive Design**: Improved user experience across various device sizes and screen resolutions.
- **Multiple Models Options**: Choose from a variety of LLMs and models for vector search and summarization.
- **Support for Additional File Formats (Coming Soon)**: Upload and work with PDF, DOCX, and TXT files to leverage all features available for markdown files.

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Flask, SQLAlchemy, PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Embeddings and Summarization**: HuggingFace Transformers, PyTorch
- **Database**: PostgreSQL
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- Node.js
- Python 3.10+
- PostgreSQL

### Installation

1. **Clone the Repository**:

   ```sh
   git clone https://github.com/oceakun/editez.git
   cd editez
    ```

2. **Setup Environment Variables**:
    Create a `.env` file in the root directory and configure the following variables:
    ```sh
    DATABASE_URL=postgresql://postgres:password@postgres:5432/dbname
    PORT=4000
    ```

3. **Build and Run Docker Containers**:
    ```sh
    docker-compose up --build
    ```

4. **Install Frontend Dependencies**:
    ```sh
    cd client
    pnpm install
    pnpm dev
    ```

### Directory Structure

![Directory Structure](./assets/directory-structure.png)


### Usage

1. **Access the Application**:
    Open your web browser and navigate to `http://localhost:3000`.

2. **Create a Note**:
    - Click on the "Create Note" button.
    - Enter your note content in markdown format.
    - Save the note.

3. **Manage Notes**:
    - Edit or delete notes from the notes list.
    - Download notes in markdown format.

4. **Summarize Notes**:
    - Select a note to view.
    - Click on the "Summarize" button to get a summary of the note content.

5. **Search Notes**:
    - Use the search bar to perform vector-based searches through your notes.

### Future Enhancements

- **Support for Additional File Formats**: Upload and manage PDF, DOCX, and TXT files with the same capabilities as markdown files.

### Contributing

Contributions are welcome, just create an issue!

### Credits
*https://github.com/jod35/JWT-Auth-for-Flask*
A majority of this repository's code was used for the JWT authentication API.

*https://github.com/sungvzer/NoteTakingApp*
This project provided a skeleton for the UI.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.