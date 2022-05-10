const web3 = require('alephium-web3')

const client = new web3.CliqueClient({ baseUrl: 'http://127.0.0.1:22973' })
web3.Contract.fromSource(client, 'voting.ral')
web3.Script.fromSource(client, 'token_allocation.ral')
web3.Script.fromSource(client, 'voting_script.ral')
web3.Script.fromSource(client, 'closing_script.ral')
