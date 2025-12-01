# Robo Galactic Shooter

Retro Video Game developed in `Kontra` and `sfxr` JS libraries, as a part of JS13k Challenge 2018.

**First Release:** v1.0.0 - [Demo](https://js13kgames.com/games/robo-galactic-shooter/index.html) and [Codebase](https://github.com/AshBardhan/robo-galactic-shooter/tree/js-13k-games-2018)

**Latest Release:** v2.5.1 - [Demo](https://robo-galactic-shooter.netlify.app) and [Codebase](https://github.com/AshBardhan/robo-galactic-shooter/tree/main)

## Introduction

This is not just another space robot shooter game. Your planet is under threat as asteroids are approaching at uncertain speeds. Your mission is to destroy them all before your battery drains completely and makes you offline permanently. However, you can look for golden stars to recharge your battery.

Survive until you go fully offline!

## Features

- Classic arcade-style gameplay with modern synthwave aesthetics
- Automatic day/night theme switching based on local time
- Procedurally generated sound effects using `sfxr`
- Smooth animations and particle effects
- Responsive design with adaptive scaling
- Progressive difficulty as you survive longer

## Controls

| Key         | Action                       |
|-------------|------------------------------|
| Arrow Keys  | Menu Toggle / Robot Movement |
| Enter       | Confirm / Continue           |
| Space       | Shoot                        |
| Esc         | Pause / Resume Game          |

## Screenshots

![screen-1](/docs/screen-1.png) ![screen-2](/docs/screen-2.png)

## Tech Stack

- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Kontra** - Lightweight 2D game engine for HTML5 Canvas
- **sfxr** - Sound effect generation library
- **ESLint** - Code linting and quality assurance
- **Stylelint** - CSS linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit automation
- **Netlify** - Deployment and hosting platform

## Project Structure

```plaintext
robo-galactic-shooter/
├── src/
│   ├── index.ts              # Main game entry point
│   ├── render.ts             # Rendering utilities
│   ├── sprites.ts            # Game sprite definitions
│   ├── styles.css            # Synthwave theme styles with day/night mode
│   ├── constants/
│   │   ├── game.ts           # Game configuration constants
│   │   ├── pixel.ts          # Pixel art constants
│   │   └── sound.ts          # Sound effect constants
│   ├── lib/
│   │   ├── riffwave.js       # WAVE audio file generator
│   │   └── sfxr.js           # Sound effect synthesizer
│   ├── types/
│   │   ├── riffwave.d.ts     # Type definitions for riffwave
│   │   ├── sfxr.d.ts         # Type definitions for sfxr
│   │   └── sprites.ts        # Type definitions for sprites
│   └── utils/
│       ├── number.ts         # Number utility functions
│       ├── sound.ts          # Sound generation utilities
│       └── theme.ts          # Day/night theme management
├── public/
│   ├── robot-icon.svg        # Favicon and app icon
│   └── assets/               # Static game assets
├── docs/                     # Documentation and screenshots
├── .stylelintrc.json         # Stylelint configuration
├── eslint.config.mjs         # ESLint configuration
├── tsconfig.json             # TypeScript configuration
├── vite.config.js            # Vite build configuration
├── update-version.js         # Version update script
└── package.json              # Project dependencies and scripts
```

## Contribution

### Getting Started

1. **Fork and Clone**
   - [Fork this repository](https://help.github.com/articles/fork-a-repo) to your GitHub account
   - Clone your fork locally:

     ```bash
     git clone https://github.com/YOUR_USERNAME/robo-galactic-shooter.git
     cd robo-galactic-shooter
     ```

2. **Set Up Environment**
   - Ensure you're using **Node v21.6.0** (use [nvm](https://github.com/nvm-sh/nvm) to switch versions)
   - Install dependencies:

     ```bash
     npm install
     ```

3. **Create a Branch**
   - Create a new branch for your fix or feature:

     ```bash
     git checkout -b feature/your-feature-name
     ```

4. **Start Development**
   - Run the development server:

     ```bash
     npm run dev
     ```

   - Open `http://localhost:5173` in your browser

### Development Guidelines

- **One commit per issue** - Keep commits focused on a single change for easier cherry-picking
- **Sync before submitting** - Merge the latest changes from upstream `main` into your branch to avoid conflicts: `git merge origin/main`
- **Test thoroughly** - Ensure your changes work as expected and don't break existing functionality
- **Follow code style** - The project uses ESLint, Stylelint, Prettier, and Husky for code quality
- **Run linters** - Use `npm run lint:fix` and `npm run lint:css:fix` before committing

### Submitting Request for Change

1. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request**
   - Go to the [original repository](https://github.com/AshBardhan/robo-galactic-shooter)
   - Click **"Pull requests"** → **"New pull request"** → **"compare across forks"**
   - Select your fork and branch, then **"Create pull request"**

3. **Describe Your Changes**
   - Write a clear title (e.g., "Add particle explosion effects")
   - Explain what your changes do and why
   - Include screenshots/GIFs for visual changes
   - Note any breaking changes or new dependencies

4. **Respond to Feedback**
   - Address any requested changes from reviewers
   - Push updates to the same branch - the PR will update automatically

### Versioning and Deployment (Admin Only)

Once your contribution is merged, it will be included in the next release. The code admin/maintainer will take care of the following:

1. Update the version number following [Semantic Versioning](https://semver.org/):
   - **PATCH** (2.5.x) - Bug fixes and small improvements
   - **MINOR** (2.x.0) - New features and enhancements
   - **MAJOR** (x.0.0) - Breaking changes

2. Create a git tag and GitHub release with changelog
3. Deploy automatically to Netlify

**Note**: You don't need to update version numbers yourself - maintainers handle this during release.

### License

MIT Licensed

Copyright (c) 2025 Ashish Bardhan, [ashbardhan.github.io](https://ashbardhan.github.io)
