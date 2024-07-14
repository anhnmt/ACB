# ACB
An unofficial API wrapper library for Asia Commercial Joint Stock Bank (ACB)

<a href="https://github.com/AuraTeamAZ/DiscordNexus"><img src="https://github.com/AuraTeamAZ/ACB/actions/workflows/npm-publish-github-packages.yml/badge.svg" alt="CI" /></a>
<a href="https://github.com/AuraTeamAZ/ACB/releases"><img alt="Github total downloads" src="https://img.shields.io/github/downloads/AuraTeamAZ/ACB/total?label=downloads%40total"></a>
<a href="https://discord.gg/6ayTMsaEsa"><img src="https://img.shields.io/discord/1241921327720431626?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>

# Install
```bash
$ npm i @aurateam/acb
```

# Quick Start
```ts
const { ACB } = require("@aurateam/acb");

const acb = new ACB({ username: "", password: "" });
```

# Get account balances:
```ts
await acb.getBalance();
```

# Get transaction history
```ts
await acb.getTransactionsHistory();
```

# Additional Notes

- If you found bugs or want to give suggestions, please visit <a href="https://github.com/AuraTeamAZ/ACB/issues">here</a> or join our Discord server.
- We accept all contributions! If you want to contribute, please make a pull request in <a href="https://github.com/AuraTeamAZ/ACB/pulls">here</a>.

# License
Licensed under the [MIT](https://github.com/AuraTeamAZ/ACB/blob/master/LICENSE) license.
