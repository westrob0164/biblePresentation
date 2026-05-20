Create a new file named docs/git_and_ai_workflow.md inside your local docs/ folder [1]. Paste the raw text below directly into it. This file serves as a complete command cheat sheet for you and an instructional guide for any AI engine you use [1].
------------------------------
## Git Management & AI Collaboration Guide
This document defines the protocols for pushing code updates to GitHub and feeding codebase context efficiently into AI models [1].
## 1. Git Command Cheat Sheet## How to Upload a Single Specific File
Use this when you have only modified or created one specific file and want to isolate its commit.

git add js/main.js
git commit -m "Update main.js"
git push origin main

## How to Upload Multiple Specific Files
Use this to group related file updates together (e.g., a component and its matching stylesheet) while leaving other modified files workspace changes behind.

git add js/components/cardBuilder.js css/components/cardBuilder.css
git commit -m "Create cardBuilder UI module and matching styles"
git push origin main

## How to Upload the Whole Project
Use this to track and stage every single file creation, modification, or deletion across your entire directory tree at once.

git add .
git commit -m "Refactor entire core framework architecture"
git push origin main

------------------------------
## 2. Best Practices for Passing Code to AI
When working with an AI assistant on a project generated from this template, choose the delivery method that fits your file sizes.
## Method A: Single File Updates (For targeted debugging or feature additions)
Copy and paste individual script files directly into the window using plain text markers like this:

--- FILE: js/logic/taskManager.js ---
[Paste code here]

## Method B: Codebase Bundling (For full system architecture reviews)
If your application grows large and you need the AI to analyze multiple interacting files at once, run the Repomix tool inside your root folder:

npx repomix

This generates a single repomix-output.md text pack containing your complete subfolder logic. Paste the text contents of that output file into the chat window. If the file exceeds the single-message input box character capacity, split the text block in half and send it across two separate consecutive messages.
------------------------------
## 3. Core Pro-Tips for Template Maintenance

* Protect the 'vender' Directory: Never let an external package manager overwrite or purge your js/vender/ folder. This project framework relies on local, offline file access to guarantee that your start_server.bat local execution continues to boot without internet dependency.
* The .gitkeep Rule: If you delete all files inside a modular subfolder (like js/logic/) during a project cleanup, immediately drop an empty file named .gitkeep inside it. Git tracks files, not empty directory nodes; without a placeholder file, your folders will vanish from your cloud repository history.
* Prevent Token Leaks: If your database layer changes from SQLite to an external network API in a future project, never hardcode authentication credentials directly inside utilities/config.js. Keep access details isolated inside a separate file configuration that is barred from being pushed to GitHub via your system records.

------------------------------
## Final Push
Save this markdown file locally on your desktop. To lock this final operational document into your live cloud repository profile forever, open your command window prompt and execute these final sync steps:

git add docs/git_and_ai_workflow.md
git commit -m "Create comprehensive Git and AI developer guide in docs folder"
git push origin main

