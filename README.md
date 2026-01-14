# UBS Watchdog

Front-end of the Watchdogs Compliance solution.

## Requiriments to run

Nodejs v22.21.1 or above.
npm 10.9.4 or above.
pnpm 10.27.0 or above.

## How to build and run the application locally

Run `npm i --save-dev @types/react` or `npm i` first to install depedencies.
Run `npm run build` to build the app.
Run `npm run dev` to start the development server.
Application will launch on specified port.


## How to run E2E login test
In one terminal, start the app and leave it running:
`Run npm run dev`

In another terminal, run Cypress:
`npm run cy:open` (and then run login.cy.ts)
or headless: `npm run test:e2e`.
