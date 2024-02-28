# Robo Galactic Shooter

Retro Video Game developed in Kontra and sfxr JS libraries, as a part of JS13k Challenge 2018.

[Demo](https://js13kgames.com/games/robo-galactic-shooter/index.html) and [First Release](https://github.com/AshBardhan/robo-galactic-shooter/tree/js-13k-games-2018) of the game.

## Introduction

This is not just another space robot shooter game. Your planet is under threat as the asteroids are approaching with uncertain speed. Your mission is to destroy them all before your battery is drained out completely and making you offline permanently. However, you can look for golden stars to recharge battery.

Survive till you go full offline!

## Controls

- Arrow Keys - Menu Toggle/Robot Movement
- Enter - Confirm/Continue
- Space - Shoot
- P - Pause/Resume Game

## Contribution

### Setup

- [Fork this repo](https://help.github.com/articles/fork-a-repo) and clone it on your system.
- Make sure that you're using node version **v21.6.0** for this application. Use [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) for switching to this node versions.
- Install all the required dependencies by running `yarn install`.
- Create a new branch out off `master` for your fix/feature by running `git checkout -b new-feature`.
- Build this project by running the following commands
  - `grunt` - This creates `index.html` and unminified `game.js` inside `dist` folder and a watcher task.
  - `grunt release` - This creates `index.html` and minified `game.js` inside `dist` folder.
- Open the generated `index.html` file in your browser to run and play the game application.

### Things to remember

- Do not fix multiple issues in a single commit. Keep them one thing per commit so that they can be picked easily in case only few commits require to be merged.
- Before submitting a patch, rebase your branch on upstream `master` to make life easier for the merger.

### License

MIT Licensed

Copyright (c) 2024 Ashish Bardhan, [ashbardhan.github.io](https://ashbardhan.github.io)
