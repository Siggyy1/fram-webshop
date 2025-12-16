## FRAM, a Sustainable Food Delivery 
#### Project Description:

FRAM is a small web based project that simulates a sustainable food delivery service connected to local farms. The project includes a simple online shop, a shopping basket, a newsletter signup, and an AI powered chatbot that helps users with questions about the service.

The goal of this project is to demonstrate basic frontend development, simple backend logic, accessibility awareness, and responsible use of an AI API. The project is not meant to be production ready, but to show understanding of structure, interaction, and ethical AI use.

The chatbot is built using the OpenAI API and is limited to answering questions about FRAM, the service, and partner farms.

### Technologies Used:

HTML

CSS

JavaScript

Node.js

Express

OpenAI API

### Setup and Installation: 

To run this project locally, you need to have the following installed:

Node.js

npm

1. Clone the repository
git clone https://github.com/Siggyy1/fram-webshop.git
cd server

2. Install backend dependencies

Navigate to the backend folder if applicable, or run in the root folder if everything is in one place:

npm install

3. Create a .env file

Create a file called .env in the /server folder and add your own OpenAI API key(this is something I could not add to github for security reasons:

OPENAI_API_KEY=your_api_key_here <----

### How to Run the Application Locally:
1. Start the backend server

Run the following command:

node server.js

The server will run on:

http://localhost:3001

2. Open the frontend

Open the project using a local web server. For example:

VS Code Live Server, so either press the Go Live button at the bottom right, or right click index.hmtl and click "Open with live server"

### Accessibility:

The project aims to follow WCAG 2.1 AA guidelines. This includes:

Keyboard navigation support

Visible focus states

Skip to content links

Proper use of aria labels

Screen reader friendly form inputs and dialogs

### Known Limitations:

No user accounts or authentication

Data such as basket content is stored in local storage only

Chat history is not persisted after page reload

No real database is used

The chatbot responses depend on the OpenAI API and may vary

If you click the basket, it will take you to the product site, and there is the only place it will show. But did not have time to fix that problem. 

Due to some techinal problems with github, I had to make a new repository so there is no good commit log. (I accidentaly added the .env file to github which had my OpenAi Apikey, so for security reasons I just deleted the other repo and made a new one)

### Future Improvements:

Possible future improvements include:

Adding a database for products, users, and chat history

User accounts and login functionality

More structured chatbot responses such as quick reply buttons

Improved error handling and logging

Deployment to a hosting platform

### Ethical Use of AI:

The chatbot is designed with ethical considerations in mind:

It does not request or store personal sensitive information

It only answers questions related to the service

A clear privacy notice is shown to the user

The AI is clearly presented as a chatbot and not a human
