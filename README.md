# Robo Galactic Shooter

Retro Video Game developed in Kontra and sfxr JS libraries, as a part of JS13k Challenge 2018.

**First Release:** v1.0.0 - [Demo](https://js13kgames.com/games/robo-galactic-shooter/index.html) and [Codebase](https://github.com/AshBardhan/robo-galactic-shooter/tree/js-13k-games-2018)

**Latest Release:** v2.4.1 - [Demo](https://robo-galactic-shooter.netlify.app) and [Codebase](https://github.com/AshBardhan/robo-galactic-shooter/tree/main)

## Introduction

This is not just another space robot shooter game. Your planet is under threat as the asteroids are approaching with uncertain speed. Your mission is to destroy them all before your battery is drained out completely and making you offline permanently. However, you can look for golden stars to recharge battery.

Survive till you go full offline!

## Tech Stack

- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Kontra** - Lightweight 2D game engine for HTML5 Canvas
- **sfxr** - Sound effect generation library
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit automation
- **Netlify** - Deployment and hosting platform

## Controls

| Key         | Action                       |
|-------------|------------------------------|
| Arrow Keys  | Menu Toggle / Robot Movement |
| Enter       | Confirm / Continue           |
| Space       | Shoot                        |
| Esc         | Pause / Resume Game          |

## Screenshots

![screen-1](/docs/screen-1.png) ![screen-2](/docs/screen-2.png)

## Contribution

### Setup

- [Fork this repo](https://help.github.com/articles/fork-a-repo) and clone it on your system.
- Ensure you are using **Node v21.6.0**. You can switch versions easily with [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating).
- Install all the required dependencies by running `npm install`.
- Create a new branch out off `main` for your fix/feature by running `git checkout -b new-feature`.
- Start the development server by running `npm run dev`
- Open your browser at `http://localhost:5173` and play the game.

### Things to remember

- Do not fix multiple issues in a single commit. Keep them one thing per commit so that they can be picked easily in case only few commits require to be merged.
- Before submitting a patch, rebase your branch on upstream `main` to make life easier for the merger.

### License

MIT Licensed

Copyright (c) 2025 Ashish Bardhan, [ashbardhan.github.io](https://ashbardhan.github.io)
