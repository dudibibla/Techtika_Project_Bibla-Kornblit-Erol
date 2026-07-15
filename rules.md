# Project Rules

This document outlines the workflow and quality guidelines for the project. All contributors must follow these rules:

## 1. Branching Strategy
- **Base Branch:** All new feature branches must be created from `Develop` (and NOT from `main`).
- **Naming Convention:** Use clear names for feature branches (e.g., `feature/feature-name`).

## 2. Session Start Workflow
- **Always Pull First:** Before starting any new development session, run `git pull` (or `git fetch` and merge/rebase) to ensure your local environment has all the latest changes from the remote repository.

## 3. Code Quality
- Write clean, readable, and well-documented code.
- Avoid committing raw credentials or temporary debug files.
- Test your changes locally before committing and pushing.
