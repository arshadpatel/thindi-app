
# Contributing to Thindi App

Thank you for considering contributing to the **Thindi App**! By participating in this project, you’re helping create a web application that enhances the canteen experience for both students and vendors. Whether you’re fixing bugs, proposing new features, or improving the documentation, your contributions are welcome.

This project is part of **Hacktoberfest 2024**, and contributions made during this period are especially encouraged. Please ensure you read and follow the guidelines below to make the process as smooth as possible.

## 💡 How to Contribute

### Step 1: Fork the Repository

Fork the repository to your GitHub account by clicking the "Fork" button on the top right of this page.

### Step 2: Clone the Forked Repository

Once you've forked the project, clone the repository to your local machine:

```bash
git clone https://github.com/arshadpatel/thindi-app.git
cd thindi-app
```

### Step 3: Pick an Issue

Browse through the [Issues](https://github.com/arshadpatel/thindi-app/issues) section. Look for issues with the **Hacktoberfest** label or those that interest you. If you want to work on something else, feel free to propose it by opening a new issue.

Make sure that the issue:
- Has a **clear and well-defined scope**.
- Does not overlap with someone else's ongoing work.

### Step 4: Create a New Branch

Create a new branch for your contribution:

```bash
git checkout -b <branch-name>
```

Ensure your branch name reflects the purpose of the work (e.g., `fix-bug-in-payment`, `add-new-feature-x`).

### Step 5: Make Changes

1. Make your code changes.
2. Write clear and meaningful commit messages. For example:
   ```bash
   git commit -m "Fix: Correct payment gateway bug in order submission"
   ```

### Step 6: Test Changes Locally

Please ensure that all your changes are tested locally. Run the frontend and backend, and make sure everything works as expected:

### Step 7: Push Changes to Your Fork

Once you’re satisfied with your changes, push them to your fork:

```bash
git push origin <branch-name>
```

### Step 8: Create a Pull Request

Go to the [original repository](https://github.com/arshadpatel/thindi-app) and create a pull request from your fork. Your PR should:
- Describe the changes you made.
- Reference the issue you are resolving (if applicable).
- Include relevant screenshots or explanations if needed.

The project maintainers will review your PR and provide feedback if necessary. Be sure to respond to feedback promptly.

## 🤖 Contribution Guidelines

- **Follow the Project Structure**: Make sure your code follows the existing structure of the project and adheres to the defined conventions.
- **Write Clear Commit Messages**: Provide meaningful and descriptive commit messages.
- **Avoid Unnecessary Changes**: Avoid unrelated changes such as formatting fixes that are not part of your contribution.
- **Stay Organized**: When contributing, try to keep changes organized and focused on a single objective (fix a bug, add a feature, etc.).

## 📝 Code Style

To maintain consistency across the codebase, please adhere to the following guidelines:
- **Indentation**: Use 2 spaces for indentation.
- **Variable Naming**: Use meaningful variable names in camelCase.
- **Comments**: Use comments when necessary to explain complex logic.
- **React Component Naming**: Use PascalCase for component names and filenames.

## 🛠 Development Setup

### Backend
The backend is built using **Node.js** with **Express.js** and **MongoDB**. If you’re working on backend functionality, make sure you have Node.js and MongoDB installed locally, or use MongoDB Atlas for a cloud instance.

### Frontend
The frontend uses **React.js**. If you’re contributing to the frontend, make sure you have a basic understanding of React components, routing, and state management.

### Database
If you're working on database-related tasks, familiarize yourself with **MongoDB**. We use **Mongoose** for database modeling.

### Payment Integration
We use **Razorpay** for UPI payments. If your contribution involves payment integration, make sure to test it with sandbox API keys.

## 👩‍💻 New to GitHub and Open Source?

If you are new to GitHub and open source, follow these resources to get started:
- [How to Fork a Repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
- [How to Create a Pull Request](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)
- [Git Command Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

## 🎯 Hacktoberfest Guidelines

As part of **Hacktoberfest 2024**, your pull request will be considered if:
- Your PR adheres to the project guidelines.
- You make a meaningful contribution (no low-effort PRs like fixing typos or adding unnecessary comments).
- The pull request is accepted by the maintainers (either merged or marked with the `hacktoberfest-accepted` label).

If you have any questions or need clarification, feel free to open a discussion in the [GitHub Discussions](https://github.com/arshadpatel/thindi-app/discussions) section.


## 🏆 Acknowledgments

Thanks again for your interest in contributing to the **Thindi App**. We value your efforts in making this app successful. Your contribution, whether big or small, makes a huge difference!

Happy Coding!
